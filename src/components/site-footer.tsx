import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer
            className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 py-8 overflow-hidden"
            data-animate="footer-slide-up"
        >
            <div className="reveal-container transition-all duration-700 delay-100 ease-out">
                <div className="container mx-auto max-w-screen-2xl px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
                    <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                        <p className="text-center text-sm leading-loose text-gray-500 dark:text-gray-400 md:text-left">
                            Built for 2026 Nicopedia.
                            The source code is available on <span className="font-medium underline underline-offset-4">GitHub</span>.
                        </p>
                    </div>
                    <div className="flex gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                        <Link href="#" className="hover:underline hover:text-indigo-600">About</Link>
                        <Link href="#" className="hover:underline hover:text-indigo-600">Contact</Link>
                        <Link href="#" className="hover:underline hover:text-indigo-600">Source Credits</Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-xs text-gray-400">
                    &copy; 2026 Nicopedia Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
