"use client";

import { useEffect, useState } from "react";

export function DigitalClock() {
    const [elapsed, setElapsed] = useState("00:00:00");

    useEffect(() => {
        // 1. Get or Set Start Time
        let startTime = sessionStorage.getItem("rabbit_hole_start");
        if (!startTime) {
            startTime = Date.now().toString();
            sessionStorage.setItem("rabbit_hole_start", startTime);
        }

        const start = parseInt(startTime, 10);

        const updateTimer = () => {
            const now = Date.now();
            const diff = now - start;

            // Format HH:MM:SS
            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)));

            const pad = (n: number) => n.toString().padStart(2, '0');
            setElapsed(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col">
            <div className="text-xs font-mono text-neon-green uppercase tracking-widest mb-0 opacity-50">
          /// TIME_DILATION_TRACKER ///
            </div>
            <div className="font-mono text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-off-white tabular-nums">
                {elapsed}
            </div>
        </div>
    );
}
