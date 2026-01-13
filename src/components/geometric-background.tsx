"use client";

import React from "react";

export function GeometricBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Solid Triangle 1 (Green) */}
            <div className="absolute top-[15%] left-[10%] text-neon-green animate-float-slow opacity-10">
                <svg width="60" height="60" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 0L50 50H0L25 0Z" />
                </svg>
            </div>

            {/* Solid Rectangle 1 (Yellow, Rotated) */}
            <div className="absolute top-[20%] right-[25%] text-electric-yellow animate-float-medium opacity-10 rotate-[30deg]">
                <svg width="80" height="40" viewBox="0 0 80 40" fill="currentColor">
                    <rect width="80" height="40" />
                </svg>
            </div>

            {/* Solid Triangle 2 (Pink, Inverted/Rotated) */}
            <div className="absolute bottom-[30%] left-[25%] text-hot-pink animate-spin-slow opacity-10">
                <svg width="70" height="70" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 50L0 0H50L25 50Z" />
                </svg>
            </div>

            {/* Solid Rectangle 2 (Green, Rotated) */}
            <div className="absolute bottom-[15%] right-[15%] text-neon-green animate-float-fast opacity-10 rotate-[-45deg]">
                <svg width="60" height="30" viewBox="0 0 60 30" fill="currentColor">
                    <rect width="60" height="30" />
                </svg>
            </div>

            {/* Solid Triangle 3 (Yellow) */}
            <div className="absolute top-[50%] left-[40%] text-electric-yellow animate-float-slow opacity-5">
                <svg width="40" height="40" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 0L50 50H0L25 0Z" />
                </svg>
            </div>

            {/* Solid Rectangle 3 (Pink) */}
            <div className="absolute top-[10%] right-[5%] text-hot-pink animate-spin-reverse-slow opacity-10">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="currentColor">
                    <rect x="0" y="0" width="50" height="50" />
                </svg>
            </div>

            {/* Grid Dots (Subtle Texture) */}
            <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]" />
        </div>
    );
}
