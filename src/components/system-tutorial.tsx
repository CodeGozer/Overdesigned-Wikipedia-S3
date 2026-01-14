"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

interface SystemTutorialProps {
    onClose: () => void;
}

interface TargetPoint {
    id: string;
    label: string;
    description: string;
    x: number;
    y: number;
    width: number;
    height: number;
    side: 'left' | 'right' | 'top' | 'bottom';
}

export function SystemTutorial({ onClose }: SystemTutorialProps) {
    const [targets, setTargets] = useState<TargetPoint[]>([]);

    useEffect(() => {
        const updateTargets = () => {
            const foundTargets: TargetPoint[] = [];

            // 1. Input Field
            const inputEl = document.getElementById('tutorial-target-input');
            if (inputEl) {
                const rect = inputEl.getBoundingClientRect();
                foundTargets.push({
                    id: 'tutorial-target-input',
                    label: '/// INJECT SEARCH VECTORS HERE',
                    description: 'Type keywords to initiate search protocol.',
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    side: 'top'
                });
            }

            // 2. Slider
            const sliderEl = document.getElementById('tutorial-target-slider');
            if (sliderEl) {
                const rect = sliderEl.getBoundingClientRect();
                foundTargets.push({
                    id: 'tutorial-target-slider',
                    label: '/// CALIBRATE SIGNAL DEPTH',
                    description: 'Adjust frequency: Mainstream vs. Deep Lore.',
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    side: 'right'
                });
            }

            // 3. Slots
            const slotsEl = document.getElementById('tutorial-target-slots');
            if (slotsEl) {
                const rect = slotsEl.getBoundingClientRect();
                foundTargets.push({
                    id: 'tutorial-target-slots',
                    label: '/// MULTI-THREADING ACTIVE',
                    description: 'Populate up to 5 parallel search slots.',
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    side: 'bottom'
                });
            }

            // 4. Correlation Mode
            const modeEl = document.getElementById('tutorial-target-mode');
            if (modeEl) {
                const rect = modeEl.getBoundingClientRect();
                foundTargets.push({
                    id: 'tutorial-target-mode',
                    label: '/// SELECT PROCESSING MODE',
                    description: 'SEPARATE OR BLENDED STREAMS',
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    side: 'right'
                });
            }

            // 5. Suggestions
            const suggestionsEl = document.getElementById('tutorial-target-suggestions');
            if (suggestionsEl) {
                const rect = suggestionsEl.getBoundingClientRect();
                foundTargets.push({
                    id: 'tutorial-target-suggestions',
                    label: '/// SUGGESTED PRESETS',
                    description: 'RAPID INHERITANCE VECTORS',
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    side: 'bottom'
                });
            }

            setTargets(foundTargets);
        };

        // Initial check + delayed check for layout settle
        updateTargets();
        setTimeout(updateTargets, 500);

        window.addEventListener('resize', updateTargets);
        return () => window.removeEventListener('resize', updateTargets);
    }, []);

    // Entrance animation
    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(".tutorial-overlay",
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        )
            .fromTo(".tutorial-line",
                { drawSVG: "0%" },
                { drawSVG: "100%", duration: 1, stagger: 0.2, ease: "power2.out" } // Note: DrawSVG requires plugin, we'll use stroke-dasharray
            )
            .fromTo(".tutorial-label",
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 },
                "-=0.5"
            );

    }, []);

    return (
        <div className="fixed inset-0 z-[100] font-mono select-none tutorial-overlay">
            {/* Dimming Layer */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Canvas / SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {targets.map((t, idx) => {
                    // Logic to draw lines based on 'side'
                    let startX = 0, startY = 0, endX = 0, endY = 0;
                    let labelX = 0, labelY = 0;

                    // Simple offsets for now
                    if (t.side === 'top') {
                        startX = t.x + t.width / 2;
                        startY = t.y;
                        endX = startX;
                        endY = startY - 80; // Label position
                    } else if (t.side === 'bottom') {
                        startX = t.x + t.width / 2;
                        startY = t.y + t.height;
                        endX = startX;
                        endY = startY + 80;
                    } else if (t.side === 'right') {
                        startX = t.x + t.width;
                        startY = t.y + t.height / 2;
                        endX = startX + 100;
                        endY = startY;
                    }

                    return (
                        <g key={t.id} className="tutorial-line-group">
                            {/* Connector Line */}
                            <path
                                d={`M${startX},${startY} L${endX},${endY}`}
                                stroke="#00FF00"
                                strokeWidth="1"
                                fill="none"
                                className="tutorial-line opacity-50"
                                strokeDasharray="5,5"
                            />
                            {/* Dot at Target */}
                            <circle cx={startX} cy={startY} r="4" fill="#00FF00" className="animate-pulse" />
                            {/* Dot at Label */}
                            <circle cx={endX} cy={endY} r="2" fill="#00FF00" />
                        </g>
                    );
                })}
            </svg>

            {/* Labels Layer */}
            {targets.map((t) => {
                let style: React.CSSProperties = {};
                if (t.side === 'top') {
                    style = { left: t.x + t.width / 2, top: t.y - 120, transform: 'translateX(-50%)' };
                } else if (t.side === 'bottom') {
                    style = { left: t.x + t.width / 2, top: t.y + t.height + 40, transform: 'translateX(-50%)' };
                } else if (t.side === 'right') {
                    style = { left: t.x + t.width + 110, top: t.y + t.height / 2, transform: 'translateY(-50%)' };
                }

                return (
                    <div
                        key={t.id}
                        className="absolute tutorial-label text-neon-green"
                        style={style}
                    >
                        <div className="text-xs font-bold tracking-widest uppercase mb-1 whitespace-nowrap">
                            {t.label}
                        </div>
                        <div className="text-[10px] text-white/60 tracking-wider">
                            {t.description}
                        </div>
                    </div>
                );
            })}


            {/* Dismiss Button */}
            <div className="absolute bottom-12 w-full flex justify-center pointer-events-auto">
                <button
                    onClick={onClose}
                    className="group relative px-8 py-4 bg-transparent border border-neon-green/30 hover:border-neon-green hover:bg-neon-green/10 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-neon-green/0 group-hover:bg-neon-green/5 blur-xl transition-all" />
                    <span className="font-mono text-neon-green font-bold tracking-[0.2em] relative z-10">
                        ACKNOWLEDGE PROTOCOL [ENTER]
                    </span>
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-green" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-green" />
                </button>
            </div>

            {/* Keyboard listener for Enter */}
            <EventListener listener={(e: KeyboardEvent) => {
                if (e.key === 'Enter') onClose();
            }} />
        </div>
    );
}

// Helper for event listener
function EventListener({ listener }: { listener: (e: KeyboardEvent) => void }) {
    useEffect(() => {
        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    }, [listener]);
    return null;
}
