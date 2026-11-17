/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/** Public asset under /sections/hero-19/assets */
function asset(file: string) {
  return `/originkit/hero-19/${file}`;
}
/**
 * Ceiling light rig — Figma "Background shapes container" (2280:5404 / 2282:6139).
 *
 * The group is two mirrored conic-gradient panels, three blurred plates and a
 * screen-blended ellipse. Figma expresses the gradients as HTML inside an SVG
 * `foreignObject`, which browsers refuse to rasterise when the SVG is used as a
 * `background-image` — so the group ships as its flat export instead. The PNG is
 * baked against the black artboard, hence `mix-blend-screen`: black drops out and
 * only the light survives.
 *
 * Export is frame-clipped: 804x920 @2x = 402x460 CSS, anchored to the frame origin.
 */
/** Fades the lamp export out before its bottom edge. */
const LAMP_MASK =
  "linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.6) 78%, transparent 100%)";

export const Backdrop = () => (
  <>
    <img
      aria-hidden
      src={asset("bg-shapes.png")}
      alt=""
      className="pointer-events-none absolute top-0 left-0 z-0 block h-115 w-full max-w-none mix-blend-screen ipad:hidden"
    />
    {/* iPad grain — its own square noise tile, so it is downscaled rather than
        the mobile 402x874 export being blown up ~1.85x into blotches */}
    <img
      aria-hidden
      src={asset("ipad-texture.png")}
      alt=""
      className="pointer-events-none absolute inset-0 z-0 hidden size-full max-w-none object-cover opacity-70 mix-blend-screen ipad:block desktop-sm:hidden"
    />
    {/* iPad export is frame-clipped too: 1488x1420 @2x = 744x710 CSS */}
    <img
      aria-hidden
      src={asset("bg-shapes-tablet.png")}
      alt=""
      className="pointer-events-none absolute top-0 left-0 z-0 hidden h-[710px] w-full max-w-none mix-blend-screen ipad:block desktop-sm:hidden"
    />
    {/* Desktop: ceiling lamp, then arcs, then grain — three stacked exports.
        These size against <main> (min-h-dvh), but the composition stage is
        capped at 1080 on ultrawide — so on a taller viewport the backgrounds
        kept running past the hero, and object-cover scaled the 2200x1283 arc up
        to fill, dragging its glow hundreds of px below the hand. Capping their
        height to the stage keeps light and composition on the same footing. */}
    <img
      aria-hidden
      src={asset("bg-shapes-desktop.png")}
      alt=""
      className="pointer-events-none absolute top-0 left-0 z-0 hidden h-[731.5px] w-full max-w-none object-cover object-top mix-blend-screen desktop-sm:block"
      style={{
        // The export stops at 731.5px; on a taller stage that hard bottom edge
        // reads as a brightness step across the whole width once screen-blended.
        maskImage: LAMP_MASK,
        WebkitMaskImage: LAMP_MASK,
      }}
    />
    <img
      aria-hidden
      src={asset("arcs-desktop.png")}
      alt=""
      className="pointer-events-none absolute inset-0 z-0 hidden size-full max-w-none object-cover object-top mix-blend-screen desktop-sm:block ultrawide:h-270"
    />
    {/* Grain + soft ellipse wash — Figma "texture" (2280:5870), over the arcs.
        Mobile and iPad carry this baked into their own exports. */}
    <img
      aria-hidden
      src={asset("texture-desktop.png")}
      alt=""
      className="pointer-events-none absolute inset-0 z-0 hidden size-full max-w-none object-cover object-top mix-blend-screen desktop-sm:block ultrawide:h-270"
    />
  </>
);
