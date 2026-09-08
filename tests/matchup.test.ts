import { describe, expect, it } from "vitest";
import { chooseMatchup } from "../lib/matchup";

const cards = [
  { id: "a", name: "A", version: null, rating: 1500, battles: 0 },
  { id: "b", name: "B", version: null, rating: 1510, battles: 1 },
  { id: "c", name: "C", version: null, rating: 1900, battles: 40 },
  { id: "d", name: "D", version: null, rating: 1490, battles: 2 },
  { id: "e", name: "E", version: null, rating: 1520, battles: 3 },
  { id: "f", name: "F", version: null, rating: 1200, battles: 50 }
];

describe("chooseMatchup", () => {
  it("avoids recent cards when enough fresh cards remain", () => {
    const result = chooseMatchup(cards, ["a", "b", "c", "d"], () => 0);
    expect([result.left.id, result.right.id].sort()).toEqual(["e", "f"]);
  });
  it("anchors on an under-voted card and never self-pairs", () => {
    const result = chooseMatchup(cards, [], () => 0);
    expect(["a", "b"]).toContain(result.left.id);
    expect(result.left.id).not.toBe(result.right.id);
  });
  it("requires at least two cards", () => {
    expect(() => chooseMatchup(cards.slice(0, 1))).toThrow("At least two cards");
  });
  it("never pairs two prints of the same gameplay card", () => {
    const variants = [
      { id: "ja", name: "Mickey Mouse", version: "True Friend", rating: 1500, battles: 0 },
      { id: "zh", name: "Mickey Mouse", version: "True Friend", rating: 1500, battles: 0 },
      { id: "other", name: "Minnie Mouse", version: "True Friend", rating: 1500, battles: 1 }
    ];
    const result = chooseMatchup(variants, [], () => 0);
    expect(new Set([result.left.name, result.right.name]).size).toBe(2);
  });
  it("keeps equivalent prints out of the next matchup", () => {
    const variants = [
      { id: "ja", name: "Mickey Mouse", version: "True Friend", rating: 1500, battles: 0 },
      { id: "zh", name: "Mickey Mouse", version: "True Friend", rating: 1500, battles: 0 },
      { id: "other-a", name: "Minnie Mouse", version: "True Friend", rating: 1500, battles: 1 },
      { id: "other-b", name: "Donald Duck", version: "Boisterous Fowl", rating: 1500, battles: 2 }
    ];
    const result = chooseMatchup(variants, ["ja"], () => 0);
    expect([result.left.id, result.right.id]).not.toContain("zh");
  });
});
