import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="footer-links" aria-label="Legal and site information">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies &amp; Storage</Link>
          <Link href="/legal">Legal</Link>
          <a href="https://readysetink.com/">Contact</a>
        </nav>
        <p>© 2026 Ready Set Ink. All rights reserved.</p>
        <p className="fan-disclaimer">
          The Ink List is an unofficial fan-made website and is not affiliated with,
          endorsed, sponsored, or specifically approved by Disney or Ravensburger.
          Disney Lorcana TCG names, characters, artwork, and trademarks belong to
          their respective owners.
        </p>
      </div>
    </footer>
  );
}
