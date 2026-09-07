import { describe, expect, it } from "vitest";
import { chooseMatchup } from "../lib/matchup";

const cards = [
  { id: "a", rating: 1500, battles: 0 }, { id: "b", rating: 1510, battles: 1 },
  { id: "c", rating: 1900, battles: 40 }, { id: "d", rating: 1490, battles: 2 },
  { id: "e", rating: 1520, battles: 3 }, { id: "f", rating: 1200, battles: 50 }
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
});
