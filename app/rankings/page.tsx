import { RankingsTable } from "@/components/RankingsTable";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Rankings | The Ink List | ReadySetInk"
};

export default function RankingsPage() { return <RankingsTable />; }
