import { describe, expect, it } from "vitest";
import { cardProvenanceLine, cardSetLine } from "../lib/card-metadata";

const promo = {
  set_code: "P1",
  set_name: "Promo Set 1",
  collector_number: "25ja",
  language: "ja",
  rarity: "Promo",
  promo_source: null,
  promo_source_category: null
};

describe("card display metadata", () => {
  it("shows set, collector number, and rarity", () => {
    expect(cardSetLine(promo)).toBe("Promo Set 1 · #25ja · Promo");
  });

  it("explains foreign-language promotional prints", () => {
    expect(cardProvenanceLine(promo)).toBe("Japanese promotional print");
  });

  it("prefers a specific promotional source when available", () => {
    expect(cardProvenanceLine({
      ...promo,
      language: "en",
      promo_source: "D23 Expo 2022",
      promo_source_category: "D23"
    })).toBe("D23 Expo 2022");
  });
});
