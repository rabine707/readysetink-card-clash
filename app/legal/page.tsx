import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Legal & Fan Content | The Ink List" };

export default function LegalNoticePage() {
  return (
    <LegalPage eyebrow="FAN CONTENT" title="Legal Notice">
      <h2>Unofficial fan site</h2>
      <p>
        The Ink List is an independent, unofficial, fan-made community website operated
        by Ready Set Ink. It is not affiliated with, endorsed, sponsored, or specifically
        approved by The Walt Disney Company, Ravensburger, or their affiliates.
      </p>

      <h2>Trademarks and artwork</h2>
      <p>
        Disney Lorcana TCG, Disney names and characters, card artwork, logos, and other
        associated trademarks and copyrighted material are the property of their
        respective owners. Their appearance is for identification, commentary, and
        community-ranking purposes and does not claim ownership or endorsement.
      </p>

      <h2>Card data and credits</h2>
      <p>
        Card metadata and images are sourced from Lorcast, with some promotional-source
        information enriched from LorcanaJSON. Artist credits are shown with cards when
        supplied by the source data. Source data may be incomplete, delayed, or changed
        by its provider.
      </p>

      <h2>Community rankings</h2>
      <p>
        Rankings are generated from anonymous community choices using The Ink List&apos;s
        rating system. They are subjective, may change at any time, and are not official
        rankings from Disney, Ravensburger, tournament organizers, artists, or data
        providers.
      </p>

      <h2>Rights concerns</h2>
      <p>
        Rights holders with a good-faith concern about material displayed on The Ink
        List can contact Ready Set Ink through
        <a href="mailto:Lorcana707@gmail.com"> Lorcana707@gmail.com</a>. Please identify the
        material and explain the basis of the request so it can be reviewed promptly.
      </p>
    </LegalPage>
  );
}
