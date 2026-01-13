"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScanlineOverlay } from "@/components/scanline-overlay";
import { clsx } from "clsx";

export default function SplashPage() {
    const router = useRouter();
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [percent, setPercent] = useState(0);

    useGSAP(
        () => {
            if (loading) {
                // 1. Loader Timeline
                const tl = gsap.timeline({
                    onComplete: () => setLoading(false),
                });

                tl.to(
                    {},
                    {
                        duration: 2.5,
                        onUpdate: function () {
                            setPercent(Math.floor(this.progress() * 100));
                        },
                        ease: "expo.inOut",
                    }
                );
            } else {
                // 2. Reveal Content (Runs after loading state changes)
                const tl = gsap.timeline();

                tl.to(".splash-content", {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1,
                    ease: "power4.out",
                    stagger: 0.1,
                });

                // Floating shapes animation (simple loop)
                gsap.to(".floater", {
                    y: "20px",
                    rotation: 10,
                    duration: 4,
                    yoyo: true,
                    repeat: -1,
                    ease: "sine.inOut",
                    stagger: {
                        amount: 2,
                        from: "random"
                    }
                });
            }
        },
        { scope: containerRef, dependencies: [loading] }
    );

    const handleEnter = () => {
        const tl = gsap.timeline({
            onComplete: () => router.push("/home"),
        });

        // Exit Animation: Zoom into the void
        tl.to(".splash-container", {
            scale: 1.5,
            opacity: 0,
            duration: 1,
            filter: "blur(20px)",
            ease: "power2.in",
        });

        // Quick wipe overlay just in case
        tl.to("body", { backgroundColor: "#000", duration: 0.1 }, "<");
    };

    return (
        <div
            ref={containerRef}
            className="splash-container relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-deep-void text-off-white"
        >
            <ScanlineOverlay />

            {/* Ambient Floating Shapes (Low Opacity) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="floater absolute top-[20%] left-[15%] w-32 h-32 border border-white/5 rotate-45" />
                <div className="floater absolute bottom-[30%] right-[10%] w-64 h-64 border border-white/5 rounded-full" />
                <div className="floater absolute top-[10%] right-[30%] text-[10rem] font-black text-white/5 leading-none select-none">?</div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex flex-col items-center justify-center p-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-[15vw] font-mono font-bold leading-none tracking-tighter text-neon-green/90 animate-pulse">
                            {percent}%
                        </div>
                        <div className="mt-4 font-mono text-sm uppercase tracking-widest text-gray-500">
                /// SYSTEM_INIT_SEQUENCE ///
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="splash-content invisible translate-y-10 text-center font-display text-6xl font-black uppercase tracking-tighter sm:text-8xl md:text-9xl group cursor-default">
                            <span className="block group-hover:animate-pulse group-hover:text-neon-green transition-colors duration-300">NICO</span>
                            <span className="block text-stroke-thin text-transparent group-hover:text-white transition-colors duration-300">PEDIA</span>
                        </h1>

                        <div className="splash-content invisible translate-y-10 mt-6 font-mono text-sm tracking-[0.5em] text-gray-400">
                            EST. 2026 // PERSONAL ARCHIVE
                        </div>

                        <button
                            onClick={handleEnter}
                            className="splash-content invisible translate-y-10 mt-16 group relative overflow-hidden bg-neon-green px-12 py-6 text-black transition-transform hover:scale-105 active:scale-95"
                        >
                            <div className="relative z-10 font-mono text-lg font-bold tracking-widest uppercase">
                                Initiate Sequence
                            </div>
                            <div className="absolute inset-0 z-0 bg-white opacity-0 transition-opacity group-hover:opacity-20" />
                        </button>
                    </>
                )}
            </div>

            {/* Bottom Ticker */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-black py-2">
                <div className="whitespace-nowrap font-mono text-xs text-hot-pink animate-marquee">
             /// WARNING: HIGH VISUAL LOAD DETECTED /// AUTHORIZED PERSONNEL ONLY /// SECURE CONNECTION ESTABLISHED /// SCROLL TO EXPLORE ///
                /// WARNING: HIGH VISUAL LOAD DETECTED /// AUTHORIZED PERSONNEL ONLY /// SECURE CONNECTION ESTABLISHED /// SCROLL TO EXPLORE /// 
                </div>
            </div>
        </div>
    );
}
