"use client";

import { useRouter } from "next/navigation";
import { CHAOS_SEEDS } from "@/config/random-seeds";

export function RandomButton() {
    const router = useRouter();

    const handleChaos = async () => {
        // 1. Pick ONE Chaos Vector
        const seed = CHAOS_SEEDS[Math.floor(Math.random() * CHAOS_SEEDS.length)];

        // 2. Dispatch Inject Event (Appends to current)
        const event = new CustomEvent('nicopedia:inject-chaos', { detail: { term: seed } });
        window.dispatchEvent(event);

        // If not on home, go there
        if (window.location.pathname !== '/home') {
            router.push('/home');
        }
    };

    return (
        <button
            onClick={handleChaos}
            className="group relative px-6 py-4 bg-transparent border-2 border-neon-green overflow-hidden transition-all hover:bg-neon-green"
        >
            {/* Glitch Overlay */}
            <div className="absolute inset-0 bg-neon-green opacity-0 group-hover:opacity-100 mix-blend-difference animate-pulse" />

            <span className="relative z-10 font-mono font-bold text-neon-green group-hover:text-black uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
                <span>[ INJECT_CHAOS ]</span>
                <span className="group-hover:animate-spin">+</span>
            </span>
        </button>
    );
}
