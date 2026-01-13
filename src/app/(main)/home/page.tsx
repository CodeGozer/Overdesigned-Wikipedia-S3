"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DigitalClock } from "@/components/digital-clock";
import { RandomButton } from "@/components/random-button";
import { BentoGrid } from "@/components/bento-grid";
import { EntryCard } from "@/components/entry-card";
import { KineticMarquee } from "@/components/kinetic-marquee";
import { BrutalistInfobox } from "@/components/brutalist-infobox"; // Import Infobox
import Link from "next/link";
import EF2000_DATA from "@/data/ef-2000.json"; // Import Data

// Note: ModelViewer dynamic import removed here as it is inside BrutalistInfobox now

// Dummy Data
const RECENT_ENTRIES = [
  { title: "Neuro-Link Protocals", category: "Cybernetics", date: "JAN 12", color: "hot-pink" },
  { title: "Tokyo Ghost District", category: "Urbanism", date: "JAN 10", color: "neon-green" },
  { title: "Analog Decay", category: "Philosophy", date: "JAN 08", color: "neon-green" },
  { title: "Void Synthesis", category: "Audio", date: "JAN 05", color: "hot-pink" },
  { title: "Brutalist Web 3.0", category: "Design", date: "JAN 01", color: "neon-green" },
];

export default function Home() {
  const containerRef = useRef(null);

  // Entrance Animation
  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Hero Reveal (Clock & Button)
    tl.from("[data-animate='hero']", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.1
    });

    // 2. Grid Items Reveal (Cards)
    // Note: BentoGrid's internal ScrollTrigger might conflict if we aren't careful.
    // However, since this is "on mount" and they are likely in viewport, 
    // we want a distinct "Arrival" animation that overrides or precedes scroll triggers.
    // For simplicity, we'll let this run immediately.
    tl.from("[data-animate='entry-card']", {
      y: 100,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "expo.out",
    }, "-=0.4"); // Overlap with hero slightly

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="pb-24">
      <KineticMarquee />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24 max-w-screen-2xl">
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 mb-12 gap-8">
          <div data-animate="hero">
            <DigitalClock />
          </div>
          <div className="flex flex-col items-end gap-2" data-animate="hero">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest text-right">
                    /// ACCESSING DATABASE...<br />
                    /// STATUS: ONLINE
            </div>
            <RandomButton />
          </div>
        </div>

        {/* The Grid */}
        {/* We disable the internal scroll animation because we are handling a custom "Arrival" animation in the parent component */}
        <BentoGrid disableAnimation={true}>
          {/* Featured Artifact (Spans 2 cols, 2 rows approx) */}
          <div className="md:col-span-2 md:row-span-2 group min-h-[400px]" data-animate="entry-card">
            <Link href="/wiki/ef-2000" className="block h-full transition-transform duration-300 group-hover:scale-[1.01]">
              <div className="relative h-full">
                {/* We use the BrutalistInfobox but override the image to force 3D model for that 'tech' look */}
                <BrutalistInfobox
                  title={EF2000_DATA.infobox.title}
                  stats={EF2000_DATA.infobox.stats.slice(0, 4)} // Show first 4 stats
                // No image prop passed -> renders ModelViewer
                />

                {/* Optional Overlay Text to make it clear it's clickable */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-neon-green text-black text-xs font-bold px-2 py-1 uppercase tracking-widest animate-pulse">
                                /// FEATURED
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Standard Entries */}
          {RECENT_ENTRIES.map((entry: any, i) => (
            <EntryCard
              key={i}
              index={i}
              title={entry.title}
              category={entry.category}
              date={entry.date}
              href="#" // Dummy links for now
              color={entry.color}
            />
          ))}
        </BentoGrid>
      </section>
    </div>
  );
}
