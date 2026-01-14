"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSearch } from './search-context';
import { getRandomFromCategory } from '@/services/wiki';
import { COOL_CATEGORIES } from '@/config/curated-categories';

export function SiteHeader() {
  const { openSearch } = useSearch();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRandomLoading, setIsRandomLoading] = useState(false);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Serendipity / Random Button Logic
  const handleRandomClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRandomLoading) return;

    setIsRandomLoading(true);
    try {
      // 1. Pick a cool category
      const randomCategory = COOL_CATEGORIES[Math.floor(Math.random() * COOL_CATEGORIES.length)];

      // 2. Fetch a random article from it
      const title = await getRandomFromCategory(randomCategory);

      if (title) {
        // 3. Navigate
        const slug = title.replace(/ /g, '_');
        router.push(`/wiki/${encodeURIComponent(slug)}`);
      } else {
        // Fallback if empty category
        console.warn("Retrying random...");
        // Simple fallback to a known one or just do nothing (user clicks again)
      }
    } catch (error) {
      console.error("Random failed", error);
    } finally {
      setIsRandomLoading(false);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
        ? "border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80"
        : "border-transparent bg-transparent"
        }`}
      data-animate="header-reveal"
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo / Home Link */}
        <Link
          href="/home"
          className="group relative flex items-center gap-2 overflow-hidden"
        >
          <div className="relative z-10 font-display text-2xl font-black tracking-tighter text-off-white transition-colors group-hover:text-neon-green">
            NICOPEDIA
          </div>
        </Link>
        <div className="mr-8 hidden md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/home" className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch">
              <span className="relative z-10">
                Home
              </span>
            </Link>

            {/* Serendipity Button */}
            <button
              onClick={handleRandomClick}
              disabled={isRandomLoading}
              className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isRandomLoading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    <span>FATE...</span>
                  </>
                ) : (
                  "Random Article"
                )}
              </span>
            </button>

            <Link href="/categories" className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch">
              <span className="relative z-10">
                Categories
              </span>
            </Link>
            <button
              onClick={openSearch}
              className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch text-left"
            >
              <span className="relative z-10">
                [SEARCH]
              </span>
            </button>
          </nav>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center justify-between w-full">
          <Link href="/home" className="group flex items-center gap-2">
            <div className="font-display text-xl font-black tracking-tighter text-off-white transition-colors group-hover:text-neon-green">
              NICOPEDIA
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Mobile Random Button */}
            <button
              onClick={handleRandomClick}
              disabled={isRandomLoading}
              className="text-gray-400 hover:text-neon-green transition-colors"
              aria-label="Random Article"
            >
              {isRandomLoading ? (
                <span className="animate-spin block">⟳</span>
              ) : (
                <span className="text-xl">🎲</span> // Simple icon for now, or use SVG
              )}
            </button>

            <button
              onClick={openSearch}
              className="text-sm font-mono text-neon-green hover:text-neon-blue transition-colors"
            >
              [SEARCH]
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Dynamic Page Title Placeholder */}
            <span className="hidden text-sm text-gray-500 md:inline-block border rounded px-2 py-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <span className="font-mono text-xs text-gray-400">STATUS:</span> <span className="font-semibold text-gray-900 dark:text-gray-100">ONLINE</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
