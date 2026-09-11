import { createClient } from "@supabase/supabase-js";
import { buildLorcanaJsonIndex, normalizeCard } from "./card-data.mjs";

// Unlike `next dev`, a plain Node script does not load Next.js env files.
// Node 22+ can load the same local file without an extra dependency.
try {
  process.loadEnvFile(".env.local");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const apiBase = process.env.LORCAST_API_URL || "https://api.lorcast.com/v0";
const lorcanaJsonUrl = process.env.LORCANAJSON_API_URL || "https://lorcanajson.org/files/current/en/allCards.json";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "InkList/0.1" }
  });
  if (!response.ok) {
    throw new Error(`${new URL(url).hostname} returned ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

// Fetch by set so a search-syntax change cannot silently empty the catalog.
const setsPayload = await getJson(`${apiBase}/sets`);
const sets = setsPayload.results || setsPayload.data || [];
if (!sets.length) throw new Error("Lorcast returned no sets.");

let lorcanaJsonIndex = new Map();
try {
  lorcanaJsonIndex = buildLorcanaJsonIndex(await getJson(lorcanaJsonUrl));
  process.stdout.write(`Loaded ${lorcanaJsonIndex.size} LorcanaJSON records for promo provenance.\n`);
} catch (error) {
  process.stderr.write(`LorcanaJSON enrichment unavailable; continuing with Lorcast metadata: ${error.message}\n`);
}

let total = 0;
for (const set of sets) {
  const setId = set.id || set.code;
  if (!setId) continue;
  const payload = await getJson(`${apiBase}/sets/${encodeURIComponent(setId)}/cards`);
  const cards = Array.isArray(payload) ? payload : payload.results || payload.data || [];
  const rows = cards
    .filter((card) => !card.lang || card.lang === "en")
    .map((card) => normalizeCard(card, lorcanaJsonIndex))
    .filter(Boolean);
  if (rows.length) {
    const { error } = await supabase.from("card_clash_cards").upsert(rows, { onConflict: "id" });
    if (error) throw error;
    total += rows.length;
    process.stdout.write(`Synced ${total} cards through ${set.code || set.name || setId}\n`);
  }
  await sleep(100);
}
process.stdout.write(`The Ink List sync complete: ${total} cards.\n`);
