export type ClashCard = {
  id: string;
  name: string;
  version: string | null;
  image_url: string;
  set_code: string | null;
  set_name: string | null;
  ink: string | null;
  rarity: string | null;
  rating: number;
  battles: number;
};

export type Matchup = { clashId: string; left: ClashCard; right: ClashCard };
export type VoteResult = "left" | "right" | "tie" | "skip";
