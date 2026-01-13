"use client";

import { useRouter } from "next/navigation";
import { getRandomArticle } from "@/services/wiki";

export function RandomButton() {
    const router = useRouter();

    const handleRandom = async () => {
        // Fetch random article
        const random = await getRandomArticle();
        if (random?.title) {
            // Encode title for URL usage (spaces to underscores usually handled by Wiki, but ensuring clean URL)
            const slug = encodeURIComponent(random.title.replace(/ /g, "_"));
            router.push(`/wiki/${slug}`);
        }
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
