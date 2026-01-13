"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    contentSelector: string;
}

export function TableOfContents({ contentSelector }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        // Wait for content to render
        const timer = setTimeout(() => {
            const content = document.querySelector(contentSelector);
            if (!content) return;

            const elements = Array.from(content.querySelectorAll('h2, h3, h4'));
            const headingData: Heading[] = elements.map((el, index) => {
                // Ensure ID exists
                if (!el.id) {
                    el.id = `heading-${index}`;
                }

                return {
                    id: el.id,
                    text: el.textContent || "",
                    level: parseInt(el.tagName.substring(1))
                };
            });

            setHeadings(headingData);

            // Setup Intersection Observer for scroll spy
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                { rootMargin: '-10% 0px -80% 0px', threshold: 0.1 }
            );

            elements.forEach((el) => observer.observe(el));

            return () => observer.disconnect();
        }, 500); // 500ms delay to ensure WikiContent renders

        return () => clearTimeout(timer);
    }, [contentSelector]);

    const scrollToHeading = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Smooth scroll with lenis or native
            element.scrollIntoView({ behavior: 'smooth' });
            setActiveId(id);
        }
    };

    if (headings.length === 0) return null;

    return (
        <nav
            className="p-6 bg-deep-void/80 border border-[var(--theme-accent)]/30 backdrop-blur-md rounded-none shadow-hard relative overflow-hidden group"
            aria-label="Table of Contents"
        >
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[var(--theme-accent)] opacity-20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[var(--theme-accent)] opacity-50" />

            <h3 className="text-[var(--theme-accent)] font-mono text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--theme-accent)] inline-block animate-pulse" />
                Index_Log
            </h3>

            <ul className="space-y-1 relative">
                {/* Active Indicator Line */}
                <div className="absolute left-0 w-[1px] bg-[var(--theme-accent)]/20 h-full top-0" />

                {headings.map((heading) => (
                    <li
                        key={heading.id}
                        style={{ paddingLeft: `${(heading.level - 2) * 12 + 10}px` }}
                        className="relative"
                    >
                        <a
                            href={`#${heading.id}`}
                            onClick={(e) => scrollToHeading(heading.id, e)}
                            className={cn(
                                "block text-sm py-1 transition-all duration-300 font-mono truncate hover:text-[var(--theme-accent)]",
                                activeId === heading.id
                                    ? "text-[var(--theme-accent)] translate-x-1 font-bold shadow-[var(--theme-accent)] drop-shadow-[0_0_5px_var(--theme-accent)]"
                                    : "text-white/40 hover:translate-x-1"
                            )}
                        >
                            {activeId === heading.id && (
                                <span className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--theme-accent)]" />
                            )}
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
