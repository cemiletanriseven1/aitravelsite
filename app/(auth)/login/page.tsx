"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ChevronRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // E-postanın başını kullanıcı adı yapalım
    const name = email.split('@')[0];
    localStorage.setItem("userName", name);
    
    // Ana sayfaya yönlendir
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20
  bg-background text-foreground transition-colors">


      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 p-8 rounded-[32px] shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-500 text-sm font-bold mb-4">
            <ArrowLeft size={16} /> Geri Dön
          </Link>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tighter uppercase">Giriş <span className="text-orange-500 italic">Yap</span></h1>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-2">E-Posta</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@mail.com"
                className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/5 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-black dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-2">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/5 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-black dark:text-white font-medium"
              />
            </div>
          </div>

          <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 group active:scale-[0.98]">
            GİRİŞ YAP
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center border-t border-neutral-200 dark:border-white/5 pt-6">
          <p className="text-neutral-500 dark:text-gray-400 text-sm font-medium">
            Hesabın yok mu? <Link href="/register" className="text-orange-500 font-black hover:underline">HEMEN KAYDOL</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}