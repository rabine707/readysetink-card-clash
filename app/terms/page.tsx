import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Use | The Ink List" };

export default function TermsPage() {
  return (
    <LegalPage eyebrow="THE RULES" title="Terms of Use">
      <p>
        By accessing or using The Ink List, you agree to these Terms. If you do not
        agree, please do not use the service. If you are under the age of majority
        where you live, use the service only with permission from a parent or guardian.
      </p>

      <h2>What The Ink List provides</h2>
      <p>
        The Ink List is a free, unofficial community card picker. Choices contribute
        to global, entertainment-only rankings. Rankings reflect community activity
        and are not official ratings, competitive advice, or statements of card value.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>automate, manipulate, falsify, or interfere with voting or rankings;</li>
        <li>bypass rate limits or other security and integrity controls;</li>
        <li>probe, disrupt, overload, damage, or gain unauthorized access to the service or its systems;</li>
        <li>use the service in violation of law or another person&apos;s rights; or</li>
        <li>copy, scrape, or reuse site content in a way that violates applicable rights or third-party terms.</li>
      </ul>
      <p>
        We may reject votes, restrict access, or take other reasonable steps to protect
        the service and the integrity of its rankings.
      </p>

      <h2>Availability and changes</h2>
      <p>
        We may change, suspend, or discontinue any part of The Ink List at any time.
        We do not promise that the service, card catalog, images, statistics, or
        rankings will always be available, complete, current, or error-free.
      </p>

      <h2>Third-party content and services</h2>
      <p>
        Card information and images are provided through third-party data sources, and
        the service relies on third-party hosting and database providers. Their content,
        services, and terms are outside our control. Links to other sites are provided
        for convenience and do not imply endorsement.
      </p>

      <h2>Disclaimer and limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, The Ink List is provided “as is” and
        “as available,” without warranties of any kind. Ready Set Ink and its operators
        will not be liable for indirect, incidental, special, consequential, or punitive
        damages, or for loss of data, goodwill, or profits arising from use of the
        service. Nothing in these Terms excludes rights or liability that cannot legally
        be excluded.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of California, without regard
        to conflict-of-law principles. Any dispute will be handled in courts with
        jurisdiction in Solano County, California, unless applicable law requires
        otherwise.
      </p>

      <h2>Contact and updates</h2>
      <p>
        Questions about these Terms can be sent through
        <a href="mailto:Lorcana707@gmail.com"> Lorcana707@gmail.com</a>. We may update these
        Terms, and continued use after an update means you accept the revised Terms.
      </p>
    </LegalPage>
  );
}
