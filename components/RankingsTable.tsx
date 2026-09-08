"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cardSetLine } from "@/lib/card-metadata";
import { ThemeToggle } from "./ThemeToggle";

type RankedCard = {
  rank: number; id: string; name: string; version: string | null; image_url: string;
  set_code: string | null; set_name: string | null; collector_number: string | null;
  language: string | null; rarity: string | null; promo_source: string | null;
  promo_source_category: string | null; rating: number; battles: number;
  wins: number; losses: number; ties: number; winRate: number;
};

export function RankingsTable() {
  const [cards, setCards] = useState<RankedCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rankings", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load rankings.");
        setCards(data.rankings ?? []);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load rankings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="rankings-shell">
      <nav className="site-nav">
        <Link className="wordmark" href="/" aria-label="ReadySetInk Card Clash home">
          <span className="brand-spark" aria-hidden="true">✦</span>
          <span className="wordmark-copy">Ready Set Ink <small>Card Clash</small></span>
        </Link>
        <div className="nav-actions">
          <ThemeToggle />
          <Link className="nav-link" href="/">Play now</Link>
        </div>
      </nav>
      <header className="rankings-header"><p className="eyebrow">THE COMMUNITY&apos;S FAVORITES</p><h1>Community Rankings</h1><p>Every Card Clash vote helps reveal Lorcana&apos;s most-loved cards.</p></header>
      {loading && <div className="loading-card">Counting the votes…</div>}
      {error && <div className="notice" role="alert">{error}</div>}
      {!loading && !error && cards.length === 0 && <div className="loading-card">No ranked cards yet. Sync Lorcast data, then cast the first vote.</div>}
      <section className="ranking-list">
        {cards.map((card) => (
          <article className="ranking-row" key={card.id}>
            <div className="rank-number">#{card.rank}</div>
            <div className="rank-image"><Image src={card.image_url} alt="" fill sizes="64px" /></div>
            <div className="rank-card-info"><strong>{card.name}</strong>{card.version && <span>{card.version}</span>}<small>{cardSetLine(card)}</small></div>
            <div className="rank-stats"><strong>{card.rating.toLocaleString()}</strong><span>rating</span><small>{card.winRate}% wins · {card.battles.toLocaleString()} battles · {card.ties} ties</small></div>
          </article>
        ))}
      </section>
    </main>
  );
}
