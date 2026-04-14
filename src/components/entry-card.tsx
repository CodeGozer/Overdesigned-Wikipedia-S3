"use client";

import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";
import { useState } from "react";
import { GeometricCardPlaceholder } from "./geometric-card-placeholder";
import { HoloGallery } from "./holo-gallery";

interface EntryCardProps {
    title: string;
    category: string;
    date: string;
    href: string;
    color?: "neon-green" | "hot-pink" | "cyber-gold" | string;
    imageUrl?: string;
    size?: "HERO" | "TALL" | "WIDE" | "STANDARD";
    className?: string;
    index?: number;
    gallery?: string[];
    isSynthesis?: boolean;
    synthesisTerms?: string[];
}

export function EntryCard({
    title,
    category,
    date,
    href,
    color = "neon-green",
    className,
    index,
    imageUrl,
    size = "STANDARD",
    gallery = [],
    isSynthesis = false,
    synthesisTerms = []
}: EntryCardProps) {
    const [imageError, setImageError] = useState(false);
    const [galleryOpen, setGalleryOpen] = useState(false);

    let borderColor = "border-neon-green";
    let shadowColor = "shadow-neon-green";
    let hoverBg = "group-hover:bg-neon-green";
    let glowColor = "#39ff14";
    let textColor = "group-hover:text-neon-green";

    if (color === "hot-pink") {
        borderColor = "border-hot-pink";
        shadowColor = "shadow-hot-pink";
        hoverBg = "group-hover:bg-hot-pink";
        glowColor = "#ff00ff";
        textColor = "group-hover:text-hot-pink";
    } else if (color === "cyber-gold" || isSynthesis) {
        borderColor = "border-yellow-400";
        shadowColor = "shadow-yellow-400";
        hoverBg = "group-hover:bg-yellow-400";
        glowColor = "#facc15";
        textColor = "group-hover:text-yellow-400";
    }

    // Size Classes
    const sizeClasses = {
        HERO: "md:col-span-2 md:row-span-2",
        TALL: "md:col-span-1 md:row-span-2",
        WIDE: "md:col-span-2 md:row-span-1",
        STANDARD: "md:col-span-1 md:row-span-1",
    };

    // Prepare gallery images
    // If gallery is provided, check if imageUrl matches any, if not prepend it? 
    // Usually gallery contains higher res.
    // Let's assume gallery is the list. If empty, use imageUrl as single item if available.
    const effectiveGallery = gallery.length > 0
        ? (imageUrl && !gallery.includes(imageUrl) ? [imageUrl, ...gallery] : gallery)
        : (imageUrl ? [imageUrl] : []);

    const hasMultipleImages = effectiveGallery.length > 1;

    // Handle Image Click
    const handleImageClick = (e: React.MouseEvent) => {
        // Prevent Link navigation only if we have a gallery to show
        if (effectiveGallery.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            setGalleryOpen(true);
        }
    };

    return (
        <>
            <Link
                href={href}
                className={clsx(
                    "group block relative overflow-hidden bg-deep-void/10 backdrop-blur-sm border-2 transition-colors duration-300 will-change-transform",
                    borderColor,
                    sizeClasses[size],
                    className
                )}
                style={{
                    boxShadow: `4px 4px 0px ${glowColor}`
                }}
                data-animate="entry-card"
                data-index={index}
            >
                {/* Background Image (Lazy Loaded + Hardware Accelerated) */}
                {(imageUrl && !imageError) ? (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        {/* Multi-Image Badge */}
                        {hasMultipleImages && (
                            <div className="absolute top-2 right-2 z-20 px-2 py-1 bg-black/80 backdrop-blur text-[10px] font-mono font-bold text-white border border-white/20 pointer-events-none uppercase tracking-widest group-hover:bg-neon-green/20 group-hover:border-neon-green transition-colors">
                                [ ❐ +{effectiveGallery.length - 1} ]
                            </div>
                        )}
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            unoptimized
                            onError={() => setImageError(true)}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover opacity-80 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105 will-change-transform"
                        />
                        {/* Explicit Touch Target for Gallery */}
                        <div
                            className="absolute inset-0 z-30 cursor-zoom-in"
                            onClick={handleImageClick}
                            style={{ bottom: "35%" }} // Leave bottom 35% for text/link
                            aria-label="Open Gallery"
                        />
                    </div>
                ) : (
                    <GeometricCardPlaceholder variant={((index || 0) % 3 === 0 ? 'a' : (index || 0) % 3 === 1 ? 'b' : 'c') as any} />
                )}

                {/* Solid Fill Animation (Overlay) */}
                <div className={clsx(
                    "absolute inset-0 opacity-0 transition-opacity duration-200 mix-blend-overlay pointer-events-none",
                    hoverBg,
                    "group-hover:opacity-40"
                )} />

                {/* Gradient Scrim for Text Legibility */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {isSynthesis && (
                    <div className="absolute inset-0 z-15 pointer-events-none mix-blend-overlay opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#facc15_2px,#facc15_4px)] group-hover:animate-pulse"></div>
                )}

                {/* Content */}
                <div className="relative z-20 p-6 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        {/* Category Badge */}
                        <span className={clsx(
                            "font-mono text-[10px] uppercase tracking-widest px-2 py-1 border backdrop-blur-sm",
                            isSynthesis ? "bg-yellow-400/20 text-yellow-400 border-yellow-400 animate-pulse font-bold" : "bg-black/50 text-white border-white/20"
                        )}>
                            {isSynthesis && synthesisTerms && synthesisTerms.length > 0 
                                ? `[ ${synthesisTerms.join(' × ')} ]` 
                                : `[${category}]`
                            }
                        </span>

                        {/* Date / ID */}
                        <span className="font-mono text-[10px] text-gray-400">
                            {date}
                        </span>
                    </div>

                    <div>
                        <h3 className={clsx(
                            "font-display font-bold uppercase tracking-tight text-white transition-colors leading-none",
                            textColor,
                            size === "HERO" ? "text-4xl md:text-5xl" : "text-xl md:text-2xl",
                            isSynthesis && "italic"
                        )}>
                            {title}
                        </h3>
                        {/* Optimized Divider Animation (Scale instead of Width) */}
                        <div className="h-0.5 w-full bg-white/20 mt-2 origin-left relative overflow-hidden">
                             <div className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" style={{ backgroundColor: glowColor }} />
                        </div>
                    </div>
                </div>
            </Link>

            <HoloGallery
                isOpen={galleryOpen}
                images={effectiveGallery}
                onClose={() => setGalleryOpen(false)}
                color={color as any}
            />
        </>
    );
}
