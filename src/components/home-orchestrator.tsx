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
import { SystemTutorial } from './system-tutorial';

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
    apiBaseUrl?: string;
}

interface HomeOrchestratorProps {
    initialArticles: InterestItem[];
}

export function HomeOrchestrator({ initialArticles }: HomeOrchestratorProps) {
    const [mode, setMode] = useState<'CONSOLE' | 'DASHBOARD'>('CONSOLE');
    const [userInterests, setUserInterests] = useState<string[]>([]);
    const [displayedArticles, setDisplayedArticles] = useState<InterestItem[]>(initialArticles);
    const [isCalculating, setIsCalculating] = useState(false);
    const [isRestoring, setIsRestoring] = useState(true); // Start true to check storage
    const [showTutorial, setShowTutorial] = useState(false);
    const [searchMode, setSearchMode] = useState<'PARALLEL' | 'SYNTHESIS'>('PARALLEL');

    // Persistence Logic (Back Button Fix) & Tutorial Check
    React.useEffect(() => {
        const checkPersistence = async () => {
            // Check Tutorial
            const hasSeenTutorial = localStorage.getItem('nicopedia_tutorial_seen');
            if (!hasSeenTutorial) {
                setShowTutorial(true);
            }

            // Check Vectors (We don't persist mode yet, default to Parallel)
            const savedVectors = localStorage.getItem('nicopedia_vectors');
            if (savedVectors) {
                try {
                    const parsed = JSON.parse(savedVectors);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        // Found saved state! Skip console and restore grid.
                        console.log("Found persisted session:", parsed);
                        await handleSearch(parsed, 2, 'PARALLEL', false); // Default depth 2, Parallel, Don't save again recursively
                        setIsRestoring(false);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to parse saved vectors", e);
                }
            }
            // If no valid state, show console
            setIsRestoring(false);
            setMode('CONSOLE');
        };

        checkPersistence();
    }, []);

    const handleSearch = async (interests: string[], depth: number = 2, correlationMode: 'PARALLEL' | 'SYNTHESIS' = 'PARALLEL', saveToStorage = true) => {
        setIsCalculating(true);
        setUserInterests(interests);
        setSearchMode(correlationMode);

        if (saveToStorage) {
            localStorage.setItem('nicopedia_vectors', JSON.stringify(interests));
        }

        try {
            // 1. Generate the expanded grid based on inputs (Hybrid: Wiki + Fandom)
            const gridResults = await generateGrid(interests, depth, correlationMode);

            // 2. Map results to visual items
            const newArticles = await Promise.all(
                gridResults.map(async (result) => {
                    // Normalize title for URL
                    const slug = result.title.replace(/ /g, '_');

                    // Use pre-fetched summary if available
                    let summary = result.summary;
                    if (!summary) {
                        // Pass apiBaseUrl if available
                        summary = await getWikiSummary(result.title, result.apiBaseUrl);
                    }

                    // Determine Visual Style based on Source/Type
                    let category = 'Discovery';
                    let color = 'hot-pink';
                    let label = result.title.replace(/_/g, ' ');

                    if (result.type === 'USER_SELECTED') {
                        category = 'Obsession';
                        color = 'neon-green';
                    } else if (result.source === 'FANDOM') {
                        category = 'FANDOM // LORE';
                        color = 'hot-pink'; // or gold/purple? Let's stick to hot-pink for Lore
                    } else {
                        category = 'WIKI // DATA';
                        color = 'neon-blue'; // Data
                    }

                    return {
                        slug: slug,
                        label: label,
                        size: (result.type === 'USER_SELECTED' ? 'HERO' : 'STANDARD') as "HERO" | "STANDARD",
                        category: category,
                        color: color,
                        summary: summary,
                        apiBaseUrl: result.apiBaseUrl // Pass it through
                    };
                })
            );

            setDisplayedArticles(newArticles);
            setMode('DASHBOARD');
        } catch (error) {
            console.error("Failed to calculate grid:", error);
            setMode('DASHBOARD');
        } finally {
            setIsCalculating(false);
        }
    };

    const resetProfile = () => {
        localStorage.removeItem('nicopedia_vectors');
        setUserInterests([]);
        setMode('CONSOLE');
    };

    const handleTutorialClose = () => {
        setShowTutorial(false);
        localStorage.setItem('nicopedia_tutorial_seen', 'true');
    };

    return (
        <div className="relative w-full min-h-screen">


            {/* Loading/Restoring Overlay - prevents flash of console */}
            {isRestoring && (
                <div className="absolute inset-0 z-[100] bg-deep-void flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="font-display text-4xl font-black text-transparent text-stroke animate-pulse">
                            RECALIBRATING...
                        </div>
                        <div className="font-mono text-xs text-neon-green tracking-[0.2em] animate-marquee">
                            /// RESTORING_SESSION_VECTORS ///
                        </div>
                    </div>
                </div>
            )}

            {/* MODE: CONSOLE */}
            {mode === 'CONSOLE' && !isRestoring && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-deep-void">
                    {/* Background Ambient Elements (Optional, reused from Splash or similar) */}
                    <div className="absolute inset-0 pointer-events-none opacity-20">
                        <div className="absolute top-10 left-10 w-64 h-64 border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/5 rotate-45" />
                    </div>

                    <FinderConsole
                        onSearch={(interests, depth, correlationMode) => handleSearch(interests, depth, correlationMode, true)}
                        onTutorial={() => setShowTutorial(true)}
                    />

                    {/* Loading Overlay */}
                    {isCalculating && (
                        <div className="absolute inset-0 z-[60] bg-deep-void/90 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300">
                            <div className="text-4xl md:text-6xl font-display font-black text-transparent text-stroke animate-pulse uppercase tracking-tighter">
                                Analysing...
                            </div>
                            <div className="mt-4 font-mono text-xs text-neon-green tracking-[0.5em] animate-marquee whitespace-nowrap overflow-hidden w-64 text-center">
                                {searchMode === 'SYNTHESIS'
                                    ? "/// CALCULATING_CROSS_VECTOR_INTERSECTION /// DETECTING_OVERLAP ///"
                                    : "/// RUNNING_DUAL_CORE_ANALYSIS /// INDEPENDENT_STREAMS ///"
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* MODE: DASHBOARD */}
            {/* We render this but hide it or animate it in.
                Actually, simpler to conditionally render so we get the mounting animation of HeroAnimator.
            */}
            {mode === 'DASHBOARD' && !isRestoring && (
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
                                    <div className="flex gap-2">
                                        <RandomButton />
                                        {/* Desktop Reset Button */}
                                        <button
                                            onClick={resetProfile}
                                            className="hidden md:block px-3 py-1 text-xs font-mono font-bold text-red-500 border border-red-500/20 hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                                        >
                                            [RESET]
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile FAB Reset Button */}
                            <button
                                onClick={resetProfile}
                                className="md:hidden fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-red-500/10 border border-red-500 text-red-500 flex items-center justify-center shadow-lg backdrop-blur-md active:scale-95 transition-transform"
                                aria-label="Reset Profile"
                            >
                                <span className="text-xl font-bold">×</span>
                            </button>


                            <BentoGrid disableAnimation={false}>
                                {displayedArticles.map((item, index) => {
                                    if (!item.summary) return null;

                                    // Construct HREF with API param if needed
                                    let href = `/wiki/${encodeURIComponent(item.slug)}`;
                                    if (item.apiBaseUrl) {
                                        href += `?api=${encodeURIComponent(item.apiBaseUrl)}`;
                                    }

                                    return (
                                        <EntryCard
                                            key={item.slug}
                                            index={index}
                                            title={item.label}
                                            category={item.category}
                                            date="LIVE"
                                            href={href}
                                            color={item.color as any}
                                            imageUrl={item.summary.thumbnail?.source}
                                            size={item.size}
                                        />
                                    );
                                })}
                            </BentoGrid>
                        </div>
                    </HeroAnimator >
                </div >
            )}
            {/* System Tutorial Overlay - Render last to overlap */}
            {showTutorial && <SystemTutorial onClose={handleTutorialClose} />}
        </div >
    );
}
