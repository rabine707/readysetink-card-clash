import { describe, expect, it } from "vitest";
import { buildLorcanaJsonIndex, normalizeCard } from "../scripts/card-data.mjs";

const lorcastPromo = {
  id: "mickey-ja",
  name: "Mickey Mouse",
  version: "True Friend",
  collector_number: "25ja",
  lang: "en",
  rarity: "Promo",
  illustrators: ["Sample Artist"],
  set: { code: "P1", name: "Promo Set 1" },
  image_uris: { digital: { large: "https://cards.example/mickey.avif" } }
};

describe("card catalog normalization", () => {
  it("uses the collector suffix when Lorcast reports the wrong language", () => {
    const row = normalizeCard(lorcastPromo, new Map());
    expect(row?.language).toBe("ja");
    expect(row?.collector_number).toBe("25ja");
  });

  it("enriches matched promo prints without replacing the Lorcast identity or image", () => {
    const index = buildLorcanaJsonIndex({ cards: [{
      name: "Mickey Mouse",
      version: "True Friend",
      number: 25,
      promoGrouping: "P1",
      promoSource: "Convention exclusive",
      promoSourceCategory: "Convention"
    }] });
    const row = normalizeCard(lorcastPromo, index);
    expect(row).toMatchObject({
      id: "mickey-ja",
      image_url: "https://cards.example/mickey.avif",
      promo_source: "Convention exclusive",
      promo_source_category: "Convention"
    });
  });

  it("keeps illustrator credits from Lorcast", () => {
    const row = normalizeCard(lorcastPromo, new Map());
    expect(row?.illustrators).toEqual(["Sample Artist"]);
  });
});
