import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Ink List | ReadySetInk",
  description: "The Ink List: Lorcana, ranked by the community. Pick your favorite Disney Lorcana card and shape the global rankings.",
  applicationName: "The Ink List",
  openGraph: {
    title: "The Ink List | ReadySetInk",
    siteName: "The Ink List",
    description: "Lorcana, ranked by the community. Pick your favorite cards and shape The Ink List.",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "The Ink List | ReadySetInk",
    description: "Lorcana, ranked by the community. Pick your favorite cards and shape The Ink List."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="rsi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem("card-clash-theme-v1")==="neon"?"neon":"rsi"}catch{}` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
