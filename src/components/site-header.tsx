"use client";

import Link from 'next/link';
import { useSearch } from './search-context';

export function SiteHeader() {
  const { openSearch } = useSearch();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80"
      data-animate="header-reveal"
    >
      {/* TODO: Insert Page Wipe Animation Here */}
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-8 hidden md:flex">
          <div className="relative group">
            <Link href="/" className="mr-6 flex items-center space-x-2 font-bold text-xl tracking-tight text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-105">
              {/* Placeholder for Animated Brand Intro in future */}
              <span className="brand-text">2026 Nicopedia</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch">
              <span className="relative z-10">
                Home
              </span>
            </Link>
            <Link href="#" className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch">
              <span className="relative z-10">
                Random Article
              </span>
            </Link>
            <Link href="#" className="group flex items-center transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-200 px-2 py-1 hover-glitch">
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

        {/* Mobile View Placeholder */}
        <div className="md:hidden flex items-center gap-4">
          <span className="font-bold text-lg text-indigo-600">Nicopedia</span>
          <button
            onClick={openSearch}
            className="text-sm font-mono"
          >
            [SEARCH]
          </button>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Dynamic Page Title Placeholder */}
            <span className="hidden text-sm text-gray-500 md:inline-block border rounded px-2 py-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              Looking at: <span className="font-semibold text-gray-900 dark:text-gray-100">Index</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
