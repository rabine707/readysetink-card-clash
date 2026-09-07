import Image from "next/image";
import type { ClashCard } from "@/lib/types";

export function CardChoice({ card, side, disabled, onChoose }: {
  card: ClashCard;
  side: "left" | "right";
  disabled: boolean;
  onChoose: () => void;
}) {
  return (
    <button className={`card-choice card-choice--${side}`} disabled={disabled} onClick={onChoose}>
      <span className="card-frame">
        <Image src={card.image_url} alt={`${card.name}${card.version ? ` — ${card.version}` : ""}`} fill
          sizes="(max-width: 700px) 44vw, 360px" priority={side === "left"} />
        <span className="pick-cue">{side === "left" ? "← Pick left" : "Pick right →"}</span>
      </span>
      <span className="card-name">{card.name}</span>
      {card.version && <span className="card-version">{card.version}</span>}
      <span className="card-meta">{[card.set_name, card.rarity].filter(Boolean).join(" · ")}</span>
    </button>
  );
}
