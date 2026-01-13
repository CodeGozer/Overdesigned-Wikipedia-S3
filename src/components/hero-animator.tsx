"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export function HeroAnimator({ children }: { children: React.ReactNode }) {
    const container = useRef(null);

    useGSAP(() => {
        gsap.from("[data-animate='hero']", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1
        });
    }, { scope: container });

    return <div ref={container}>{children}</div>;
}
