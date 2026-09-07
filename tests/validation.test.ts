import { describe, expect, it } from "vitest";
import { parseRecentIds, voteSchema } from "../lib/validation";

describe("vote validation", () => {
  const base = { clashId: crypto.randomUUID(), leftCardId: "a", rightCardId: "b", result: "tie", sessionId: crypto.randomUUID() };
  it("accepts a valid tie", () => expect(voteSchema.safeParse(base).success).toBe(true));
  it("rejects self-pairing", () => expect(voteSchema.safeParse({ ...base, rightCardId: "a" }).success).toBe(false));
  it("rejects unknown results", () => expect(voteSchema.safeParse({ ...base, result: "maybe" }).success).toBe(false));
  it("bounds and deduplicates recent ids", () => expect(parseRecentIds("a,a,b")).toEqual(["a", "b"]));
});
