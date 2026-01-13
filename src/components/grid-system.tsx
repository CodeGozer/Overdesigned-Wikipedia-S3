"use client";

export function GridSystem() {
    return (
        <div className="fixed inset-0 z-[0] pointer-events-none select-none">
            <div className="container relative h-full mx-auto max-w-screen-2xl border-x border-white/5">
                {/* Vertical Center Line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 -translate-x-1/2" />

                {/* Horizontal Lines */}
                <div className="absolute top-[10vh] left-0 right-0 h-px bg-white/5" />
                <div className="absolute bottom-[10vh] left-0 right-0 h-px bg-white/5" />
            </div>
        </div>
    );
}
