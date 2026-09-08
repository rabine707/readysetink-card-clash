import type { ClashCard } from "./types";

type CardIdentity = Pick<ClashCard, "name" | "version">;
type CardDetails = Pick<
  ClashCard,
  | "set_code"
  | "set_name"
  | "collector_number"
  | "language"
  | "rarity"
  | "promo_source"
  | "promo_source_category"
>;

const LANGUAGE_NAMES: Record<string, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  ja: "Japanese",
  zh: "Chinese"
};

export function cardIdentityKey(card: CardIdentity): string {
  return `${card.name}\u0000${card.version ?? ""}`.trim().toLocaleLowerCase("en-US");
}

export function languageName(language: string | null): string | null {
  if (!language) return null;
  return LANGUAGE_NAMES[language.toLowerCase()] ?? language.toUpperCase();
}

export function cardSetLine(card: CardDetails): string {
  const set = card.set_name || (card.set_code ? `Set ${card.set_code}` : null);
  const number = card.collector_number ? `#${card.collector_number}` : null;
  return [set, number, card.rarity?.replaceAll("_", " ")].filter(Boolean).join(" · ");
}

export function cardProvenanceLine(card: CardDetails): string | null {
  const language = languageName(card.language);
  const isPromo = card.rarity?.toLowerCase() === "promo" || Boolean(card.promo_source_category);
  const provenance = card.promo_source || card.promo_source_category;

  if (provenance) {
    return language && language !== "English" ? `${provenance} · ${language} print` : provenance;
  }
  if (isPromo && language && language !== "English") return `${language} promotional print`;
  return null;
}
