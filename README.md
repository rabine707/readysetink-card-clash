# Card Clash

A standalone, mobile-first Lorcana community picker with instant left/right/tie voting, anonymous sessions, Elo-style rankings, and matchup selection that favors similarly rated and under-voted cards.

This project does not import from or write to ReadySetInk. Its database objects are isolated behind the `card_clash_` prefix.

## V1 behavior

- Click/tap either card, or press Left/Right Arrow. The vote is recorded and both cards are replaced immediately.
- **Tie / Can't Pick** (or `T`) records a draw, updates both cards, and replaces the matchup.
- **Skip / Don't Know** logs the skip for product analysis, but does not change ratings or battle statistics.
- A local anonymous UUID is stored in the browser. There are no accounts or personal rankings in V1.
- Each matchup has a unique clash ID; database uniqueness prevents retries/double-clicks from counting twice.
- Ratings and both cards' statistics update inside one locked Postgres transaction.

## Local setup

Requirements: Node.js 22 or newer and a Supabase project.

1. In Supabase, open the SQL Editor and run [`supabase/schema.sql`](supabase/schema.sql).
2. Copy `.env.example` to `.env.local` and fill in the project URL and service-role key. The service-role key is server-only and must never be prefixed with `NEXT_PUBLIC_`.
3. Install dependencies with `npm install`.
4. Cache the English Lorcast print catalog into Supabase with `npm run sync:lorcast`.
5. Start the app with `npm run dev`, then visit `http://localhost:3000`.

Lorcast asks API consumers to cache downloaded card data for at least 24 hours. Run the sync manually after set releases or on a weekly schedule; do not run it on every request.

## Database/security model

The browser talks only to the app's route handlers. Route handlers use the server-only service-role key. RLS is enabled on both tables, direct access for `anon` and `authenticated` is revoked, and the vote RPC is granted only to `service_role`.

`record_card_clash_vote` uses `SECURITY INVOKER`, locks both card rows in stable ID order, inserts the vote, and updates both ratings/stat rows in one transaction. If any statement fails, all changes roll back. Skips are inserted and return before rating/stat changes.

Before production, consider adding an application-level/IP rate limiter to `/api/vote`. Anonymous identifiers deter accidental duplicate submissions but are not strong identity or anti-bot protection.

## Checks

```text
npm test
npm run typecheck
npm run build
```

The pure unit suite covers matchup behavior and request validation. A live database verification still requires applying the schema to a real Supabase project and exercising the RPC with configured credentials.

## Deploy to Vercel

1. Create a new Vercel project whose root directory is this `card-clash` folder.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for Production and Preview.
3. Deploy. Vercel will run `npm run build` automatically.
4. Apply `supabase/schema.sql` and run the Lorcast sync before opening traffic.
5. Smoke-test `/`, a left/right/tie/skip sequence, and `/rankings` against the production database.

No Vercel project, Supabase project, schema, credentials, or scheduled jobs are created automatically by this repository.

## Data source and trademarks

Card metadata and images come from [Lorcast](https://lorcast.com/docs/api). Card Clash is a community project and is not published, endorsed, or specifically approved by Disney or Ravensburger. Disney Lorcana TCG names and artwork belong to their respective rights holders.
