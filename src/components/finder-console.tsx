"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface FinderConsoleProps {
    onSearch: (interests: string[], depth: number) => void;
}

const SUGGESTIONS = [
    "Mycology", "Brutalism", "Speedrunning", "Vocaloid", "Liminal Spaces",
    "Cybernetics", "Glitch Art", "Keyboards", "Typography", "Synthwave"
];

export function FinderConsole({ onSearch }: FinderConsoleProps) {
    const [inputValue, setInputValue] = useState("");
    const [interests, setInterests] = useState<string[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [signalDepth, setSignalDepth] = useState(2); // 1=Surface, 2=Hybrid, 3=Deep
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Sound effect refs (placeholders for now)
    // const playClick = useSound('/sounds/click.mp3'); 

    const addInterest = (term: string) => {
        if (!term.trim()) return;
        if (interests.length >= 5) return; // Cap at 5 for now
        if (interests.includes(term.trim())) {
            setInputValue("");
            return;
        }

        setInterests(prev => [...prev, term.trim()]);
        setInputValue("");

        // Focus back on input
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addInterest(inputValue);
        }
    };

    const handleInitialize = () => {
        setIsAnalyzing(true);

        // Animation sequence before searching
        const tl = gsap.timeline({
            onComplete: () => onSearch(interests, signalDepth)
        });

        tl.to(".console-ui", {
            duration: 0.5,
            opacity: 0,
            y: -50,
            stagger: 0.1,
            ease: "power2.in"
        });
    };

    return (
        <div ref={containerRef} className="relative z-50 flex flex-col items-center justify-center w-full min-h-[60vh] text-center p-4">

            {/* Header / Label */}
            <div className="console-ui font-mono text-xs text-neon-green/80 tracking-[0.3em] uppercase mb-8 animate-pulse">
                /// Hyperfixation_Console_v1.0 ///
            </div>

            {/* Glowing Input Field */}
            <div id="tutorial-target-input" className="console-ui relative w-full max-w-2xl group">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="ENTER INTEREST_01..."
                    className="w-full bg-deep-void/80 border-2 border-white text-white font-display text-2xl md:text-5xl uppercase p-6 md:p-8 outline-none placeholder:text-white/20 focus:border-neon-green transition-all duration-300 shadow-[0_0_20px_rgba(0,255,0,0)] focus:shadow-[0_0_40px_rgba(0,255,0,0.2)] tracking-tighter"
                    autoFocus
                />

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green translate-x-1 translate-y-1" />
            </div>

            {/* Signal Depth Slider */}
            <div id="tutorial-target-slider" className="console-ui mt-8 w-full max-w-lg">
                <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest mb-2">
                    <span className={cn("transition-colors", signalDepth === 1 ? "text-neon-green" : "text-white/40")}>
                        Surface
                    </span>
                    <span className={cn("transition-colors", signalDepth === 2 ? "text-neon-green" : "text-white/40")}>
                        Hybrid
                    </span>
                    <span className={cn("transition-colors", signalDepth === 3 ? "text-hot-pink" : "text-white/40")}>
                        Deep Void
                    </span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={signalDepth}
                    onChange={(e) => setSignalDepth(parseInt(e.target.value))}
                    className={cn(
                        "w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-green hover:accent-neon-blue transition-all",
                        signalDepth === 3 && "accent-hot-pink hover:accent-purple-500"
                    )}
                />
                <div className="mt-2 font-mono text-xs text-center uppercase tracking-[0.2em] h-4">
                    {signalDepth === 1 && <span className="text-neon-green">/// SIGNAL: GLOBAL_DATABASE // STRICT_PROVENANCE</span>}
                    {signalDepth === 2 && <span className="text-white">/// SIGNAL: BALANCED_MIX // STANDARD_PROTOCOL</span>}
                    {signalDepth === 3 && <span className="text-hot-pink animate-pulse">/// SIGNAL: HIVE_MIND // UNFILTERED_LORE</span>}
                </div>
            </div>

            {/* Slot System */}
            <div id="tutorial-target-slots" className="console-ui mt-12 flex flex-wrap justify-center gap-4 w-full max-w-3xl">
                {/* Render Filled Slots */}
                {interests.map((interest, idx) => (
                    <div
                        key={idx}
                        className="bg-neon-green text-black font-bold font-mono text-sm px-4 py-3 uppercase tracking-wider flex items-center gap-2 animate-in fade-in zoom-in duration-300 border-2 border-neon-green"
                    >
                        <span>{interest}</span>
                        <button
                            onClick={() => setInterests(interests.filter(i => i !== interest))}
                            className="hover:scale-125 transition-transform"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* Render Empty Slots (Visual Limit) */}
                {Array.from({ length: Math.max(0, 2 - interests.length) }).map((_, idx) => (
                    <div
                        key={`empty-${idx}`}
                        className="border-2 border-dashed border-white/20 w-32 h-12 flex items-center justify-center text-white/20 font-mono text-xs"
                    >
                        [EMPTY]
                    </div>
                ))}

                {/* Additional dashed slots if we have more than 2 items, to show expansion up to 5 */}
                {interests.length >= 2 && interests.length < 5 && (
                    <div className="border-2 border-dashed border-white/20 w-32 h-12 flex items-center justify-center text-white/20 font-mono text-xs opacity-50">
                        [OPEN]
                    </div>
                )}
            </div>

            {/* Suggestions Ticker */}
            <div className="console-ui mt-16 w-full max-w-4xl overflow-hidden relative">
                <div className="text-white/40 font-mono text-[10px] mb-2 uppercase tracking-widest">
                    /// SUGGESTED_VECTORS
                </div>
                <div className="flex flex-wrap justify-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300">
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => addInterest(s)}
                            className="text-xs border border-white/20 px-3 py-1 font-mono hover:bg-white hover:text-black hover:border-white transition-colors uppercase"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Initialize Button */}
            <div className="console-ui mt-12 h-16">
                {interests.length > 0 && (
                    <button
                        onClick={handleInitialize}
                        className="bg-white text-black font-display font-black text-xl px-12 py-4 uppercase tracking-tighter hover:bg-neon-green transition-colors duration-300 shadow-[8px_8px_0px_#000] border-2 border-transparent hover:border-black animate-in fade-in slide-in-from-bottom-4"
                    >
                        Calculate Correlations
                    </button>
                )}
            </div>

        </div>
    );
}
