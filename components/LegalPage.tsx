import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
};

export function LegalPage({ eyebrow, title, updated = "September 12, 2026", children }: LegalPageProps) {
  return (
    <main className="legal-shell">
      <nav className="site-nav">
        <Link className="wordmark" href="/" aria-label="ReadySetInk The Ink List home">
          <span className="brand-spark" aria-hidden="true">✦</span>
          <span className="wordmark-copy">Ready Set Ink <small>The Ink List</small></span>
        </Link>
        <div className="nav-actions">
          <ThemeToggle />
          <Link className="nav-link" href="/">Play now</Link>
        </div>
      </nav>
      <article className="legal-card">
        <header className="legal-header">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="legal-updated">Last updated: {updated}</p>
        </header>
        <div className="legal-content">{children}</div>
      </article>
    </main>
  );
}
