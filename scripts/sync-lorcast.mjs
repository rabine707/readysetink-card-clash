import { createClient } from "@supabase/supabase-js";

// Unlike `next dev`, a plain Node script does not load Next.js env files.
// Node 22+ can load the same local file without an extra dependency.
try {
  process.loadEnvFile(".env.local");
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const apiBase = process.env.LORCAST_API_URL || "https://api.lorcast.com/v0";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalize(card) {
  const image = card.image_uris?.digital?.large || card.image_uris?.digital?.normal || card.image_uri;
  if (!card.id || !card.name || !image) return null;
  return {
    id: String(card.id),
    name: card.name,
    version: card.version || null,
    image_url: image,
    set_code: card.set?.code || card.set_code || null,
    set_name: card.set?.name || card.set_name || null,
    ink: Array.isArray(card.ink) ? card.ink.join(", ") : card.ink || card.color || null,
    rarity: card.rarity || null,
    classifications: card.classifications || [],
    released_at: card.released_at || card.set?.released_at || null,
    is_active: true,
    updated_at: new Date().toISOString()
  };
}

async function getJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "CardClash/0.1" }
  });
  if (!response.ok) {
    throw new Error(`Lorcast returned ${response.status}: ${await response.text()}`);
  }
  return response.json();
}

// Fetch by set so a search-syntax change cannot silently empty the catalog.
const setsPayload = await getJson(`${apiBase}/sets`);
const sets = setsPayload.results || setsPayload.data || [];
if (!sets.length) throw new Error("Lorcast returned no sets.");

let total = 0;
for (const set of sets) {
  const setId = set.id || set.code;
  if (!setId) continue;
  const payload = await getJson(`${apiBase}/sets/${encodeURIComponent(setId)}/cards`);
  const cards = Array.isArray(payload) ? payload : payload.results || payload.data || [];
  const rows = cards.filter((card) => !card.lang || card.lang === "en").map(normalize).filter(Boolean);
  if (rows.length) {
    const { error } = await supabase.from("card_clash_cards").upsert(rows, { onConflict: "id" });
    if (error) throw error;
    total += rows.length;
    process.stdout.write(`Synced ${total} cards through ${set.code || set.name || setId}\n`);
  }
  await sleep(100);
}
process.stdout.write(`Card Clash sync complete: ${total} cards.\n`);
