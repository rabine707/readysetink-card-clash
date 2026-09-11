import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { chooseMatchup } from "@/lib/matchup";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import type { ClashCard } from "@/lib/types";
import { parseRecentIds } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const recent = parseRecentIds(request.nextUrl.searchParams.get("recent"));
    const { data, error } = await createSupabaseAdmin()
      .from("card_clash_cards")
      .select("id,name,version,image_url,set_code,set_name,collector_number,language,promo_source,promo_source_category,ink,rarity,illustrators,rating,battles")
      .eq("is_active", true);

    if (error) throw error;
    if (!data || data.length < 2) {
      return NextResponse.json(
        { error: "The Ink List needs at least two synced cards." },
        { status: 503 }
      );
    }

    const normalized = data.map((card) => ({
      ...card,
      rating: Number(card.rating),
      battles: Number(card.battles)
    })) as ClashCard[];
    const matchup = chooseMatchup(normalized, recent);
    return NextResponse.json({ clashId: randomUUID(), ...matchup }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch (error) {
    console.error("matchup error", error);
    return NextResponse.json({ error: "Could not draw a matchup." }, { status: 500 });
  }
}
