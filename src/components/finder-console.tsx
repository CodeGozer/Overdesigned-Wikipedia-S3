import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { InterestVector } from '@/services/interest_engine';
import { searchWiki, searchFandomCommunities, FederatedResult } from '@/services/wiki';
import { Search, Globe, Flame, Lock } from 'lucide-react';

interface FinderConsoleProps {
    onSearch: (interests: InterestVector[], depth: number, mode: 'PARALLEL' | 'SYNTHESIS') => void;
    onTutorial?: () => void;
}

const SUGGESTIONS = [
    "Mycology", "Brutalism", "Speedrunning", "Vocaloid", "Liminal Spaces",
    "Cybernetics", "Glitch Art", "Keyboards", "Typography", "Synthwave"
];

export function FinderConsole({ onSearch, onTutorial }: FinderConsoleProps) {
    const [inputValue, setInputValue] = useState("");
    const [interests, setInterests] = useState<InterestVector[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [signalDepth, setSignalDepth] = useState(2); // 1=Surface, 2=Hybrid, 3=Deep
    const [correlationMode, setCorrelationMode] = useState<'PARALLEL' | 'SYNTHESIS'>('PARALLEL');
    const [suggestions, setSuggestions] = useState<FederatedResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Federated Autocomplete Logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (inputValue.length < 3) {
                setSuggestions([]);
                setShowDropdown(false);
                return;
            }

            try {
                // Fetch both Wikipedia and Fandom results in parallel
                const [wikiResults, fandomResults] = await Promise.all([
                    searchWiki(inputValue),
                    searchFandomCommunities(inputValue)
                ]);

                // Merge: Interleave or concat? Concat seems fine with distinct types.
                // Let's cap total suggestions to 8
                const merged = [...wikiResults.slice(0, 4), ...fandomResults.slice(0, 4)];
                setSuggestions(merged);
                setShowDropdown(true);

            } catch (error) {
                console.error("Autocomplete failed", error);
            }
        };

        const debounce = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounce);
    }, [inputValue]);


    // Add Interest Logic
    const addInterest = (item: string | FederatedResult) => {
        if (interests.length >= 5) return;

        let newInterest: InterestVector;

        if (typeof item === 'string') {
            // Simple string (from Suggestions Ticker or plain enter)
            if (!item.trim()) return;
            if (interests.some(i => i.term.toLowerCase() === item.trim().toLowerCase())) {
                setInputValue("");
                return;
            }
            newInterest = { term: item.trim() };
        } else {
            // Federated Result (from Autocomplete)
            if (interests.some(i => i.term.toLowerCase() === item.title.toLowerCase())) {
                setInputValue("");
                setShowDropdown(false);
                return;
            }
            newInterest = {
                term: item.title,
                lockedSource: item.type === 'FANDOM' ? item.url : undefined
            };
        }

        setInterests(prev => [...prev, newInterest]);
        setInputValue("");
        setShowDropdown(false);
        setSuggestions([]);

        // Focus back on input
        inputRef.current?.focus();
    };


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            setShowDropdown(false);
            addInterest(inputValue);
        }
    };

    const handleInitialize = () => {
        setIsAnalyzing(true);

        // Animation sequence before searching
        const tl = gsap.timeline({
            onComplete: () => onSearch(interests, signalDepth, correlationMode)
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
        <div ref={containerRef} className="relative z-40 flex flex-col items-center justify-center w-full min-h-[60vh] text-center p-4">

            {/* Guide Button (Top Right) */}
            <div className="absolute top-0 right-0 p-4 console-ui">
                <button
                    onClick={onTutorial}
                    className="group flex items-center gap-2 text-xs font-mono text-neon-green/50 hover:text-neon-green transition-colors uppercase tracking-widest"
                >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                        /// INITIALIZE_GUIDE
                    </span>
                    <span className="border border-neon-green/30 px-2 py-1 group-hover:bg-neon-green/10">
                        [?]
                    </span>
                </button>
            </div>

            {/* Header / Label */}
            <div className="console-ui font-mono text-xs text-neon-green/80 tracking-[0.3em] uppercase mb-8 animate-pulse">
                /// Hyperfixation_Console_v1.0 ///
            </div>

            {/* Glowing Input Field + Dropdown */}
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

                {/* Autocomplete Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-black border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                        {suggestions.map((result, idx) => (
                            <button
                                key={idx}
                                onClick={() => addInterest(result)}
                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 text-left border-b border-white/5 last:border-0 group/item transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "p-1 rounded text-black font-bold text-[10px] w-6 h-6 flex items-center justify-center",
                                        result.type === 'WIKIPEDIA' ? "bg-neon-green" : "bg-hot-pink"
                                    )}>
                                        {result.type === 'WIKIPEDIA' ? <Globe size={14} /> : <Flame size={14} />}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="font-mono font-bold text-white text-sm uppercase group-hover/item:text-neon-green transition-colors">
                                            {result.title}
                                        </span>
                                        {result.desc && (
                                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">
                                                {result.desc}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {result.type === 'FANDOM' && (
                                    <span className="text-hot-pink text-[10px] font-mono border border-hot-pink/30 px-2 py-0.5 opacity-50">
                                        LORE_SOURCE
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}


                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green -translate-x-1 -translate-y-1" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green translate-x-1 -translate-y-1" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green -translate-x-1 translate-y-1" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green translate-x-1 translate-y-1" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full max-w-4xl mt-12">

                {/* Signal Depth Slider */}
                <div id="tutorial-target-slider" className="console-ui w-full max-w-md">
                    <div className="text-[10px] font-mono uppercase tracking-widest mb-4 text-left text-gray-500">
                        /// SIGNAL_DEPTH
                    </div>

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
                    <div className="mt-2 font-mono text-xs text-left uppercase tracking-[0.2em] h-4">
                        {signalDepth === 1 && <span className="text-neon-green">/// GLOBAL_DATABASE</span>}
                        {signalDepth === 2 && <span className="text-white">/// BALANCED_MIX</span>}
                        {signalDepth === 3 && <span className="text-hot-pink animate-pulse">/// UNFILTERED_LORE</span>}
                    </div>
                </div>

                {/* Correlation Mode Switch */}
                <div id="tutorial-target-mode" className="console-ui w-full max-w-xs">
                    <div className="text-[10px] font-mono uppercase tracking-widest mb-4 text-left text-gray-500">
                        /// PROCESSING_MODE
                    </div>
                    <div className="flex bg-white/5 rounded p-1 border border-white/10">
                        <button
                            onClick={() => setCorrelationMode('PARALLEL')}
                            className={cn(
                                "flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2",
                                correlationMode === 'PARALLEL' ? "bg-neon-green text-black shadow-[2px_2px_0px_#000]" : "text-white/40 hover:text-white hover:bg-white/10"
                            )}
                            title="Analyze vectors independently"
                        >
                            <span>|| PARALLEL</span>
                        </button>
                        <button
                            onClick={() => setCorrelationMode('SYNTHESIS')}
                            className={cn(
                                "flex-1 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2",
                                correlationMode === 'SYNTHESIS' ? "bg-hot-pink text-black shadow-[2px_2px_0px_#000]" : "text-white/40 hover:text-white hover:bg-white/10"
                            )}
                            title="Find the intersection of all vectors"
                        >
                            <span>∩ SYNTHESIS</span>
                        </button>
                    </div>
                    <div className="mt-2 text-left font-mono text-[10px] text-gray-400">
                        {correlationMode === 'PARALLEL' ? "> RUNNING INDEPENDENT STREAMS" : "> CROSS-VECTOR INTERSECTION"}
                    </div>
                </div>
            </div>

            {/* Slot System */}
            <div id="tutorial-target-slots" className="console-ui mt-12 flex flex-wrap justify-center gap-4 w-full max-w-3xl">
                {/* Render Filled Slots */}
                {interests.map((interest, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "text-black font-bold font-mono text-sm px-4 py-3 uppercase tracking-wider flex items-center gap-2 animate-in fade-in zoom-in duration-300 border-2",
                            interest.lockedSource ? "bg-hot-pink border-hot-pink" : "bg-neon-green border-neon-green"
                        )}
                    >
                        {interest.lockedSource && <Lock size={12} className="text-black/70" />}
                        <span>{interest.term}</span>
                        <button
                            onClick={() => setInterests(interests.filter(i => i.term !== interest.term))}
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
            <div id="tutorial-target-suggestions" className="console-ui mt-16 w-full max-w-4xl overflow-hidden relative">
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
