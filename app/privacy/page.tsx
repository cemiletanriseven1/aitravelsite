"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export default function PrivacyPage() {
  return (
<div className="min-h-screen pt-32 pb-20 px-6 bg-white dark:bg-inherit transition-colors">



      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-white/10 p-8 md:p-12 rounded-[40px]"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tighter mb-8">
            Gizlilik <span className="text-orange-500 italic">Politikası</span>
          </h1>

          <div className="space-y-8 text-neutral-600 dark:text-neutral-400 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 mb-4 uppercase">
                <ShieldCheck className="text-orange-500" /> Veri Güvenliği
              </h2>
              <p className=" dark:text-white">
                AI Travel olarak, kullanıcılarımızın gizliliğine en üst düzeyde önem veriyoruz. 
                Oluşturduğunuz rotalar ve paylaştığınız tercihler, size daha iyi bir deneyim 
                sunmak amacıyla Groq AI altyapısı ile güvenli bir şekilde işlenmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 mb-4 uppercase">
                <Lock className="text-orange-500" /> Çerez Kullanımı
              </h2>
              <p className="dark:text-white">
                Deneyiminizi kişiselleştirmek ve hızlandırmak için tarayıcı tabanlı yerel depolama 
                (localStorage) kullanıyoruz. Bu veriler reklam amaçlı üçüncü şahıslarla paylaşılmaz.
              </p>
            </section>

            <section className="bg-orange-500/5 border-l-4 border-orange-500 p-6 rounded-r-2xl italic dark:text-white">
              "Sizin rotanız, sizin mahremiyetinizdir. AI Travel Assistant, kişisel verilerinizi satmaz veya izinsiz paylaşmaz."
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}