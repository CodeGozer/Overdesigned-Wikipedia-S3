"use client";

import { useEffect, useState } from "react";

export function DigitalClock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour12: false }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col">
            <div className="text-xs font-mono text-neon-green uppercase tracking-widest mb-0 opacity-50">
          /// LOCAL_SYSTEM_TIME ///
            </div>
            <div className="font-mono text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-off-white">
                {time || "00:00:00"}
            </div>
        </div>
    );
}
