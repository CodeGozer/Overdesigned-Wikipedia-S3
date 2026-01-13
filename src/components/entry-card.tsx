"use client";

import Link from "next/link";
import { clsx } from "clsx";

interface EntryCardProps {
    title: string;
    category: string;
    date: string;
    href: string;
    color?: "neon-green" | "hot-pink";
    className?: string;
    index: number; // For animation stagger
}

export function EntryCard({
    title,
    category,
    date,
    href,
    color = "neon-green",
    className,
    index
}: EntryCardProps) {

    const borderColor = color === "neon-green" ? "border-neon-green" : "border-hot-pink";
    const shadowColor = color === "neon-green" ? "shadow-neon-green" : "shadow-hot-pink";
    const hoverBg = color === "neon-green" ? "group-hover:bg-neon-green" : "group-hover:bg-hot-pink";

    return (
        <Link
            href={href}
            className={clsx(
                "group block relative bg-deep-void/10 backdrop-blur-sm border-2 transition-all duration-300",
                borderColor,
                // Hard shadow using Box Shadow utility requires custom CSS or arbitrary value
                // We'll use style for the specific colored hard shadow
                className
            )}
            style={{
                boxShadow: `8px 8px 0px ${color === 'neon-green' ? '#39ff14' : '#ff00ff'}`
            }}
            data-animate="entry-card"
            data-index={index}
        >
            {/* Solid Fill Animation */}
            <div className={clsx(
                "absolute inset-0 opacity-0 transition-opacity duration-200",
                hoverBg,
                "group-hover:opacity-100"
            )} />

            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-xs uppercase tracking-widest text-gray-400 group-hover:text-black/70">
                            {category}
                        </span>
                        <span className="font-mono text-xs text-gray-500 group-hover:text-black/70">
                            {date}
                        </span>
                    </div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white group-hover:text-black">
                        {title}
                    </h3>
                </div>

                <div className="font-mono text-xs text-right mt-4 opacity-0 group-hover:opacity-100 text-black uppercase tracking-widest transition-opacity">
                /// READ_ENTRY
                </div>
            </div>
        </Link>
    );
}
