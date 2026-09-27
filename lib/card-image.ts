// Lorcast already supplies compressed AVIF card art. Keep its versioned URL
// intact and avoid creating another Vercel transformation for every card/size.
export function isLorcastCardImage(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "cards.lorcast.io"
      && url.pathname.startsWith("/card/digital/") && url.pathname.endsWith(".avif");
  } catch {
    return false;
  }
}
