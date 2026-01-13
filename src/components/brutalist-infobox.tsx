"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./model-viewer'), { ssr: false });

interface InfoboxRowProps {
    label: string;
    value: string;
}

function InfoboxRow({ label, value }: InfoboxRowProps) {
    return (
        <div className="flex justify-between border-b border-gray-800 py-1 text-xs font-mono last:border-0 border-opacity-50">
            <span className="text-gray-500 uppercase">{label}</span>
            <span className="text-neon-green font-bold text-right">{value}</span>
        </div>
    );
}



interface BrutalistInfoboxProps {
    title?: string;
    image?: string;
    stats?: { label: string; value: string }[];
}

export function BrutalistInfobox({ title = "Object: Cube", image, stats }: BrutalistInfoboxProps) {
    return (
        <div
            className="relative w-full bg-deep-void/50 border-4 border-hot-pink shadow-hard backdrop-blur-sm"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
        >
            {/* 1:1 Placeholder for 3D Model or Image */}
            <div className="aspect-square w-full bg-gray-900/50 flex items-center justify-center border-b-4 border-hot-pink relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black opacity-50" />

                {image ? (
                    <img src={image} alt={title} className="relative z-10 w-full h-full object-cover" />
                ) : (
                    <ModelViewer />
                )}
            </div>

            {/* Data Rows */}
            <div className="p-4 space-y-2">
                <h3 className="font-display text-xl text-white mb-4 uppercase tracking-tighter">
                    {title}
                </h3>
                {stats ? (
                    stats.map((stat, i) => (
                        <InfoboxRow key={i} label={stat.label} value={stat.value} />
                    ))
                ) : (
                    <>
                        <InfoboxRow label="Type" value="Geometric" />
                        <InfoboxRow label="Vertices" value="8" />
                        <InfoboxRow label="Faces" value="6" />
                        <InfoboxRow label="Edges" value="12" />
                        <InfoboxRow label="Status" value="Verified" />
                    </>
                )}
            </div>

            {/* Decorative Corner Label */}
            <div className="absolute top-0 right-0 bg-hot-pink text-black text-[10px] font-bold px-2 py-0.5 font-mono">
                REF: A-{Math.floor(Math.random() * 1000)}
            </div>
        </div>
    );
}
