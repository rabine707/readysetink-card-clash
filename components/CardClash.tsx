"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CardChoice } from "./CardChoice";
import { ThemeToggle } from "./ThemeToggle";
import { CommunityStats } from "./CommunityStats";
import type { Matchup, VoteResult } from "@/lib/types";

const SESSION_KEY = "card-clash-session-v1";

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function CardClash() {
  const [matchup, setMatchup] = useState<Matchup | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recentIds = useRef<string[]>([]);
  const sessionId = useRef("");
  const inFlight = useRef(false);

  const loadMatchup = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (recentIds.current.length) params.set("recent", recentIds.current.join(","));
      const response = await fetch(`/api/matchup?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not draw cards.");
      setMatchup(data);
      recentIds.current = [data.left.id, data.right.id, ...recentIds.current].slice(0, 8);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not draw cards.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    sessionId.current = getSessionId();
    void loadMatchup();
  }, [loadMatchup]);

  const vote = useCallback(async (result: VoteResult) => {
    if (!matchup || inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clashId: matchup.clashId,
          leftCardId: matchup.left.id,
          rightCardId: matchup.right.id,
          result,
          sessionId: sessionId.current
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Your choice could not be recorded.");
      await loadMatchup();
    } catch (caught) {
      inFlight.current = false;
      setBusy(false);
      setError(caught instanceof Error ? caught.message : "Your choice could not be recorded.");
    }
  }, [loadMatchup, matchup]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "ArrowLeft") void vote("left");
      if (event.key === "ArrowRight") void vote("right");
      if (event.key.toLowerCase() === "t") void vote("tie");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [vote]);

  return (
    <main className="clash-shell">
      <nav className="site-nav">
        <Link className="wordmark" href="/" aria-label="ReadySetInk Card Clash home">
          <span className="brand-spark" aria-hidden="true">✦</span>
          <span className="wordmark-copy">Ready Set Ink <small>Card Clash</small></span>
        </Link>
        <div className="nav-actions">
          <ThemeToggle />
          <Link className="nav-link" href="/rankings">Community Rankings</Link>
        </div>
      </nav>
      <header className="clash-header">
        <p className="eyebrow">A LORCANA COMMUNITY PICKER</p>
        <h1>Which card do you like more?</h1>
        <p>
          There&apos;s no wrong way to vote. Pick your favorite for any reason you
          want—artwork, character, gameplay, nostalgia, rarity, vibes, or just because.
        </p>
      </header>
      <CommunityStats />

      {error && <div className="notice" role="alert">{error} <button onClick={() => void loadMatchup()}>Try again</button></div>}
      {!matchup ? (
        <div className="loading-card">{busy ? "Drawing two cards…" : "No matchup available."}</div>
      ) : (
        <>
          <section className={`battle ${busy ? "is-busy" : ""}`} aria-busy={busy}>
            <CardChoice card={matchup.left} side="left" disabled={busy} onChoose={() => void vote("left")} />
            <div className="versus" aria-hidden="true"><span>VS</span></div>
            <CardChoice card={matchup.right} side="right" disabled={busy} onChoose={() => void vote("right")} />
          </section>
          <section className="decision-panel" aria-label="Other choices">
            <button className="tie-button" disabled={busy} onClick={() => void vote("tie")}>
              <strong>Tie / Can&apos;t Pick</strong><span>Both cards are equally good · T</span>
            </button>
            <button className="skip-button" disabled={busy} onClick={() => void vote("skip")}>
              Skip / Don&apos;t Know <span>— no ranking change</span>
            </button>
          </section>
          <p className="keyboard-hint"><kbd>←</kbd> left <kbd>→</kbd> right <kbd>T</kbd> tie</p>
        </>
      )}
      <section className="about-strip">
        <p className="eyebrow">HOW IT WORKS</p>
        <p>Every pick adjusts both cards with an Elo-style rating. Close matches and lesser-seen cards appear more often, helping the community ranking get smarter with every clash.</p>
      </section>
    </main>
  );
}
