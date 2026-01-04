"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, LogOut } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  userName: string | null;
  onLogout: () => void;
  pathname: string;
}

export default function MobileMenu({ isOpen, onClose, navLinks, userName, onLogout, pathname }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
          />

          {/* Menü Paneli */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[75%] max-w-xs bg-white dark:bg-black z-[70] shadow-2xl flex flex-col md:hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-neutral-100 dark:border-white/5">
              <span className="text-lg font-black text-orange-500 uppercase italic tracking-tighter">AI Travel</span>
              <button 
                onClick={onClose}
                className="p-2 bg-neutral-100 dark:bg-white/5 rounded-full text-black dark:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigasyon Linkleri (Küçültülmüş Font) */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`flex justify-between items-center p-3.5 rounded-xl text-xl font-bold transition-all ${
                      isActive 
                        ? "bg-orange-500 text-white" 
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                    <ChevronRight size={18} className={isActive ? "opacity-100" : "opacity-0"} />
                  </Link>
                );
              })}
            </nav>

            {/* Alt Alan (Senkronize Giriş Bilgisi) */}
            <div className="p-5 bg-neutral-50 dark:bg-neutral-900/50 border-t border-neutral-100 dark:border-white/5">
              {userName ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-lg border-2 border-white/10">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Giriş Yapıldı</p>
                      <p className="text-base font-black text-black dark:text-white uppercase leading-none truncate max-w-[120px]">{userName}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => { onLogout(); onClose(); }}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all"
                  >
                    <LogOut size={16} /> OTURUMU KAPAT
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="block w-full py-3.5 bg-orange-600 text-white text-center rounded-xl font-black text-base shadow-lg shadow-orange-600/20"
                >
                  GİRİŞ YAP
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}