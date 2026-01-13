"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP);
}

export default function Template({ children }: { children: React.ReactNode }) {
    const container = useRef<HTMLDivElement>(null);
    const wipe = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Entrance Animation
            // The wipe element (neon green) starts at full width covering content
            // Then scales X to 0 (origin right) to reveal the content
            const tl = gsap.timeline();

            tl.set(wipe.current, { scaleY: 1, transformOrigin: "bottom" })
                .to(wipe.current, {
                    scaleY: 0,
                    duration: 0.6,
                    ease: "power4.inOut",
                    transformOrigin: "top", // Wipe goes UP
                });
        },
        { scope: container }
    );

    return (
        <div ref={container} className="relative min-h-screen">
            {/* The Neon Curtain */}
            <div
                ref={wipe}
                className="fixed inset-0 z-[100] bg-neon-green pointer-events-none origin-bottom"
                style={{ transform: "scaleY(1)" }} // Start covering
            />
            {children}
        </div>
    );
}
