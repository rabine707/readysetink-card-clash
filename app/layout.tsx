import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Card Clash | ReadySetInk",
  description: "Pick your favorite Disney Lorcana card and shape the community rankings."
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
