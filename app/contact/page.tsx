"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, MapPin, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen pt-52 pb-20 px-6 bg-white dark:bg-inherit transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Sol Taraf: Bilgiler */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-orange-500 font-bold mb-10 hover:underline uppercase text-sm tracking-widest">
            <ArrowLeft size={16} /> Geri Dön
          </Link>
          
          <h1 className="text-6xl font-black text-black dark:text-white uppercase tracking-tighter mb-8 leading-[0.9]">
            Bize <br /><span className="text-orange-500 italic">Ulaşın</span>
          </h1>
          
          <div className="space-y-10 mt-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-600/20">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">E-posta</p>
                {/* DÜZELTME: text-black dark:text-white */}
                <h3 className="text-xl font-bold text-black dark:text-white">
                  support@aitravel.tr
                </h3>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-neutral-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-orange-500">
                <MapPin size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Konum</p>
                {/* DÜZELTME: text-black dark:text-white */}
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Samsun, Türkiye
                </h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sağ Taraf: Form */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          {status === "success" ? (
            <div className="h-full flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900/50 p-16 rounded-[50px] border border-orange-500/30 text-center shadow-2xl">
              <CheckCircle2 size={80} className="text-orange-500 mb-6" />
              <h2 className="text-3xl font-black text-black dark:text-white uppercase italic">Mesajınız Alındı!</h2>
              <p className="text-neutral-500 mt-4 text-lg">En kısa sürede e-posta adresinize dönüş yapacağız.</p>
              <button onClick={() => setStatus("idle")} className="mt-8 text-orange-500 font-bold hover:underline italic uppercase tracking-widest text-sm">Yeni bir mesaj yaz</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/10 p-10 rounded-[50px] space-y-6 shadow-2xl shadow-black/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white ml-2">
                    Ad Soyad
                  </label>
                  <input name="name" required type="text" placeholder="İsminiz" className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold text-black dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white ml-2">
                    E-Posta
                  </label>
                  <input name="email" required type="email" placeholder="E-posta adresiniz" className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold text-black dark:text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white ml-2">
                  Mesajınız
                </label>
                <textarea name="message" required rows={5} placeholder="Size nasıl yardımcı olabiliriz?" className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-white/5 p-5 rounded-2xl outline-none focus:border-orange-500 transition-all font-bold text-black dark:text-white resize-none" />
              </div>
              <button 
                disabled={status === "loading"}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-neutral-400 text-white font-black py-6 rounded-2xl transition-all shadow-2xl shadow-orange-600/30 flex items-center justify-center gap-4 group text-lg tracking-tighter"
              >
                {status === "loading" ? "İLETİLİYOR..." : "MESAJI GÖNDER"} 
                <Send size={20} className={status === "loading" ? "animate-pulse" : "group-hover:rotate-12 transition-transform"} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}