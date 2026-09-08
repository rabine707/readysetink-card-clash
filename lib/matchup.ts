import type { ClashCard } from "./types";
import { cardIdentityKey } from "./card-metadata";

export type MatchCard = Pick<ClashCard, "id" | "name" | "version" | "rating" | "battles">;

function randomFrom<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)]!;
}

export function chooseMatchup<T extends MatchCard>(
  cards: T[],
  recentCardIds: string[] = [],
  random: () => number = Math.random
): { left: T; right: T } {
  if (cards.length < 2) throw new Error("At least two cards are required.");

  const recent = new Set(recentCardIds);
  const recentIdentities = new Set(
    cards.filter((card) => recent.has(card.id)).map(cardIdentityKey)
  );
  const fresh = cards.filter(
    (card) => !recent.has(card.id) && !recentIdentities.has(cardIdentityKey(card))
  );
  const pool = fresh.length >= 2 ? fresh : cards;
  const underVoted = [...pool].sort((a, b) => a.battles - b.battles);
  const anchorCount = Math.min(
    underVoted.length,
    Math.max(2, Math.ceil(underVoted.length * 0.35))
  );
  const left = randomFrom(underVoted.slice(0, anchorCount), random);

  const neighbors = pool
    .filter((card) => card.id !== left.id && cardIdentityKey(card) !== cardIdentityKey(left))
    .sort((a, b) => {
      const ratingDelta =
        Math.abs(a.rating - left.rating) - Math.abs(b.rating - left.rating);
      return ratingDelta || a.battles - b.battles;
    });
  const opponentCount = Math.min(neighbors.length, Math.max(5, Math.ceil(neighbors.length * 0.15)));
  const right = randomFrom(neighbors.slice(0, opponentCount), random);
  return random() < 0.5 ? { left, right } : { left: right, right: left };
}
