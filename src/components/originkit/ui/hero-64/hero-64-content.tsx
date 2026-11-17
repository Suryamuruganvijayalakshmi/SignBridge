// Delivered by Originkit · stack: nextjs · styling: tailwind
/* eslint-disable */
// @ts-nocheck
"use client";
import StillSunsetMeadow from "@/components/originkit/ui/hero-64/still-sunset-meadow"

const LINKS = ["Work", "Studio", "Services", "Journal", "Contact"]

export default function Hero() {
    return (
        <section className="hero">
            <header className="nav">
                <a className="logo" href="#">
                    Figment<sup>®</sup>
                </a>
                <nav className="links" aria-label="Primary">
                    {LINKS.map((l, i) => (
                        <a key={l} href="#" className={i === 0 ? "active" : undefined}>
                            {l}
                        </a>
                    ))}
                </nav>
                <a className="btn btn-sm" href="#">
                    Start a project
                </a>
            </header>

            <div className="copy">
                <h1>
                    A world <span>shaped by</span> imagination.
                </h1>
                <p>An independent creative studio crafting distinctive identities and digital experiences with intention.</p>
                <a className="btn btn-lg" href="#">
                    Meet the studio <span aria-hidden="true">→</span>
                </a>
            </div>

            <div className="scene" aria-hidden="true">
                <StillSunsetMeadow
                    sky={{ top: "#FFFFFF", horizon: "#F8B9A4", glow: "#FFD9A8" }}
                    haze={4}
                    speed={20}
                    hover={20}
                    cloudSpeed={6}
                />
                <div className="fade" />
            </div>
        </section>
    )
}
