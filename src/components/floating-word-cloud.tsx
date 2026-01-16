"use client";

import React, { useEffect, useRef, useState } from 'react';

const WORDS = [
    "SYSTEM", "NETWORK", "VOID", "SIGNAL", "DATA",
    "CIPHER", "INDEX", "CACHE", "PROXY", "NODE",
    "KERNEL", "BUFFER", "VECTOR", "MATRIX", "PROTOCOL",
    "UPLINK", "DAEMON", "SHELL", "ROOT", "ACCESS"
];

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    word: string;
    element: HTMLDivElement | null;
}

export function FloatingWordCloud() {
    const containerRef = useRef<HTMLDivElement>(null);
    const elementsRef = useRef<(HTMLDivElement | null)[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    useEffect(() => {
        // Initialize particles logic state
        particlesRef.current = WORDS.map(word => ({
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            vx: (Math.random() - 0.5) * 0.05, // Velocity
            vy: (Math.random() - 0.5) * 0.05,
            word,
            element: null // Not used anymore, we use elementsRef
        }));

        let animationFrameId: number;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const update = () => {
            const container = containerRef.current;
            if (container) {
                const rect = container.getBoundingClientRect();
                const width = rect.width;
                const height = rect.height;

                particlesRef.current.forEach((p, i) => {
                    const el = elementsRef.current[i];
                    if (!el) return;

                    // Convert % position to pixels for interaction calc
                    let numberX = (p.x / 100) * width;
                    let numberY = (p.y / 100) * height;

                    // Mouse Repulsion
                    const dx = numberX - (mouseRef.current.x - rect.left);
                    const dy = numberY - (mouseRef.current.y - rect.top);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const repulsionRadius = 250; // Increased radius

                    if (dist < repulsionRadius) {
                        const force = (repulsionRadius - dist) / repulsionRadius;
                        const angle = Math.atan2(dy, dx);
                        p.vx += Math.cos(angle) * force * 0.5; // Increased force
                        p.vy += Math.sin(angle) * force * 0.5;
                    }

                    // Drift
                    p.x += p.vx;
                    p.y += p.vy;

                    // Friction (damping)
                    p.vx *= 0.96;
                    p.vy *= 0.96;

                    // Restoring force / Chaos
                    if (Math.abs(p.vx) < 0.01) p.vx += (Math.random() - 0.5) * 0.02;
                    if (Math.abs(p.vy) < 0.01) p.vy += (Math.random() - 0.5) * 0.02;

                    // Boundary wrap
                    if (p.x < -10) p.x = 110;
                    if (p.x > 110) p.x = -10;
                    if (p.y < -10) p.y = 110;
                    if (p.y > 110) p.y = -10;

                    // Apply style transform
                    el.style.transform = `translate3d(${p.x}vw, ${p.y}vh, 0)`;
                });
            }

            animationFrameId = requestAnimationFrame(update);
        };

        window.addEventListener('mousemove', handleMouseMove);
        animationFrameId = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
            {WORDS.map((word, i) => (
                <div
                    key={i}
                    ref={(el) => { elementsRef.current[i] = el; }}
                    className="absolute top-0 left-0 text-white/10 font-mono text-sm md:text-xl font-bold whitespace-nowrap will-change-transform"
                    style={{
                        transform: `translate3d(-100vw, -100vh, 0)` // Start hidden/offscreen to prevent flash/mismatch
                    }}
                >
                    {word}
                </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-deep-void/80" />
        </div>
    );
}
