"use client";

import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface HoloGalleryProps {
    isOpen: boolean;
    images: string[];
    initialIndex?: number;
    onClose: () => void;
    color?: "neon-green" | "hot-pink" | "neon-blue" | "goldenrod";
}

export function HoloGallery({ isOpen, images, initialIndex = 0, onClose, color = "neon-green" }: HoloGalleryProps) {
    const [mounted, setMounted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const themeColors = {
        "neon-green": "text-neon-green border-neon-green shadow-neon-green/50",
        "hot-pink": "text-hot-pink border-hot-pink shadow-hot-pink/50",
        "neon-blue": "text-neon-blue border-neon-blue shadow-neon-blue/50",
        "goldenrod": "text-yellow-500 border-yellow-500 shadow-yellow-500/50",
    };

    const activeTheme = themeColors[color] || themeColors["neon-green"];
    const activeBorder = activeTheme.split(" ")[1]; // border-color

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) setCurrentIndex(initialIndex);
    }, [isOpen, initialIndex]);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    // Keyboard support
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, handleNext, handlePrev]);

    if (!mounted || !isOpen || images.length === 0) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
            role="dialog"
            aria-modal="true"
        >
            {/* Header / Close */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-[210]">
                <div className={`font-mono text-xs ${activeTheme.split(' ')[0]} tracking-widest opacity-70`}>
                    /// VISUAL_DATA_ANALYSIS_MODE
                </div>
                <button
                    onClick={onClose}
                    className={`group px-4 py-2 bg-transparent border ${activeBorder} ${activeTheme.split(' ')[0]} hover:bg-white/10 transition-colors uppercase font-mono font-bold tracking-widest text-sm`}
                >
                    [ TERMINATE ]
                </button>
            </div>

            {/* Main Content Area (Layout wrapper) */}
            <div className="relative flex items-center justify-between w-full max-w-7xl px-4 h-[70vh]">

                {/* Prev Arrow */}
                <button
                    onClick={handlePrev}
                    className={`hidden md:flex p-4 ${activeTheme.split(' ')[0]} opacity-50 hover:opacity-100 transition-opacity hover:scale-110 active:scale-95`}
                    aria-label="Previous Image"
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>

                {/* Image Container */}
                <div className="relative flex-1 h-full mx-4 flex items-center justify-center group select-none">
                    {/* Glow Element */}
                    <div className={`absolute inset-4 opacity-20 blur-2xl ${activeTheme.split(' ')[2].replace('shadow-', 'bg-')}`} />

                    <img
                        key={currentIndex} // Force re-render for animation
                        src={images[currentIndex]}
                        alt={`Gallery Image ${currentIndex + 1}`}
                        className={`relative max-w-full max-h-full object-contain border-2 ${activeBorder} shadow-[0_0_20px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300`}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>

                {/* Next Arrow */}
                <button
                    onClick={handleNext}
                    className={`hidden md:flex p-4 ${activeTheme.split(' ')[0]} opacity-50 hover:opacity-100 transition-opacity hover:scale-110 active:scale-95`}
                    aria-label="Next Image"
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </button>
            </div>

            {/* Footer / Filmstrip */}
            <div className="absolute bottom-0 left-0 right-0 h-[20vh] bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center justify-end pb-8 gap-4">

                {/* Counter */}
                <div className={`font-mono text-sm ${activeTheme.split(' ')[0]} tracking-[0.2em]`}>
                    IMG [ {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')} ]
                </div>

                {/* Filmstrip */}
                <div className="flex gap-2 overflow-x-auto max-w-full px-4 py-2 scrollbar-none items-center h-20">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                            className={`relative h-12 w-20 flex-shrink-0 border transition-all duration-300 overflow-hidden group/thumb
                                ${idx === currentIndex ? `${activeBorder} scale-110 opacity-100` : 'border-white/20 opacity-40 hover:opacity-80 hover:scale-105'}
                            `}
                        >
                            <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                            {/* Active Indicator */}
                            {idx === currentIndex && (
                                <div className={`absolute inset-0 bg-white/10 mixed-blend-overlay`} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

        </div>,
        document.body
    );
}
