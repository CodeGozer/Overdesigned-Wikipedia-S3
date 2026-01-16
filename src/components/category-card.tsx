"use client";

import React from 'react';
import { CategoryConfig } from "@/config/curated-categories";
import { useScramble } from '@/hooks/use-scramble';
import clsx from 'clsx';
import Link from 'next/link';

interface CategoryCardProps {
    category: CategoryConfig;
}

export function CategoryCard({ category }: CategoryCardProps) {
    // Format category name for display (replace underscores with spaces)
    const displayName = category.id.replace(/_/g, " ");

    // Scramble hook - autoStart false so we control it on hover
    const { displayText, scramble, stop } = useScramble({
        text: displayName,
        speed: 30,
        startOnMount: false
    });

    // Generate Smart Link
    const getHref = () => {
        if (category.type === 'fandom' && category.api_url) {
            return `/wiki/fandom/${category.target}?api=${encodeURIComponent(category.api_url)}`;
        }
        if (category.type === 'wiki_category') {
            return `/wiki/Category:${category.target}`;
        }
        // Default: Wiki Article
        return `/wiki/${category.target}`;
    }

    return (
        <Link
            href={getHref()}
            className="group relative block h-32 md:h-40 perspective-midrange"
            onMouseEnter={() => scramble()}
            onMouseLeave={() => stop()}
        >
            {/* Base Card Background */}
            <div className="absolute inset-0 bg-black/40 border border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-neon-green/50 group-hover:bg-black/60">

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-white/30 group-hover:border-neon-green transition-colors" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-white/30 group-hover:border-neon-green transition-colors" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-white/30 group-hover:border-neon-green transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-white/30 group-hover:border-neon-green transition-colors" />

                {/* Glitch Overlay (Hidden by defalt, shows on hover) */}
                <div className="absolute inset-0 bg-neon-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 text-center">
                    {/* Icon / Decorator */}
                    <div className="mb-2 text-white/20 font-mono text-xs group-hover:text-neon-green transition-colors">
                        {category.type === 'fandom' ? '/// FANDOM_NET' : '/// WIKI_DATA'}
                    </div>

                    {/* Scrambling Text */}
                    <h3 className={clsx(
                        "font-display font-bold text-lg md:text-xl tracking-wide uppercase transition-colors",
                        "text-white group-hover:text-neon-green"
                    )}>
                        {displayText}
                    </h3>

                    {/* Data Line */}
                    <div className="mt-2 w-12 h-[1px] bg-white/20 group-hover:bg-neon-green group-hover:w-24 transition-all duration-500" />
                </div>
            </div>
        </Link>
    );
}
