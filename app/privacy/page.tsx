import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy | The Ink List" };

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="YOUR INFORMATION" title="Privacy Policy">
      <p>
        This policy explains how Ready Set Ink handles information when you use The
        Ink List. The service does not currently offer user accounts and does not ask
        for your name, email address, or payment information.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Anonymous session identifier.</strong> Your browser creates a random identifier and saves it in local storage. It is sent with your choices so votes can be counted, duplicate submissions can be prevented, and voting limits can be enforced.</li>
        <li><strong>Voting activity.</strong> We store the two card identifiers shown, your selection (left, right, tie, or skip), a matchup identifier, and the date and time of the choice.</li>
        <li><strong>Theme preference.</strong> Your RSI or Neon theme choice is saved only in your browser&apos;s local storage.</li>
        <li><strong>Basic technical information.</strong> Our hosting and database providers may automatically process information such as IP address, device or browser details, request logs, and security events to deliver and protect the service.</li>
      </ul>

      <h2>How we use information</h2>
      <p>
        We use this information to run the card picker, calculate community rankings
        and aggregate statistics, prevent duplicate or abusive voting, troubleshoot
        problems, secure the service, and improve how The Ink List works.
      </p>

      <h2>How information is shared</h2>
      <p>
        We use service providers, including Vercel for hosting and Supabase for data
        storage and processing. They may process information only as needed to provide
        their services to us. We may also disclose information when required by law,
        to protect rights or safety, or in connection with a transfer of the service.
        We do not sell personal information or use voting activity for cross-context
        behavioral advertising.
      </p>

      <h2>Retention and your choices</h2>
      <p>
        Voting records may be kept for as long as reasonably needed to maintain the
        rankings, prevent abuse, resolve problems, and meet legal obligations. You can
        remove The Ink List&apos;s session identifier and theme preference by clearing this
        site&apos;s local storage in your browser. Doing so creates a new anonymous session
        the next time you visit; it does not remove votes already included in aggregate
        rankings.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The Ink List is a general-audience service and is not directed to children
        under 13. We do not knowingly collect personal information from children under
        13. If you believe a child has provided personal information through the
        service, please contact us.
      </p>

      <h2>Your privacy rights</h2>
      <p>
        Depending on where you live, you may have rights concerning your personal
        information. Because The Ink List has no accounts and uses a random browser
        identifier, we may need that identifier to locate a session, and we may be
        unable to verify that a particular record belongs to you. We will respond to
        verifiable requests as required by applicable law and will not discriminate
        against you for making a request.
      </p>

      <h2>Contact and changes</h2>
      <p>
        To ask a privacy question or make a request, contact Ready Set Ink through
        <a href="https://readysetink.com/"> readysetink.com</a>. We may update this
        policy when the service or applicable requirements change. The date above
        shows the latest revision.
      </p>
    </LegalPage>
  );
}
