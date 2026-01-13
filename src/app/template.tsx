"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP);
}

export default function Template({ children }: { children: React.ReactNode }) {
    const container = useRef<HTMLDivElement>(null);
    const panels = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // "Backslash" Wipe Animation
            // 3 skewed panels occupy the screen initially.
            // They slide out to the left/top staggered.

            const tl = gsap.timeline();
            const q = gsap.utils.selector(panels);

            // Initial state: Panels cover the screen
            // We want them to slide AWAY to reveal content.
            // Direction: Slide UP-LEFT or DOWN-RIGHT? Let's go Slide UP (ScaleY -> 0) but skewed?
            // Actually, for a "Swipe", translation is better than scale.

            // Setup: Panels are fixed, full width/height, skewed.
            // Animation: Translate X/Y out of view.

            tl.to(q(".wipe-panel"), {
                xPercent: -120, // Move off screen to left (skew requires extra distance)
                duration: 0.8,
                stagger: 0.1, // Stagger effect
                ease: "power3.inOut",
            });
        },
        { scope: container }
    );

    return (
        <div ref={container} className="relative min-h-screen">
            <div ref={panels} className="fixed inset-0 z-[100] pointer-events-none flex flex-col sm:flex-row">
                {/* 
                   We use multiple panels for the multi-color effect.
                   To do a "Side Swipe like a \", we can skew the container or the panels.
                   Let's use a skewed parent container logic or just CSS skew.
                 */}

                {/* Color 1: Hot Pink */}
                <div className="wipe-panel fixed inset-0 z-30 bg-hot-pink skew-x-[-12deg] origin-bottom left-[-10%] w-[120%]" />

                {/* Color 2: Neon Green */}
                <div className="wipe-panel fixed inset-0 z-20 bg-neon-green skew-x-[-12deg] origin-bottom left-[-10%] w-[120%]" />

                {/* Color 3: Deep Void / Black */}
                <div className="wipe-panel fixed inset-0 z-10 bg-black skew-x-[-12deg] origin-bottom left-[-10%] w-[120%]" />
            </div>
            {children}
        </div>
    );
}
