import Link from "next/link";
import { DigitalClock } from "@/components/digital-clock";
import { RandomButton } from "@/components/random-button";
import { BentoGrid } from "@/components/bento-grid";
import { EntryCard } from "@/components/entry-card";
import { KineticMarquee } from "@/components/kinetic-marquee";
import { getWikiSummary } from "@/services/wiki";
import { HeroAnimator } from "@/components/hero-animator";

// Configuration: The Interest Grid
const INTERESTS = [
  { slug: 'Fallout_(series)', label: 'Fallout', size: 'HERO', category: 'GAME', color: 'neon-green' },
  { slug: 'South_Africa', label: 'South Africa', size: 'HERO', category: 'PLACE', color: 'hot-pink' },
  { slug: 'Vocaloid', label: 'Vocaloids', size: 'TALL', category: 'TECH', color: 'neon-green' },
  { slug: 'Jet_fighter', label: 'Fighter Jets', size: 'WIDE', category: 'TECH', color: 'hot-pink' },
  { slug: 'Clair_Obscur:_Expedition_33', label: 'Expedition 33', size: 'WIDE', category: 'GAME', color: 'neon-green' },
  { slug: 'Destiny_2', label: 'Destiny', size: 'STANDARD', category: 'GAME', color: 'hot-pink' },
  { slug: 'Jujutsu_Kaisen', label: 'JJK', size: 'TALL', category: 'ANIME', color: 'neon-green' },
  { slug: 'Bleach_(manga)', label: 'Bleach', size: 'TALL', category: 'MANGA', color: 'hot-pink' },
  { slug: 'Homebuilt_computer', label: 'PC Building', size: 'STANDARD', category: 'TECH', color: 'neon-green' },
  { slug: 'Unus_Annus', label: 'Unus Annus', size: 'STANDARD', category: 'LORE', color: 'hot-pink' },
  { slug: 'Marvel_Comics', label: 'Marvel', size: 'STANDARD', category: 'COMICS', color: 'neon-green' },
  { slug: 'DC_Comics', label: 'DC', size: 'STANDARD', category: 'COMICS', color: 'hot-pink' },
  { slug: 'Manga', label: 'Manga', size: 'STANDARD', category: 'ART', color: 'neon-green' },
] as const;

export default async function Home() {
  // Fetch all interests in parallel
  const articles = await Promise.all(
    INTERESTS.map(async (item) => {
      const summary = await getWikiSummary(item.slug);
      return {
        ...item,
        summary
      };
    })
  );

  return (
    <div className="pb-24">
      <KineticMarquee />

      {/* Hero Section */}
      <HeroAnimator>
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-screen-2xl">
          <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 mb-12 gap-8">
            <div data-animate="hero">
              <DigitalClock />
            </div>
            <div className="flex flex-col items-end gap-2" data-animate="hero">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest text-right">
                    /// NICO'S ARCHIVE<br />
                    /// INDEX OF OBSESSIONS
              </div>
              <RandomButton />
            </div>
          </div>

          {/* The Interest Grid (Tetris Layout) */}
          {/* We disable the internal scroll animation because we rely on the client animation wrapper if we decide to add one, 
            but actually since this is a server component we might want to bring back the client-side orchestrator 
            OR just let the items animate nicely with CSS or re-wrap. 
            For now, we'll keep it simple as the original page had a client wrapper.
            Wait, I'm editing the page component to be ASYNC. This means I can't use `useGSAP` or `useRef` directly here.
            I need to move the logic or use a Client Component wrapper for the timeline. 
            
            Strategy:
            1. Create a <HomeClientWrapper> that handles the GSAP entrance.
            2. Pass the fetched data to it.
            
            Actually, to save creating a new file right now, I'll strip the GSAP hook from this Server Component
            and rely on `EntryCard` CSS transitions or a simple script. 
            But the user expects the animation. 
            
            Better plan: make a <GridAnimator> client component that wraps the BentoGrid.
        */}

          <BentoGrid disableAnimation={false}>
            {/* Enable BentoGrid animation since we are removing the parent GSAP timeline */}

            {articles.map((item, index) => {
              if (!item.summary) return null;

              return (
                <EntryCard
                  key={item.slug}
                  index={index}
                  title={item.label}
                  category={item.category}
                  date="LIVE"
                  href={`/wiki/${encodeURIComponent(item.slug)}`}
                  color={item.color as any}
                  imageUrl={item.summary.thumbnail?.source}
                  size={item.size}
                />
              );
            })}
          </BentoGrid>
        </div>
      </HeroAnimator>
    </div>
  );
}
