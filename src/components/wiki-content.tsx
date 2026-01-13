"use client";

import React, { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface WikiContentProps {
    html: string;
}

export default function WikiContent({ html }: WikiContentProps) {
    const [sanitizedHtml, setSanitizedHtml] = useState("");

    useEffect(() => {
        // Configure DOMPurify to keep structure but strip scripts/iframes
        const clean = DOMPurify.sanitize(html, {
            USE_PROFILES: { html: true },
            FORBID_TAGS: ['script', 'iframe', 'style', 'link', 'meta', 'object'],
            FORBID_ATTR: ['style', 'onmouseover', 'onclick']
        });
        setSanitizedHtml(clean);
    }, [html]);

    if (!sanitizedHtml) {
        return <div className="animate-pulse h-96 bg-white/5 rounded-lg w-full" />;
    }

    return (
        <div
            className="nicopedia-content"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}
