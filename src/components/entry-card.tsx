"use client";

import Link from "next/link";
import { clsx } from "clsx";

interface EntryCardProps {
    title: string;
    category: string;
    date: string;
    href: string;
    color?: "neon-green" | "hot-pink";
    imageUrl?: string;
    size?: "HERO" | "TALL" | "WIDE" | "STANDARD";
    className?: string;
    index?: number;
}

export function EntryCard({
    title,
    category,
    date,
    href,
    color = "neon-green",
    className,
    index,
    imageUrl,
    size = "STANDARD"
}: EntryCardProps) {

    const borderColor = color === "neon-green" ? "border-neon-green" : "border-hot-pink";
    const shadowColor = color === "neon-green" ? "shadow-neon-green" : "shadow-hot-pink";
    const hoverBg = color === "neon-green" ? "group-hover:bg-neon-green" : "group-hover:bg-hot-pink";

    // Size Classes
    const sizeClasses = {
        HERO: "md:col-span-2 md:row-span-2",
        TALL: "md:col-span-1 md:row-span-2",
        WIDE: "md:col-span-2 md:row-span-1",
        STANDARD: "md:col-span-1 md:row-span-1",
    };

    return (
        <Link
            href={href}
            className={clsx(
                "group block relative overflow-hidden bg-deep-void/10 backdrop-blur-sm border-2 transition-all duration-300",
                borderColor,
                sizeClasses[size],
                className
            )}
            style={{
                boxShadow: `4px 4px 0px ${color === 'neon-green' ? '#39ff14' : '#ff00ff'}`
            }}
            data-animate="entry-card"
            data-index={index}
        >
            {/* Background Image (Greyscale -> Color) */}
            {imageUrl && (
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center opacity-80 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            )}

            {/* Solid Fill Animation (Overlay) */}
            <div className={clsx(
                "absolute inset-0 opacity-0 transition-opacity duration-200 mix-blend-overlay",
                hoverBg,
                "group-hover:opacity-40"
            )} />

            {/* Gradient Scrim for Text Legibility */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Content */}
            <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    {/* Category Badge */}
                    <span className="font-mono text-[10px] uppercase tracking-widest bg-black/50 backdrop-blur px-2 py-1 text-white border border-white/20">
                        [{category}]
                    </span>

                    {/* Date / ID */}
                    <span className="font-mono text-[10px] text-gray-400">
                        {date}
                    </span>
                </div>

                <div>
                    <h3 className={clsx(
                        "font-display font-bold uppercase tracking-tight text-white group-hover:text-neon-green transition-colors leading-none",
                        size === "HERO" ? "text-4xl md:text-5xl" : "text-xl md:text-2xl"
                    )}>
                        {title}
                    </h3>
                    <div className="h-0.5 w-0 group-hover:w-full bg-neon-green transition-all duration-300 mt-2" />
                </div>
            </div>
        </Link>
    );
}
