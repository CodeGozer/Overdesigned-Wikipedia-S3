import React from 'react';

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

export function BrutalistInfobox() {
    return (
        <div
            className="relative w-full bg-deep-void/50 border-4 border-hot-pink shadow-hard backdrop-blur-sm"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
        >
            {/* 1:1 Placeholder for 3D Model */}
            <div className="aspect-square w-full bg-gray-900/50 flex items-center justify-center border-b-4 border-hot-pink relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-950 to-black opacity-50" />
                <div className="relative z-10 text-center p-4">
                    <div className="text-6xl mb-2 animate-bounce">🧊</div>
                    <div className="text-xs font-mono text-neon-green opacity-0 group-hover:opacity-100 transition-opacity">
                /// DRAG TO ROTATE ///
                    </div>
                </div>
            </div>

            {/* Data Rows */}
            <div className="p-4 space-y-2">
                <h3 className="font-display text-xl text-white mb-4 uppercase tracking-tighter">
                    Object: Cube
                </h3>
                <InfoboxRow label="Type" value="Geometric" />
                <InfoboxRow label="Vertices" value="8" />
                <InfoboxRow label="Faces" value="6" />
                <InfoboxRow label="Edges" value="12" />
                <InfoboxRow label="Status" value="Verified" />
            </div>

            {/* Decorative Corner Label */}
            <div className="absolute top-0 right-0 bg-hot-pink text-black text-[10px] font-bold px-2 py-0.5 font-mono">
                REF: A-001
            </div>
        </div>
    );
}
