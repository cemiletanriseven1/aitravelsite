"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Trash2, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SavedRoutesPage() {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("saved_routes") || "[]");
    setRoutes(saved);
  }, []);

  const handleDelete = (id: number) => {
    const updated = routes.filter((r: any) => r.id !== id);
    setRoutes(updated);
    localStorage.setItem("saved_routes", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background text-foreground transition-colors ">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-black uppercase italic mb-12 tracking-tighter text-black dark:text-white">
          KAYDEDİLEN <span className="text-orange-500">ROTALAR</span>
        </h1>

        {routes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-neutral-200 dark:border-white/10 rounded-[50px]">
            <p className="text-neutral-400 font-bold uppercase tracking-widest">Henüz bir rota kaydetmediniz.</p>
            <Link href="/popular-routes" className="inline-block mt-6 text-orange-500 font-black uppercase text-sm hover:underline">
              Hemen bir rota keşfet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {routes.map((route: any) => (
              <motion.div 
                key={route.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-white/5 p-8 rounded-[40px] group hover:border-orange-500/50 transition-all shadow-sm flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                    <MapPin size={24} />
                  </div>
                  <button 
                    onClick={() => handleDelete(route.id)} 
                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors bg-white dark:bg-black rounded-full shadow-sm"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-2xl font-black uppercase italic text-black dark:text-white mb-2 leading-tight">{route.title}</h3>
                
                <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-black uppercase mb-4 tracking-widest">
                  <Calendar size={14} className="text-orange-500" />
                  {route.date}
                </div>

                <div className="mb-6 flex-grow">
                   <span className={`text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-tighter ${route.type === 'popular' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {route.type === 'popular' ? '🔥 Popüler Liste' : '🤖 AI Rota'}
                  </span>
                </div>

                {/* ✅ DÜZELTME: Metin her zaman BEYAZ (text-white) ve arka plan her zaman KOYU (bg-neutral-900) */}
                <Link
                  href={route.targetUrl || "/popular-routes"}
                  className="w-full py-4 bg-neutral-900 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white flex items-center justify-center gap-2 transition-all group/btn shadow-lg"
                >
                  DETAYLARI AÇ <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}