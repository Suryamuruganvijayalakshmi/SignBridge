/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

import { useEffect, useRef } from "react";

import ParticleSphere from "@/components/originkit/ui/hero-19/particle-sphere";
import { MaskGroup } from "@/components/originkit/ui/hero-19/mask-group";

/**
 * Dotted orb resting above the hand — Figma "Group 2147241484" (2282:6148),
 * iPad 2280:5842.
 *
 * The group is placed against the frame (mobile 61.33, 499 — 228.39 x 269.82;
 * iPad 185.49, 607 — 324.3 x 383.12), but everything *inside* it is centred
 * with layout rather than coordinates: the sphere box is centred horizontally
 * with flex, and the glow, disc and sphere share one grid cell with
 * `place-items-center`, so they stay concentric at any size.
 *
 * Layers, bottom to top:
 *   z-0  MaskGroup — halo + wash, unmasked, bleeding out around the sphere
 *   z-20 dark core, between the glow and the sphere
 *   z-30 the particle sphere
 *
 * The core is masked with a soft hole that follows the cursor, sized to the
 * sphere's `cursorRadiusUI`. Where the particles scatter away from the pointer
 * the core dissolves with them, so no hard disc edge is exposed. It is an
 * approximation — the hole is a circle, the scatter is not.
 */

/** Projected diameter of the particle sphere, in px. */
const SPHERE_DIAMETER = 190;
/** iPad scales the whole group by 1.42 (324.3 / 228.39). */
const TABLET_SCALE = 1.42;
const SPHERE_DIAMETER_TABLET = SPHERE_DIAMETER * TABLET_SCALE;
/**
 * Desktop — the sphere box is 396 x 362, and the engine projects the sphere at
 * 2.5 / 6.994 of the canvas height (box x 2.5): 0.3574 * 905 = 323px, matched
 * to the same 1.078 visual bump the mobile value carries.
 */
const DESKTOP_SCALE = 275 / SPHERE_DIAMETER;
const SPHERE_DIAMETER_DESKTOP = SPHERE_DIAMETER * DESKTOP_SCALE;

/**
 * Matches the sphere's cursorRadiusUI, widened because particles fling well
 * past the cursor radius — the hole has to cover where they land, not just
 * where they started.
 */
const CURSOR_RADIUS = 75 * 1.6;
/** Floor for the hole radius; 0 would invalidate the gradient. */
const MIN_HOLE = 0.01;

const CORE_FILL =
  "radial-gradient(circle at 50% 50%, #090402 0%, #090402 58%, rgba(9,4,2,0.9) 74%, rgba(9,4,2,0.55) 88%, rgba(9,4,2,0) 100%)";
/** Punches a feathered hole at the pointer; --hole-r collapses to 0 on leave. */
const CORE_MASK =
  "radial-gradient(circle var(--hole-r, 0px) at var(--hole-x, 50%) var(--hole-y, 50%), transparent 0%, transparent 68%, rgba(0,0,0,0.55) 86%, #000 100%)";

