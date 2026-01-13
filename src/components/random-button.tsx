"use client";

import { useRouter } from "next/navigation";

export function RandomButton() {
    const router = useRouter();

    const handleRandom = () => {
        // In a real app, fetch random from API. For now, hardcode EF-2000.
        router.push("/wiki/ef-2000");
    };

    return (
        <button
            onClick={handleRandom}
            className="group relative px-8 py-4 bg-transparent border-2 border-neon-green overflow-hidden transition-all hover:bg-neon-green"
        >
            {/* Glitch Overlay */}
            <div className="absolute inset-0 bg-neon-green opacity-0 group-hover:opacity-100 mix-blend-difference animate-pulse" />

            <span className="relative z-10 font-mono font-bold text-neon-green group-hover:text-black uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
                <span>[ RANDOM_JUMP ]</span>
                <span className="group-hover:animate-spin">↻</span>
            </span>
        </button>
    );
}
