"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      const savedUser = localStorage.getItem("userName");
      setUserName(savedUser);
    };
    checkUser();
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, [pathname]);

  const navLinks = [
    { name: "Anasayfa", href: "/" },
    { name: "Popüler Rotalar", href: "/popular-routes" },
    { name: "Hakkımızda", href: "/about" },
    { name: "İletişim", href: "/contact" },
  ];

  // EKLEME: Giriş yapılmışsa linklere Kaydedilenler'i ekle
  const activeNavLinks = userName 
    ? [...navLinks, { name: "Kaydedilenler", href: "/saved-routes" }] 
    : navLinks;

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setUserName(null);
    window.location.href = "/";
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-neutral-200 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl md:text-2xl font-black text-black dark:text-white hover:text-orange-500 transition-colors">
            <span className="text-orange-500">AI</span> TRAVEL
          </Link>

          {/* Masaüstü Navigasyon - activeNavLinks kullanıldı */}
          <nav className="hidden md:flex items-center gap-6">
            {activeNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors ${
                  (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                    ? "text-orange-500"
                    : "text-neutral-600 dark:text-gray-300 hover:text-orange-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Sağ Alan */}
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            
            <div className="flex items-center gap-2">
              {userName ? (
                <div className="flex items-center gap-2">
                  <button onClick={handleLogout} className="hidden sm:block text-[10px] font-bold text-neutral-400 hover:text-red-500 uppercase">Çıkış</button>
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-sm md:text-lg border-2 border-white/10">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <Link href="/login" className="bg-orange-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[12px] md:text-sm font-black hover:bg-orange-700 transition-all shadow-lg active:scale-95">
                  Giriş
                </Link>
              )}
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-1.5 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={activeNavLinks} // activeNavLinks gönderildi
        userName={userName}
        onLogout={handleLogout}
        pathname={pathname}
      />
    </>
  );
}