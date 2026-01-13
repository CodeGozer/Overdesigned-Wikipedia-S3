"use client";

import React, { useRef } from 'react';
import Image from "next/image";
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { BrutalistInfobox } from './brutalist-infobox';
import { TableOfContents } from './table-of-contents';

interface ArticleLayoutProps {
    children: React.ReactNode;
    title: string;
    lead?: string;
    infobox?: React.ReactNode;
    themeColor?: string;
    imageUrl?: string;
}

export function ArticleLayout({ children, title, lead, infobox, themeColor = "#00FF00", imageUrl }: ArticleLayoutProps) {
    const container = useRef(null);
    useScrollReveal(container);

    // Dynamic Style Object
    const containerStyle = {
        "--theme-accent": themeColor
    } as React.CSSProperties;

    return (
        <section ref={container} className="relative w-full min-h-screen py-12 md:py-24 px-4 md:px-8 max-w-screen-[1600px] mx-auto" style={containerStyle}>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 pl-4 md:pl-0">

                {/* --- ZONE A: The Briefing --- */}
                {/* Mobile Order: Title -> Infobox -> Intro */}

                {/* 1. Title Block (Col 1-8) */}
                <div className="col-span-1 md:col-span-8 md:order-1 order-1">
                    <h1
                        className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase leading-[0.9] mb-6 md:mb-8"
                        style={{ textShadow: `4px 4px 0px var(--theme-accent)` }}
                    >
                        {title}
                    </h1>
                </div>

                {/* 2. Visual Asset / Infobox (Col 9-12) */}
                {/* Sits to the right of Title & Intro on Desktop. Between Title & Intro on Mobile. */}
                <div className="col-span-1 md:col-span-4 md:row-span-2 md:order-2 order-2 h-fit">
                    <div className="md:sticky md:top-24 w-full">
                        {infobox ? (
                            <div className="relative w-full">
                                {infobox}
                                {/* Decorative "connector" line to content */}
                                <div className="absolute -bottom-8 left-1/2 w-px h-8 bg-[var(--theme-accent)] md:hidden"></div>
                            </div>
                        ) : (
                            <BrutalistInfobox />
                        )}
                    </div>
                </div>

                {/* 3. Intro Block (Col 1-8) */}
                <div className="col-span-1 md:col-span-8 md:order-3 order-3 mb-12 md:mb-8">
                    {lead && (
                        <div className="border-l-4 border-[var(--theme-accent)] pl-6 py-2 bg-deep-void/50 backdrop-blur-sm">
                            <p className="text-xl md:text-2xl font-display text-[#d4d4d4] leading-relaxed">
                                {lead}
                            </p>
                        </div>
                    )}
                </div>


                {/* --- ZONE B: The Deep Dive --- */}

                {/* 4. Main Article Content (Col 1-8) */}
                <div className="col-span-1 md:col-span-8 md:order-4 order-5">
                    <article
                        className="prose prose-invert max-w-none nicopedia-content"
                        data-animate="article-fade-in"
                    >
                        {children}
                    </article>
                </div>

                {/* 5. Mission Log / TOC (Col 9-12) - The "Sidekick" */}
                {/* Swapped: Swaps in where the Infobox was seamlessly */}
                <div className="col-span-1 md:col-span-4 md:order-5 order-4 hidden md:block">
                    <div className="sticky top-[120px] h-[calc(100vh-150px)] overflow-y-auto pr-2 custom-scrollbar">
                        <TableOfContents contentSelector=".nicopedia-content" />
                    </div>
                </div>

            </div>
        </section>
    );
}
