import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { voteSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const parsed = voteSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid vote." }, { status: 400 });
    }

    const vote = parsed.data;
    const { data, error } = await createSupabaseAdmin().rpc("record_card_clash_vote", {
      p_clash_id: vote.clashId,
      p_left_card_id: vote.leftCardId,
      p_right_card_id: vote.rightCardId,
      p_result: vote.result,
      p_session_id: vote.sessionId
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "This matchup was already counted." }, { status: 409 });
      }
      if (error.code === "P0001" && error.message.includes("CARD_CLASH_RATE_LIMIT")) {
        return NextResponse.json(
          { error: "You’re voting too quickly. Please wait a moment and try again." },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, ranked: vote.result !== "skip", ratings: data });
  } catch (error) {
    console.error("vote error", error);
    return NextResponse.json({ error: "Your choice could not be recorded." }, { status: 500 });
  }
}
