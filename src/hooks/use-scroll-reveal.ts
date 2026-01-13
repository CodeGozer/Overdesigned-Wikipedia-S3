"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export function useScrollReveal(scope: React.RefObject<HTMLElement | null>) {
    useGSAP(
        () => {
            // Find all elements marked with data-scroll-section
            const sections = gsap.utils.toArray<HTMLElement>("[data-scroll-section]");

            sections.forEach((section) => {
                gsap.fromTo(
                    section,
                    {
                        autoAlpha: 0,
                        y: 50,
                    },
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%", // Start when top of element hits 80% viewport height
                            toggleActions: "play none none reverse", // Re-play on enter, reverse on leave back up
                        },
                    }
                );
            });

            // Footer specific animation
            const footer = document.querySelector("[data-animate='footer-slide-up']");
            if (footer) {
                gsap.fromTo(footer,
                    { yPercent: 100, autoAlpha: 0 },
                    {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.8,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: footer,
                            start: "top 95%",
                        }
                    }
                )
            }
        },
        { scope: scope }
    );
}
