import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

type StatsRow = {
  total_cards: number | string;
  votes_cast: number | string;
  unique_voters: number | string;
};

export async function GET() {
  try {
    const { data, error } = await createSupabaseAdmin().rpc("get_card_clash_stats");
    if (error) throw error;
    const row = (data?.[0] ?? {}) as Partial<StatsRow>;
    return NextResponse.json({
      totalCards: Number(row.total_cards ?? 0),
      votesCast: Number(row.votes_cast ?? 0),
      uniqueVoters: Number(row.unique_voters ?? 0)
    }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error("stats error", error);
    return NextResponse.json({ error: "Could not load community stats." }, { status: 500 });
  }
}
