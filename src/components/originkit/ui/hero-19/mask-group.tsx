/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/**
 * Orb glow — Figma "Mask group" (2282:6149) + "Rectangle 1430107388".
 *
 * Everything is inline SVG, sized relative to the sphere it sits behind, so the
 * glow scales with the sphere instead of a fixed export box. Figma clipped the
 * ellipses to the sphere's silhouette; here they stay unmasked and sit *under*
 * the sphere, which is what produces the halo bleeding out around it.
 *
 * Native reference: sphere 163.525px across, glow ellipses in a 305x307 box
 * (mask circle r 91.2918), trapezoid wash in a 316.665x252.369 box.
 */

const NATIVE_SPHERE = 163.525;
/** Glow ellipse box is keyed to the mask circle that framed the sphere. */
const GLOW_NATIVE = 91.2918 * 2;
/** Trapezoid container was 227.276 x 162.979 at the native sphere size. */
const WASH_W = 227.276 / NATIVE_SPHERE;
const WASH_H = 162.979 / NATIVE_SPHERE;
/** Wash centre offset from the sphere centre, at native size. */
const WASH_DX = -8.46 / NATIVE_SPHERE;
const WASH_DY = 88.58 / NATIVE_SPHERE;

type MaskGroupProps = {
  /** Diameter of the sphere this glow wraps, in px. */
  size: number;
  className?: string;
};

export const MaskGroup = ({ size, className = "" }: MaskGroupProps) => {
  const glowScale = size / GLOW_NATIVE;
  const glowW = 305 * glowScale;
  const glowH = 307 * glowScale;

  const washW = size * WASH_W * 1.3934;
  const washH = size * WASH_H * 1.5484;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute top-1/2 left-1/2 ${className}`}
    >
      {/* Trapezoid wash pooling beneath the orb */}
      <svg
        className="absolute"
        style={{
          width: washW,
          height: washH,
          left: size * WASH_DX - washW / 2,
          top: size * WASH_DY - washH / 2,
        }}
        viewBox="0 0 316.665 252.369"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.4" filter="url(#orb-wash-blur)">
          <path
            d="M86.6617 44.6947H245.264L271.97 207.674H44.6947L86.6617 44.6947Z"
            fill="#F06B49"
          />
        </g>
        <defs>
          <filter
            id="orb-wash-blur"
            x="0"
            y="0"
            width="316.665"
            height="252.369"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="22.3474" result="blur" />
          </filter>
        </defs>
      </svg>

      {/* Halo — two blurred ellipses, the second plus-lighter */}
      <svg
        className="absolute"
        style={{
          width: glowW,
          height: glowH,
          left: -152.339 * glowScale,
          top: -153.166 * glowScale,
        }}
        viewBox="0 0 305 307"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#orb-halo-blur-a)">
          <ellipse
            cx="153.425"
            cy="182.342"
            rx="106.007"
            ry="106.02"
            fill="#ED3D11"
          />
        </g>
        <g
          filter="url(#orb-halo-blur-b)"
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <ellipse
            cx="153.426"
            cy="177.163"
            rx="100.557"
            ry="100.841"
            fill="#D96811"
          />
        </g>
        <defs>
          <filter
            id="orb-halo-blur-a"
            x="-29.7467"
            y="-0.842438"
            width="366.345"
            height="366.368"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="38.5824" result="blur" />
          </filter>
          <filter
            id="orb-halo-blur-b"
            x="6.15167"
            y="29.6048"
            width="294.55"
            height="295.117"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="23.3587" result="blur" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
