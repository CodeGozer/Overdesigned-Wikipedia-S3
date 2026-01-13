"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearch } from "./search-context";

export function SearchOverlay() {
    const { isOpen, closeSearch } = useSearch();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !isOpen) return null;

    // Use portal to render at root level properly
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

            <div className="w-full max-w-4xl px-8">
                <div className="mb-4 text-xs font-mono text-neon-green tracking-[0.2em] uppercase">
            /// The Rabbit Hole /// search_protocol_v2
                </div>
                <input
                    type="text"
                    placeholder="SEARCH..."
                    className="w-full bg-transparent border-0 text-7xl md:text-9xl font-display font-black text-off-white placeholder-gray-700 focus:ring-0 focus:outline-none caret-neon-green uppercase tracking-tighter"
                    autoFocus
                />
                <div className="mt-8 flex justify-between text-xs font-mono text-gray-500">
                    <span>PRESS ENTER TO JUMP</span>
                    <span>ESC TO ABORT</span>
                </div>
            </div>
        </div>,
        document.body
    );
}
