import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookies & Storage | The Ink List" };

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="BROWSER DATA" title="Cookies & Storage">
      <p>
        The Ink List currently uses browser local storage—not advertising cookies—to
        remember an anonymous session and your color-theme preference.
      </p>

      <h2>What is stored</h2>
      <ul>
        <li><strong>Anonymous session ID:</strong> connects your choices to one browser session for vote integrity and rate limiting.</li>
        <li><strong>Theme preference:</strong> remembers whether you selected the RSI or Neon appearance.</li>
      </ul>
      <p>
        These items remain in your browser until you clear the site&apos;s stored data.
        Clearing them will reset your theme and cause a new anonymous session ID to be
        created on your next visit. Previously submitted votes remain part of the
        community rankings.
      </p>

      <h2>Provider technologies</h2>
      <p>
        Our hosting and infrastructure providers may use cookies, logs, or similar
        technologies that are strictly necessary to deliver, secure, and maintain the
        service. The Ink List does not currently use advertising cookies or third-party
        behavioral analytics. If that changes, we will update this notice and provide
        choices when required.
      </p>

      <h2>Managing storage</h2>
      <p>
        You can view or clear local storage and cookies through your browser&apos;s privacy
        or site-data settings. Blocking local storage may prevent voting or theme
        preferences from working correctly.
      </p>
    </LegalPage>
  );
}
