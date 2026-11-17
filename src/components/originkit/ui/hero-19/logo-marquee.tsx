/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/** Public asset under /sections/hero-19/assets */
function asset(file: string) {
  return `/originkit/hero-19/${file}`;
}

/**
 * Trusted-by logo strip — Figma "Frame 2147239649" (2280:5672 / 2280:5924).
 *
 * The strip scrolls continuously: the track holds two copies of the artwork and
 * translates by exactly -50%, so the second copy lands where the first started
 * and the loop has no visible reset. Edges fade with a mask rather than the
 * ellipse clip Figma bakes into the export.
 *
 * Native artwork is 1139 x 74.09; mobile and iPad show it at 0.838x (62.075
 * tall), matching their frames.
 */

const EDGE_MASK =
  "linear-gradient(to right, transparent 0, #000 10%, #000 90%, transparent 100%)";

export const LogoMarquee = () => (
  <div
    className="relative h-[62.075px] w-[572.243px] overflow-hidden desktop-sm:h-[74.09px] desktop-sm:w-[683px]"
    style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
  >
    <div className="flex w-max animate-logo-marquee items-center will-change-transform">
      {[0, 1].map((copy) => (
        <img
          key={copy}
          src={asset("logo-strip-marquee.svg")}
          alt=""
          aria-hidden={copy === 1}
          className="block h-[62.075px] w-[954.297px] max-w-none shrink-0 desktop-sm:h-[74.09px] desktop-sm:w-[1139px] opacity-70"
        />
      ))}
    </div>
  </div>
);
