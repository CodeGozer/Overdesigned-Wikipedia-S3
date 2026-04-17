"use client";

import { useRouter } from "next/navigation";
import { CHAOS_SEEDS } from "@/config/random-seeds";

interface LuckyButtonProps {
    isLoading?: boolean;
}

export function LuckyButton({ isLoading = false }: LuckyButtonProps) {
    const router = useRouter();

    const handleLucky = async () => {
        // 1. Pick Chaos Vectors from Seed List (Reset Mode)
        const shuffle = (array: string[]) => array.sort(() => 0.5 - Math.random());
        const selectedSeeds = shuffle([...CHAOS_SEEDS]).slice(0, 2);

        // 2. Construct Payload
        const newVectors = selectedSeeds.map(term => ({ term }));

        // 3. Dispatch Event (Legacy Randomize = Replace All)
        const event = new CustomEvent('nicopedia:randomize', { detail: newVectors });
        window.dispatchEvent(event);

        // If not on home, go there
        if (window.location.pathname !== '/home') {
            router.push('/home');
        }
    };

    return (
        <button
            onClick={handleLucky}
            className="group relative px-6 py-4 bg-transparent border-2 border-hot-pink transition-all hover:bg-hot-pink hover:text-black text-hot-pink"
        >
            <span className="relative z-10 font-mono font-bold uppercase tracking-widest text-sm md:text-base flex items-center gap-2">
                <span>[ I'M_FEELING_LUCKY ]</span>
                <span className={isLoading ? "animate-bounce" : ""}>★</span>
            </span>
        </button>
    );
}
