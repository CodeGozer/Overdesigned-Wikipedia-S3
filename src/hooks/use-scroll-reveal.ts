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
                // Unmasking Effect: Clip from bottom
                // Note: Element needs to be visible (autoAlpha: 1) but clipped initially
                gsap.fromTo(
                    section,
                    {
                        autoAlpha: 1, // Visible but clipped
                        clipPath: "inset(100% 0 0 0)", // Fully clipped from bottom
                        y: 20, // Slight movement
                    },
                    {
                        clipPath: "inset(0% 0 0 0)", // Fully revealed
                        y: 0,
                        duration: 1.0,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
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
