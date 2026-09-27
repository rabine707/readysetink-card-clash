import { describe, expect, it } from "vitest";
import { getImageProps } from "next/image";
import { isLorcastCardImage } from "../lib/card-image";

const src = "https://cards.lorcast.io/card/digital/large/example.avif?1709690747";

describe("card image delivery", () => {
  it("serves versioned Lorcast AVIFs directly without optimizer variants", () => {
    const { props } = getImageProps({ src, alt: "Card", fill: true,
      sizes: "332px", unoptimized: isLorcastCardImage(src) });
    expect(props.src).toBe(src);
    expect(props.srcSet).toBeUndefined();
    expect(props.style?.objectFit).toBeUndefined();
    expect(props.style?.position).toBe("absolute");
    expect(props.loading).toBe("lazy");
  });

  it("keeps optimization for local images", () => {
    const src = "/future-image.png";
    const { props } = getImageProps({ src, alt: "", width: 64, height: 90,
      unoptimized: isLorcastCardImage(src) });
    expect(props.src).toContain("/_next/image?");
    expect(props.srcSet).toBeDefined();
  });

  it.each([
    "https://cards.lorcast.io.evil.example/card/digital/large/example.avif",
    "http://cards.lorcast.io/card/digital/large/example.avif",
    "https://cards.lorcast.io/card/digital/large/example.png",
    "https://cards.lorcast.io/other/example.avif",
    "invalid"
  ])("does not bypass optimization for %s", (url) => {
    expect(isLorcastCardImage(url)).toBe(false);
  });
});
