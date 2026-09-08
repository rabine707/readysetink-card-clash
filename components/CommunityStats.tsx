"use client";

import { useEffect, useState } from "react";

type Stats = { totalCards: number; votesCast: number; uniqueVoters: number };

export function CommunityStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then(async (response) => {
        if (!response.ok) throw new Error("Stats unavailable");
        setStats(await response.json());
      })
      .catch(() => setStats(null));
  }, []);

  const items = [
    [stats?.totalCards, "Total Cards"],
    [stats?.votesCast, "Votes Cast"],
    [stats?.uniqueVoters, "Unique Voters"]
  ] as const;

  return (
    <section className="community-stats" aria-label="Card Clash community statistics" aria-live="polite">
      {items.map(([value, label]) => (
        <div className="community-stat" key={label}>
          <strong>{value == null ? "—" : value.toLocaleString()}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}
