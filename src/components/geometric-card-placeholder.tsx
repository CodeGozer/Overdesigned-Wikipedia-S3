"use client";

import React from "react";
import { clsx } from "clsx";

interface GeometricCardPlaceholderProps {
    className?: string;
    variant?: "a" | "b" | "c";
}

export function GeometricCardPlaceholder({ className, variant = "a" }: GeometricCardPlaceholderProps) {
    return (
        <div className={clsx("absolute inset-0 bg-deep-void overflow-hidden pointer-events-none", className)}>
            {/* Base Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]" />

            {/* Shapes based on variant */}
            {variant === "a" && (
                <>
                    <div className="absolute top-[-10%] right-[-10%] text-neon-green/10">
                        <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
                            <circle cx="50" cy="50" r="50" />
                        </svg>
                    </div>
                    <div className="absolute bottom-[10%] left-[10%] text-hot-pink/10 rotate-12">
                        <svg width="80" height="80" viewBox="0 0 50 50" fill="currentColor">
                            <rect width="50" height="50" />
                        </svg>
                    </div>
                </>
            )}

            {variant === "b" && (
                <>
                    <div className="absolute top-[20%] left-[-20%] text-electric-yellow/10 rotate-45">
                        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
                            <rect width="100" height="100" />
                        </svg>
                    </div>
                    <div className="absolute bottom-[-10%] right-[10%] text-neon-green/10">
                        <svg width="90" height="90" viewBox="0 0 100 86" fill="currentColor">
                            <path d="M50 0L100 86H0L50 0Z" />
                        </svg>
                    </div>
                </>
            )}

            {variant === "c" && (
                <>
                    <div className="absolute top-[10%] right-[10%] text-hot-pink/10 animate-pulse">
                        <svg width="60" height="60" viewBox="0 0 50 50" fill="currentColor">
                            <circle cx="25" cy="25" r="25" />
                        </svg>
                    </div>
                    <div className="absolute bottom-[0%] left-[0%] w-full h-1/2 bg-gradient-to-t from-neon-green/5 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <span className="font-mono text-4xl font-black tracking-tighter text-white">404</span>
                    </div>
                </>
            )}

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>
    );
}
