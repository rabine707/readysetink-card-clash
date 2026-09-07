import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Clash | ReadySetInk",
  description: "Pick your favorite Disney Lorcana card and shape the community rankings."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
