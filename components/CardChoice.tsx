import Image from "next/image";
import { isLorcastCardImage } from "@/lib/card-image";
import type { ClashCard } from "@/lib/types";
import { cardProvenanceLine, cardSetLine } from "@/lib/card-metadata";
import styles from "./CardChoice.module.css";

export function CardChoice({ card, side, disabled, onChoose }: {
  card: ClashCard;
  side: "left" | "right";
  disabled: boolean;
  onChoose: () => void;
}) {
  const provenance = cardProvenanceLine(card);
  const mobileSetLine = [
    card.set_code ? `Set ${card.set_code}` : card.set_name,
    card.collector_number ? `#${card.collector_number}` : null,
    card.rarity?.replaceAll("_", " ")
  ].filter(Boolean).join(" · ");

  return (
    <button className={`card-choice card-choice--${side}`} disabled={disabled} onClick={onChoose}>
      <span className="card-frame">
        <Image src={card.image_url} alt={`${card.name}${card.version ? ` — ${card.version}` : ""}`} fill
          unoptimized={isLorcastCardImage(card.image_url)}
          sizes="(max-width: 650px) calc(50vw - 31px), (max-width: 778px) calc(50vw - 57px), 332px"
          priority={side === "left"} />
        <span className="pick-cue">{side === "left" ? "← Pick left" : "Pick right →"}</span>
      </span>
      <span className={`card-name ${styles.name}`}>{card.name}</span>
      <span className={styles.details}>
        {card.version && <span className={`card-version ${styles.version}`}>{card.version}</span>}
        <span className={`card-meta ${styles.desktopMeta}`}>{cardSetLine(card)}</span>
        {mobileSetLine && <span className={styles.mobileMeta}>{mobileSetLine}</span>}
        {card.illustrators.length > 0 && (
          <span className={`card-artist ${styles.artist}`}>Art by {card.illustrators.join(" & ")}</span>
        )}
        {provenance && <span className={`card-provenance ${styles.provenance}`}>{provenance}</span>}
      </span>
    </button>
  );
}
