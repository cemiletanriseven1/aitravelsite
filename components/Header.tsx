"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Anasayfa', href: '/' },
        { name: 'Popüler Rotalar', href: '/popular-routes' },
        { name: 'Hakkımızda', href: '/about' },
    ];

    const isLinkActive = (href: string) => {
        const cleanHref = href.split('#')[0];
        const cleanPathname = pathname.split('#')[0];
        if (cleanHref === '/') return cleanPathname === '/';
        return cleanPathname === cleanHref;
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm border-b border-neutral-200 dark:border-white/10 transition-colors">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-black text-black dark:text-white hover:text-orange-500 transition-colors">
                    <span className="text-orange-500">AI</span> TRAVEL
                </Link>

                {/* Navigasyon */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${isLinkActive(link.href)
                                ? 'text-orange-500'
                                : 'text-neutral-600 dark:text-gray-300 hover:text-orange-400'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Butonlar Grubu */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="#" passHref>
                        <button className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-700 transition-colors shadow-md">
                            Giriş Yap
                        </button>
                    </Link>
                </div>

            </div>
        </header>
    );
}