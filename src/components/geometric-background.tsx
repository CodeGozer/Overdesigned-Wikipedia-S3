"use client";

import React from "react";

export function GeometricBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Plus Signs */}
            <div className="absolute top-[10%] left-[5%] text-neon-green animate-float-slow opacity-20">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M15 0H25V15H40V25H25V40H15V25H0V15H15V0Z" />
                </svg>
            </div>
            <div className="absolute bottom-[20%] right-[10%] text-hot-pink animate-float-medium opacity-20">
                <svg width="60" height="60" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M15 0H25V15H40V25H25V40H15V25H0V15H15V0Z" />
                </svg>
            </div>

            {/* Triangles */}
            <div className="absolute top-[30%] right-[30%] text-electric-yellow animate-spin-slow opacity-10">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M25 0L50 50H0L25 0Z" />
                </svg>
            </div>
            <div className="absolute bottom-[40%] left-[20%] text-neon-green animate-spin-reverse-slow opacity-10">
                <svg width="30" height="30" viewBox="0 0 50 50" fill="currentColor">
                    <path d="M25 0L50 50H0L25 0Z" />
                </svg>
            </div>

            {/* Squiggles */}
            <div className="absolute top-[50%] left-[50%] text-hot-pink animate-float-fast opacity-15">
                <svg width="100" height="20" viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4">
                    <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" />
                </svg>
            </div>

            {/* Grid Dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]" />
        </div>
    );
}
