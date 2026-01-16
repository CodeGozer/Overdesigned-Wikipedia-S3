"use client";

import { useState, useEffect, useRef } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

interface UseScrambleProps {
    text: string;
    speed?: number;
    startOnMount?: boolean;
}

export function useScramble({ text, speed = 40, startOnMount = true }: UseScrambleProps) {
    const [displayText, setDisplayText] = useState(text);
    const [isScrambling, setIsScrambling] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const scramble = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsScrambling(true);

        let iteration = 0;
        const maxIterations = text.length * 3; // How many cycles before full resolve

        intervalRef.current = setInterval(() => {
            setDisplayText(prev => {
                return text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration / 3) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("");
            });

            if (iteration >= maxIterations) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setDisplayText(text);
                setIsScrambling(false);
            }

            iteration += 1;
        }, speed);
    };

    const stop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
    };

    useEffect(() => {
        if (startOnMount) {
            scramble();
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return { displayText, scramble, stop, isScrambling };
}
