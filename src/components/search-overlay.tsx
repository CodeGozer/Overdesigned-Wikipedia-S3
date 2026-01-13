"use client";

import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSearch } from "./search-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

import { searchWiki, WikiSearchResult } from "@/services/wiki";

export function SearchOverlay() {
    const { isOpen, closeSearch } = useSearch();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<WikiSearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length > 1) {
                const searchResults = await searchWiki(query);
                setResults(searchResults);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % results.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex].title);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const handleSelect = (title: string) => {
        const slug = encodeURIComponent(title.replace(/ /g, "_"));
        router.push(`/wiki/${slug}`);
        closeSearch();
    };

    if (!mounted || !isOpen) return null;

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-deep-void/95 backdrop-blur-xl animate-in fade-in duration-200">
            {/* Close Button */}
            <button
                onClick={closeSearch}
                className="absolute top-8 right-8 text-off-white hover:text-neon-green transition-colors"
            >
                <div className="text-sm font-mono tracking-widest">[CLOSE]</div>
            </button>

            <div className="w-full max-w-4xl px-8 flex flex-col max-h-[80vh]">
                <div className="mb-4 text-xs font-mono text-neon-green tracking-[0.2em] uppercase shrink-0">
            /// The Rabbit Hole /// search_protocol_v2
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(0);
                    }}
                    placeholder="SEARCH..."
                    className="w-full bg-transparent border-0 text-7xl md:text-9xl font-display font-black text-off-white placeholder-gray-800 focus:ring-0 focus:outline-none caret-neon-green uppercase tracking-tighter shrink-0"
                    autoFocus
                />

                {/* Results List */}
                <div className="mt-8 flex-1 overflow-y-auto min-h-[100px] space-y-2">
                    {results.map((result, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(result.title)}
                            className={clsx(
                                "w-full text-left p-4 border-l-4 transition-all duration-200 group flex items-baseline justify-between",
                                index === selectedIndex
                                    ? "border-neon-green bg-white/5"
                                    : "border-transparent hover:bg-white/5 hover:border-white/20"
                            )}
                        >
                            <span className={clsx(
                                "text-2xl md:text-4xl font-bold font-display uppercase tracking-tight line-clamp-1",
                                index === selectedIndex ? "text-neon-green" : "text-gray-400 group-hover:text-gray-200"
                            )}>
                                {result.title}
                            </span>
                            <span className="font-mono text-xs text-gray-600 uppercase tracking-widest shrink-0 ml-4">
                                ARTICLE
                            </span>
                        </button>
                    ))}
                    {query && results.length === 0 && (
                        <div className="text-gray-600 font-mono text-sm py-4">
                            /// NO RESULTS FOUND ///
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between text-xs font-mono text-gray-500 shrink-0">
                    <span>PRESS ENTER TO JUMP</span>
                    <span>ESC TO ABORT</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
