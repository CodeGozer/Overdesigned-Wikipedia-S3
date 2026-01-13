import { getWikiSummary } from "@/services/wiki";
import { HomeOrchestrator } from "@/components/home-orchestrator";

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
      <HomeOrchestrator initialArticles={articles as any} />
    </div>
  );
}
