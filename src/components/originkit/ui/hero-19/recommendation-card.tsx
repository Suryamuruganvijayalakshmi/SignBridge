/* eslint-disable */
// Delivered by Originkit · stack: nextjs · styling: tailwind
"use client";

/** Public asset under /sections/hero-19/assets */
function asset(file: string) {
  return `/originkit/hero-19/${file}`;
}

/**
 * Recommendation card — Figma "Feature" (2280:6094). Desktop only; the mobile
 * and iPad frames have no equivalent.
 *
 * Frame places it at (1109, 532) at 238 x 219.
 */

const ITEMS = [
  { icon: asset("icon-running.svg"), label: "20 min walk" },
  { icon: asset("icon-water.svg"), label: "Drink 600ml water" },
  { icon: asset("icon-sleep.svg"), label: "Sleep before 10 PM" },
];

/** Radial sheen Figma bakes into the card's fill. */
const CARD_SHEEN =
  "radial-gradient(120% 100% at 0% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 100%)";

export const RecommendationCard = () => (
  <div
    className="hidden desktop-sm:absolute desktop-sm:right-[93px] desktop-sm:bottom-[89px] desktop-sm:z-20 desktop-sm:flex desktop-sm:h-[219px] desktop-sm:w-[238px] desktop-sm:flex-col desktop-sm:items-start desktop-sm:justify-center desktop-sm:gap-3 desktop-sm:overflow-hidden desktop-sm:rounded-[20px] desktop-sm:border desktop-sm:border-solid desktop-sm:border-white/10 desktop-sm:p-5"
    style={{ backgroundImage: CARD_SHEEN }}
  >
    {/* Hairlines running out of the icon, as in the design */}
    <span
      aria-hidden
      className="absolute top-[41px] left-[63px] block h-px w-[193px] bg-white/10"
    />
    <span
      aria-hidden
      className="absolute top-[41px] left-0 block h-px w-[19px] bg-white/10"
    />
    <span
      aria-hidden
      className="absolute top-[2px] left-[41px] block h-[17px] w-px bg-white/10"
    />

    {/* Icon badge */}
    <div className="relative size-11 shrink-0">
      <div className="absolute inset-0 rounded-[40px] border border-solid border-white/20 backdrop-blur-[25px]" />
      <div className="absolute top-[5px] left-[5px] size-[34px] rounded-[20px] border border-solid border-white/10 bg-linear-to-b from-white/0 from-50% to-white/30 backdrop-blur-[25px]">
        <img
          src={asset("icon-star-fall.svg")}
          alt=""
          className="absolute top-1/2 left-1/2 block size-[18px] max-w-none -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>

    <div className="relative flex flex-col items-start gap-[18px]">
      <p className="font-tight text-[16px] leading-[1.1] font-medium whitespace-nowrap text-white">
        Recommandation
      </p>

      <ul className="flex flex-col items-start gap-3">
        {ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-3 opacity-60">
            <img
              src={item.icon}
              alt=""
              className="block size-5 max-w-none shrink-0"
            />
            <span className="font-tight text-[16px] leading-[1.3] font-light whitespace-nowrap text-white">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
