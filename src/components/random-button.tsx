"use client";

import { useRouter } from "next/navigation";
import { CHAOS_SEEDS } from "@/config/random-seeds";

interface RandomButtonProps {
    isLoading?: boolean;
}

export function RandomButton({ isLoading = false }: RandomButtonProps) {
    const router = useRouter();

    const handleChaos = async () => {
        // Dispatch Inject Event (Expands current search instead of random seed)
        const event = new CustomEvent('nicopedia:inject-chaos');
        window.dispatchEvent(event);

        // If not on home, go there
        if (window.location.pathname !== '/home') {
            router.push('/home');
        }
    };

    return (
        <button
            onClick={handleChaos}
            className="group relative px-6 py-4 bg-transparent border-2 border-neon-green transition-all hover:bg-neon-green"
        >
            <span className="relative z-10 font-mono font-bold text-neon-green group-hover:text-black uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
                <span>[ INJECT_CHAOS ]</span>
                <span className={isLoading ? "animate-spin" : ""}>+</span>
            </span>
        </button>
    );
}
