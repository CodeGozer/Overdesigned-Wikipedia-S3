"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function BentoGrid({
    children,
    disableAnimation = false
}: {
    children: React.ReactNode;
    disableAnimation?: boolean;
}) {
    const containerRef = useRef(null);

    useGSAP(() => {
        if (disableAnimation) return;

        const cards = gsap.utils.toArray<HTMLElement>("[data-animate='entry-card']");

        gsap.fromTo(cards,
            {
                y: 100,
                opacity: 0,
                rotationX: 45
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, { scope: containerRef, dependencies: [disableAnimation] });

    return (
        <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-[200px] [content-visibility:auto] [contain-intrinsic-size:200px]"
        >
            {children}
        </div>
    );
}
