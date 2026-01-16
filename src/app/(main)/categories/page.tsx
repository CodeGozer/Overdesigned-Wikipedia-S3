"use client";

import { useState, useMemo } from 'react';
import { FloatingWordCloud } from "@/components/floating-word-cloud";
import { CategoryCard } from "@/components/category-card";
import { COOL_CATEGORIES } from "@/config/curated-categories";

export default function CategoriesPage() {
    const [filter, setFilter] = useState("");

    const filteredCategories = useMemo(() => {
        if (!filter) return COOL_CATEGORIES;
        const lower = filter.toLowerCase();
        return COOL_CATEGORIES.filter(cat =>
            cat.id.toLowerCase().replace(/_/g, ' ').includes(lower)
        );
    }, [filter]);

    return (
        <div className="relative w-full min-h-screen container mx-auto px-4 py-24">
            {/* Background Atmosphere */}
            <FloatingWordCloud />

            <div className="relative z-10">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter mb-4 text-white">
                        CATEGORIES /// INDEX
                    </h1>

                    {/* Filter Input */}
                    <div className="relative max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-neon-green transition-colors">
                            <span className="font-mono">{'>'}</span>
                        </div>
                        <input
                            type="text"
                            className="w-full bg-black/40 border border-white/20 text-white font-mono placeholder-white/20 pl-8 pr-4 py-3 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all backdrop-blur-sm"
                            placeholder="FILTER DATASTREAM..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        {/* Decorative scanline under input */}
                        <div className="absolute bottom-0 left-0 h-[2px] bg-neon-green w-0 group-focus-within:w-full transition-all duration-500 ease-out" />
                    </div>
                </header>

                {/* Grid */}
                {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredCategories.map((cat) => (
                            <CategoryCard key={cat.id} category={cat} />
                        ))}
                    </div>
                ) : (
                    <div className="p-12 border border-dashed border-white/10 rounded-lg text-center font-mono text-white/40">
                        /// NO_MATCHES_FOUND
                        <br />
                        /// ADJUST_SEARCH_QUERY
                    </div>
                )}
            </div>
        </div>
    );
}
