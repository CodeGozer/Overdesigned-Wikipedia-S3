"use client";

import React, { useState } from 'react';
import { FinderConsole } from './finder-console';
import { HeroAnimator } from './hero-animator';
import { BentoGrid } from './bento-grid';
import { DigitalClock } from './digital-clock';
import { RandomButton } from './random-button';
import { KineticMarquee } from './kinetic-marquee';
import { EntryCard } from './entry-card';
import { generateGrid } from '@/services/interest_engine';
import { getWikiSummary } from '@/services/wiki';

// Types for fetched data
interface ArticleSummary {
    title: string;
    extract?: string;
    description?: string;
    type?: string;
    lang?: string;
    thumbnail?: {
        source: string;
        width: number;
        height: number;
    };
}

interface InterestItem {
    slug: string;
    label: string;
    size: "HERO" | "TALL" | "WIDE" | "STANDARD";
    category: string;
    color: string;
    summary: ArticleSummary | null;
}

interface HomeOrchestratorProps {
    initialArticles: InterestItem[];
}

export function HomeOrchestrator({ initialArticles }: HomeOrchestratorProps) {
    const [mode, setMode] = useState<'CONSOLE' | 'DASHBOARD'>('CONSOLE');
    const [userInterests, setUserInterests] = useState<string[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<InterestItem[]>(initialArticles);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleSearch = async (interests: string[]) => {
        setIsCalculating(true);
        setUserInterests(interests);

        try {
            // 1. Generate the expanded grid based on inputs
            const gridResults = await generateGrid(interests);

            // 2. Fetch data for new items in parallel
            const newArticles = await Promise.all(
                gridResults.map(async (result) => {
                    // Normalize title for URL
                    const slug = result.title.replace(/ /g, '_');

                    // Use pre-fetched summary if available (from AI discovery), else fetch fresh
                    let summary = result.summary;
                    if (!summary) {
                        summary = await getWikiSummary(result.title);
                    }

                    return {
                        slug: slug,
                        label: result.title.replace(/_/g, ' '),
                        size: (result.type === 'USER_SELECTED' ? 'HERO' : 'STANDARD') as "HERO" | "STANDARD", // User picks get HERO size
                        category: result.type === 'USER_SELECTED' ? 'Obsession' : 'Discovery',
                        color: result.type === 'USER_SELECTED' ? 'neon-green' : 'hot-pink',
                        summary: summary
                    };
                })
            );

            setDisplayedArticles(newArticles);
            setMode('DASHBOARD');
        } catch (error) {
            console.error("Failed to calculate grid:", error);
            // Fallback to initial if error
            setMode('DASHBOARD');
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen">

            {/* MODE: CONSOLE */}
            {mode === 'CONSOLE' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-deep-void">
                    {/* Background Ambient Elements (Optional, reused from Splash or similar) */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-10 left-10 w-64 h-64 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/5 rotate-45" />
                    </div>

                    <FinderConsole onSearch={handleSearch} />

                    {/* Loading Overlay */}
                    {isCalculating && (
                        <div className="absolute inset-0 z-[60] bg-deep-void/90 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                            <div className="text-4xl md:text-6xl font-display font-black text-transparent text-stroke animate-pulse uppercase tracking-tighter">
                                Analysing...
                            </div>
                            <div className="mt-4 font-mono text-xs text-neon-green tracking-[0.5em] animate-marquee whitespace-nowrap overflow-hidden w-64 text-center">
                                /// CONNECTING_TO_WIKIPEDIA_API /// SEMANTIC_MATCHING /// VECTOR_SEARCH ///
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODE: DASHBOARD */}
            {/* We render this but hide it or animate it in. 
                Actually, simpler to conditionally render so we get the mounting animation of HeroAnimator. 
            */}
            {mode === 'DASHBOARD' && (
                <div className="animate-in fade-in duration-1000 slide-in-from-bottom-10">
                    <KineticMarquee />

                    <HeroAnimator>
                        <div className="container mx-auto px-4 py-12 md:py-24 max-w-screen-2xl">
                            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-12 mb-12 gap-8">
                                <div data-animate="hero">
                                    <DigitalClock />
                                </div>
                                <div className="flex flex-col items-end gap-2" data-animate="hero">
                                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest text-right">
                                        /// NICO'S ARCHIVE<br />
                                        /// INDEX OF OBSESSIONS<br />
                                        <span className="text-neon-green">
                                            /// FILTERS: [{userInterests.join(', ')}]
                                        </span>
                                    </div>
                                    <RandomButton />
                                </div>
                            </div>

                            <BentoGrid disableAnimation={false}>
                                {displayedArticles.map((item, index) => {
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
            )}
        </div>
    );
}
