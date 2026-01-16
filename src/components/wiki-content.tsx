"use client";

import React, { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';

import { ImageViewer } from './image-viewer';

interface WikiContentProps {
    html: string;
}

export default function WikiContent({ html }: WikiContentProps) {
    const [sanitizedHtml, setSanitizedHtml] = useState("");
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [currentAlt, setCurrentAlt] = useState("");

    useEffect(() => {
        // Configure DOMPurify to keep structure but strip scripts/iframes
        const clean = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
            FORBID_TAGS: ['script', 'iframe', 'style', 'link', 'meta', 'object'],
            FORBID_ATTR: ['style', 'onmouseover', 'onclick']
        });
        setSanitizedHtml(clean);
    }, [html]);

    // Handle Clicks Delegation
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;

        // Check if we clicked an image or a link wrapping an image
        const img = target.tagName === 'IMG' ? target as HTMLImageElement : target.querySelector('img');
        const link = target.closest('a');

        // If clicking an image inside a "File:" link (common in Wiki), intercept it
        if (img && link && link.getAttribute('href')?.includes('File:')) {
            e.preventDefault();
            // Try to find higher res? For now use the source.
            // Wiki thumbs often have /thumb/ in path and a size suffix.
            // e.g. .../thumb/a/a1/Name.jpg/220px-Name.jpg
            // We can try to strip the thumb part for high res.
            let src = img.src;

            // Simple Heuristic for High Res
            // Convert: .../commons/thumb/a/a1/Foo.jpg/220px-Foo.jpg  ->  .../commons/a/a1/Foo.jpg
            if (src.includes('/thumb/')) {
                const part = src.split('/thumb/')[1]; // a/a1/Foo.jpg/220px-Foo.jpg
                if (part) {
                    const parts = part.split('/'); // [a, a1, Foo.jpg, 220px-Foo.jpg]
                    if (parts.length >= 3) {
                        // Reconstruct base path logic
                        // Actually simple way: remove the last segment and the /thumb/ part?
                        // It's triky because the segment before last is the file name.
                        // Let's just strip the last segment if it starts with number+px
                        const lastSegment = parts[parts.length - 1];
                        if (/\d+px-/.test(lastSegment)) {
                            // Use the original filename which is usually the segment before the last one
                            // Wait, structure is: /thumb/A/AB/Filename.ext/Size-Filename.ext
                            // So we want /A/AB/Filename.ext
                            // But wait, the URL structure before /thumb/ is host... 
                            // Easier: src.replace('/thumb/', '/').replace(/\/\d+px-.*$/, '')
                            // Let's try to be safe.
                            const highRes = src.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');
                            src = highRes;
                        }
                    }
                }
            }

            setCurrentImage(src);
            setCurrentAlt(img.alt || "");
            setViewerOpen(true);
        }
    };

    if (!sanitizedHtml) {
        return <div className="animate-pulse h-96 bg-white/5 rounded-lg w-full" />;
    }

    return (
        <>
            <div
                className="nicopedia-content"
                dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                onClick={handleClick}
            />

            <ImageViewer
                isOpen={viewerOpen}
                imageUrl={currentImage}
                altText={currentAlt}
                onClose={() => setViewerOpen(false)}
            />
        </>
    );
}
