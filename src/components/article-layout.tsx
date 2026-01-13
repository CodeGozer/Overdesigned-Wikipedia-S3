"use client";

import React, { useRef } from 'react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { BrutalistInfobox } from './brutalist-infobox';

interface ArticleLayoutProps {
    children: React.ReactNode;
    title: string;
    infobox?: React.ReactNode;
}

export function ArticleLayout({ children, title, infobox }: ArticleLayoutProps) {
    const container = useRef(null);
    useScrollReveal(container);

    return (
        <section ref={container} className="container mx-auto max-w-screen-2xl px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
                {/* Main Content Area */}
                <article
                    className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-white prose-p:text-off-white/80"
                    data-animate="article-fade-in"
                >
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6 scroll-m-20 underline decoration-indigo-500 decoration-4 underline-offset-4 uppercase">
                        {title}
                    </h1>

                    <div className="article-content" data-scroll-section>
                        {/* Content acts as scroll trigger area */}
                        {children}
                    </div>
                </article>

                {/* Sidebar / Infobox Area */}
                <aside className="hidden md:block">
                    <div className="sticky top-20 motion-infobox-container transition-transform duration-500 will-change-transform">
                        {infobox ? (
                            infobox
                        ) : (
                            <BrutalistInfobox />
                        )}
                    </div>
                </aside>
            </div>
        </section>
    );
}
