"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SearchContextType {
    isOpen: boolean;
    toggleSearch: () => void;
    openSearch: () => void;
    closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSearch = () => setIsOpen((prev) => !prev);
    const openSearch = () => setIsOpen(true);
    const closeSearch = () => setIsOpen(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                toggleSearch();
            }
            if (e.key === "Escape") {
                closeSearch();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <SearchContext.Provider value={{ isOpen, toggleSearch, openSearch, closeSearch }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error("useSearch must be used within a SearchProvider");
    }
    return context;
}