export const Orb = () => {
  const coreRef = useRef<HTMLDivElement>(null);

  /**
   * The hole follows the pointer off a window-level listener rather than
   * enter/leave on the sphere: the canvas overflows its box by 2.5x, so
   * leave fired while the cursor was still visibly over the orb and the hole
   * snapped shut. Position is eased in a rAF loop, so the hole glides instead
   * of stepping between pointer events.
   */
  useEffect(() => {
    const core = coreRef.current;
    if (!core) return;

    const pointer = { x: 0, y: 0, inside: false };
    const eased = { x: 0, y: 0, r: MIN_HOLE };
    let frame = 0;
    let seeded = false;

    const onMove = (event: PointerEvent) => {
      const box = core.getBoundingClientRect();
      const x = event.clientX - box.left - box.width / 2;
      const y = event.clientY - box.top - box.height / 2;
      // Keep the hole alive anywhere within the core plus one hole radius, so
      // brushing the glow around the sphere does not drop tracking.
      const reach = box.width / 2 + CURSOR_RADIUS;
      pointer.inside = Math.hypot(x, y) < reach;
      pointer.x = x;
      pointer.y = y;

      if (!seeded && pointer.inside) {
        eased.x = x;
        eased.y = y;
        seeded = true;
      }
    };

    const tick = () => {
      // Never let the radius reach 0: radial-gradient(circle 0px ...) is
      // invalid and the browser throws the entire mask away, which made the
      // core snap back to a hard-edged disc.
      const targetR = pointer.inside ? CURSOR_RADIUS : MIN_HOLE;
      eased.x += (pointer.x - eased.x) * 0.22;
      eased.y += (pointer.y - eased.y) * 0.22;
      eased.r += (targetR - eased.r) * 0.14;

      core.style.setProperty("--hole-x", `calc(50% + ${eased.x.toFixed(1)}px)`);
      core.style.setProperty("--hole-y", `calc(50% + ${eased.y.toFixed(1)}px)`);
      core.style.setProperty("--hole-r", `${eased.r.toFixed(1)}px`);

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="absolute top-[499px] left-1/2 flex h-[269.816px] w-[228.39px] -translate-x-1/2 justify-center ipad:top-151.75 ipad:h-[383.119px] ipad:w-[324.3px] desktop-sm:top-[178px] desktop-sm:h-[311px] desktop-sm:w-[340px] desktop-sm:translate-y-10"
    >
      {/* Sphere box — every layer below sits in the same grid cell, centred */}
      <div className="relative grid h-[197.32px] w-[215.853px] shrink-0 place-items-center ipad:h-[280.18px] ipad:w-[306.495px] desktop-sm:h-[311px] desktop-sm:w-[340px]">
        {/* Glow behind the sphere — MaskGroup anchors to a zero-size point */}
        <div className="relative z-0 col-start-1 row-start-1 size-0 blur-md ipad:hidden">
          <MaskGroup size={SPHERE_DIAMETER} />
        </div>
        <div className="relative z-0 col-start-1 row-start-1 hidden size-0 blur-md ipad:block desktop-sm:hidden">
          <MaskGroup size={SPHERE_DIAMETER_TABLET} />
        </div>
        <div className="relative z-0 col-start-1 row-start-1 hidden size-0 -translate-y-8 blur-md desktop-sm:block">
          <MaskGroup size={SPHERE_DIAMETER_DESKTOP} />
        </div>

        {/* Dark core — the same sphere in black, so the backdrop keeps its
          particle structure and reacts to the cursor instead of reading as a
          flat disc once the orange layer scatters. */}
        {/* <div className="pointer-events-none z-20 col-start-1 row-start-1 size-full">
        <ParticleSphere
          particlesCount={10000}
          particleScale={7}
          rotationDirection="clockwise"
          speed={20}
          scale={10}
          drag
          smoothing={7}
          dragSpeed={5}
          stopOnHover={false}
          cursorOn
          cursorRadiusUI={75}
          cursorStrengthUI={10}
          clickForce={5}
          sphereColor="#121212"
        />
      </div> */}
        {/* Dark core — dissolves under the cursor, so the scattered particles
            never expose a hard disc edge */}
        <div
          ref={coreRef}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 size-47.5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl ipad:size-67.5 desktop-sm:size-[310px]"
          style={{
            backgroundImage: CORE_FILL,
            maskImage: CORE_MASK,
            WebkitMaskImage: CORE_MASK,
          }}
        />

        {/* Live particle sphere, in place of Figma's flat "image 3083449" */}
        <div className="pointer-events-auto z-30 col-start-1 row-start-1 size-full">
          <ParticleSphere
            particlesCount={10000}
            particleScale={7}
            rotationDirection="clockwise"
            speed={20}
            scale={10}
            drag
            smoothing={7}
            dragSpeed={5}
            stopOnHover={false}
            cursorOn
            cursorRadiusUI={75}
            cursorStrengthUI={10}
            clickForce={5}
            sphereColor="#FF3B00"
          />
        </div>
      </div>
    </div>
  );
};
