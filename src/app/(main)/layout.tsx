"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GeometricBackground } from "@/components/geometric-background";
import { GridSystem } from "@/components/grid-system";
import { SearchOverlay } from "@/components/search-overlay";
import { SearchProvider } from "@/components/search-context";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SearchProvider>
            <div className="flex min-h-screen flex-col">
                <GeometricBackground />
                <GridSystem />
                <SiteHeader />
                <SearchOverlay />
                <main className="flex-1">
                    {children}
                </main>
                <SiteFooter />
            </div>
        </SearchProvider>
    );
}
