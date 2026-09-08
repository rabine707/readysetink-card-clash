import Image from "next/image";
import type { ClashCard } from "@/lib/types";
import { cardProvenanceLine, cardSetLine } from "@/lib/card-metadata";

export function CardChoice({ card, side, disabled, onChoose }: {
  card: ClashCard;
  side: "left" | "right";
  disabled: boolean;
  onChoose: () => void;
}) {
  const provenance = cardProvenanceLine(card);
  return (
    <button className={`card-choice card-choice--${side}`} disabled={disabled} onClick={onChoose}>
      <span className="card-frame">
        <Image src={card.image_url} alt={`${card.name}${card.version ? ` — ${card.version}` : ""}`} fill
          sizes="(max-width: 700px) 44vw, 360px" priority={side === "left"} />
        <span className="pick-cue">{side === "left" ? "← Pick left" : "Pick right →"}</span>
      </span>
      <span className="card-name">{card.name}</span>
      {card.version && <span className="card-version">{card.version}</span>}
      <span className="card-meta">{cardSetLine(card)}</span>
      {card.illustrators.length > 0 && (
        <span className="card-artist">Art by {card.illustrators.join(" & ")}</span>
      )}
      {provenance && <span className="card-provenance">{provenance}</span>}
    </button>
  );
}
