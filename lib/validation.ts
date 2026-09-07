import { z } from "zod";

export const voteSchema = z.object({
  clashId: z.uuid(),
  leftCardId: z.string().trim().min(1).max(120),
  rightCardId: z.string().trim().min(1).max(120),
  result: z.enum(["left", "right", "tie", "skip"]),
  sessionId: z.uuid()
}).refine((value) => value.leftCardId !== value.rightCardId, {
  message: "A card cannot battle itself."
});

export function parseRecentIds(value: string | null): string[] {
  if (!value) return [];
  return [...new Set(value.split(",").map((id) => id.trim()).filter(Boolean))]
    .slice(0, 10)
    .filter((id) => id.length <= 120);
}
