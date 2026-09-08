export function textKey(value) {
  return String(value || "").trim().toLocaleLowerCase("en-US");
}

export function collectorLanguage(collectorNumber, reportedLanguage) {
  const suffix = String(collectorNumber || "").match(/(de|en|es|fr|it|ja|zh)$/i)?.[1];
  return (suffix || reportedLanguage || "en").toLowerCase();
}

function lorcanaJsonKey({ name, version, number, group }) {
  return [textKey(name), textKey(version), String(number || ""), textKey(group)].join("\u0000");
}

export function buildLorcanaJsonIndex(payload) {
  const index = new Map();
  for (const card of payload.cards || []) {
    const group = card.promoGrouping || card.setCode;
    index.set(lorcanaJsonKey({ ...card, group }), card);
  }
  return index;
}

export function findLorcanaJsonCard(card, index) {
  const collectorNumber = String(card.collector_number || "").replace(/(de|en|es|fr|it|ja|zh)$/i, "");
  const setCode = card.set?.code || card.set_code || "";
  const groups = setCode.toLowerCase() === "cp" ? ["C1", "cp"] : [setCode];
  for (const group of groups) {
    const match = index.get(lorcanaJsonKey({
      name: card.name,
      version: card.version,
      number: collectorNumber,
      group
    }));
    if (match) return match;
  }
  return null;
}

export function normalizeCard(card, lorcanaJsonIndex) {
  const image = card.image_uris?.digital?.large || card.image_uris?.digital?.normal || card.image_uri;
  if (!card.id || !card.name || !image) return null;
  const enriched = findLorcanaJsonCard(card, lorcanaJsonIndex);
  return {
    id: String(card.id),
    name: card.name,
    version: card.version || null,
    image_url: image,
    set_code: card.set?.code || card.set_code || null,
    set_name: card.set?.name || card.set_name || null,
    collector_number: card.collector_number ? String(card.collector_number) : null,
    language: collectorLanguage(card.collector_number, card.lang),
    promo_source: enriched?.promoSource || null,
    promo_source_category: enriched?.promoSourceCategory || null,
    ink: Array.isArray(card.ink) ? card.ink.join(", ") : card.ink || card.color || null,
    rarity: card.rarity || null,
    illustrators: Array.isArray(card.illustrators) ? card.illustrators.filter(Boolean) : [],
    classifications: card.classifications || [],
    released_at: card.released_at || card.set?.released_at || null,
    is_active: true,
    updated_at: new Date().toISOString()
  };
}
