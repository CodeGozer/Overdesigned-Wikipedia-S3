"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ImageViewerProps {
    isOpen: boolean;
    imageUrl: string | null;
    altText?: string;
    onClose: () => void;
}

export function ImageViewer({ isOpen, imageUrl, altText, onClose }: ImageViewerProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Lock body scroll when open
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!mounted || !isOpen || !imageUrl) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-neon-green transition-colors z-[110]"
                aria-label="Close Viewer"
            >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            {/* Image Container */}
            <div
                className="relative max-w-[95vw] max-h-[90vh] overflow-hidden rounded-lg shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
            >
                <img
                    src={imageUrl}
                    alt={altText || "Wiki Image"}
                    className="object-contain max-w-full max-h-[90vh] select-none"
                />
            </div>

            {/* Caption (if available) */}
            {altText && (
                <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                    <div className="inline-block px-4 py-2 bg-black/80 backdrop-blur text-white/90 text-sm font-mono rounded border border-white/10">
                        {altText}
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
}
