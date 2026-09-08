import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await createSupabaseAdmin()
      .from("card_clash_cards")
      .select("id,name,version,image_url,set_code,set_name,collector_number,language,promo_source,promo_source_category,ink,rarity,rating,wins,losses,ties,battles")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .order("battles", { ascending: false })
      .limit(250);
    if (error) throw error;

    const rankings = (data ?? []).map((card, index) => ({
      ...card,
      rank: index + 1,
      rating: Math.round(Number(card.rating)),
      winRate: card.battles ? Math.round((card.wins / card.battles) * 100) : 0
    }));
    return NextResponse.json({ rankings }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("rankings error", error);
    return NextResponse.json({ error: "Could not load community rankings." }, { status: 500 });
  }
}
