"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, FileText, RefreshCw, MapPin } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// MapView bileşenini dynamic (lazy) yüklüyoruz. 
// Bu sayede harita çerezleri sadece sayfa yüklendiğinde ve sadece client-side'da devreye girer.
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-neutral-900 animate-pulse rounded-3xl flex items-center justify-center border border-white/5">
      <MapPin className="text-neutral-700 animate-bounce" size={48} />
    </div>
  ),
});

function ResultsContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  const hasFetched = useRef(false);

  // PDF indirme işlemi için print
  const downloadPDF = () => {
    window.print();
  };

  const handleSaveRoute = () => {
    const userName = localStorage.getItem("userName");
    if (!userName) {
      alert("Rotayı kaydetmek için önce giriş yapmalısın!");
      return;
    }
    if (!itinerary) return;

    const currentSaved = JSON.parse(localStorage.getItem("saved_routes") || "[]");
    const newSave = {
      id: Date.now(),
      title: `${searchParams.get("city")?.toUpperCase()} Gezi Planı`,
      description: `${searchParams.get("duration")} Günlük Kişiselleştirilmiş Rota`,
      date: new Date().toLocaleDateString("tr-TR"),
      type: "ai",
      targetUrl: `/results?${window.location.search.replace("?", "")}`,
    };

    localStorage.setItem("saved_routes", JSON.stringify([...currentSaved, newSave]));
    setIsSaved(true);
  };

  useEffect(() => {
    if (hasFetched.current) return;

    const city = searchParams.get("city");
    const districts = searchParams.get("districts");
    const interests = searchParams.get("interests");
    const duration = searchParams.get("duration");
    const startLocation = searchParams.get("startLocation");

    if (!city || !duration) {
      setError("Eksik bilgi! Lütfen arama formunu tam doldurun.");
      setLoading(false);
      return;
    }

    hasFetched.current = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Hava Durumu
        const weatherCity = startLocation || city;
        const weatherRes = await fetch(`/api/weather?city=${weatherCity}`);
        const weatherData = await weatherRes.json();
        if (!weatherData.error) setWeather(weatherData);

        // 2. Cache Kontrolü
        const cacheKey = `plan_${city}_${districts}_${duration}_${startLocation}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setItinerary(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // 3. POIs ve AI Rota Oluşturma
        const poisRes = await fetch(
          `/api/pois?city=${city}&districts=${districts}&interests=${interests}`
        );
        if (!poisRes.ok) throw new Error("Mekanlar alınamadı");
        const places = await poisRes.json();

        const aiRes = await fetch("/api/itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, places, duration, startLocation }),
        });

        const aiData = await aiRes.json();
        if (!aiRes.ok || aiData.error) throw new Error(aiData.error || "Rota oluşturulamadı");

        localStorage.setItem(cacheKey, JSON.stringify(aiData));
        setItinerary(aiData);
      } catch (err: any) {
        setError(err.message);
        hasFetched.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <RefreshCw className="animate-spin text-orange-500 mb-6" size={48} />
        <p className="text-xl font-black uppercase tracking-widest animate-pulse">
          Yapay Zeka Rotanı Çiziyor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl border border-red-500/40 bg-red-500/10 text-center">
          <h2 className="text-2xl font-black text-red-500 mb-4 uppercase">Hata Oluştu</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-gray-200 transition-all"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24 lg:pt-32 max-w-5xl mx-auto">
      {/* Hava Durumu Kartı */}
      {weather && (
        <div className="mb-10 p-6 rounded-3xl bg-neutral-900 border border-white/5 flex items-center gap-6">
          <div className="relative w-20 h-20 bg-orange-500/10 rounded-2xl flex items-center justify-center">
            <Image
              src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
              alt="Hava Durumu"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Başlangıç Noktası Durumu
            </p>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              {weather.city} · {weather.temp}°C
            </h2>
            <p className="text-gray-500 italic text-sm capitalize">{weather.description}</p>
          </div>
        </div>
      )}

      {/* Başlık ve Aksiyonlar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Senin <br /> <span className="text-orange-500 italic">Rotan.</span>
          </h1>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={downloadPDF}
            className="bg-white text-black font-black px-6 py-4 rounded-2xl uppercase text-xs flex items-center gap-2 hover:bg-orange-500 transition-colors"
          >
            <FileText size={18} /> PDF İNDİR
          </button>

          <button
            type="button"
            onClick={handleSaveRoute}
            aria-label={isSaved ? "Rotayı Favorilerden Çıkar" : "Rotayı Favorilere Ekle"}
            className={`px-6 py-4 rounded-2xl font-black uppercase text-xs flex items-center gap-2 transition-all ${
              isSaved
                ? "bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                : "bg-neutral-900 text-white border border-white/10 hover:border-orange-500"
            }`}
          >
            <Heart size={18} fill={isSaved ? "black" : "none"} />
            {isSaved ? "KAYDEDİLDİ" : "ROTAYI KAYDET"}
          </button>
        </div>
      </div>

      {/* Harita Bölümü - Veri varsa yüklenir */}
      <div className="mb-16">
         <MapView 
            places={itinerary?.itinerary || []} 
            route={itinerary?.itinerary || []} 
         />
      </div>

      {/* Zaman Çizelgesi */}
      <div id="pdf-content" className="relative space-y-12 before:absolute before:left-4 md:before:left-8 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-orange-500 before:to-transparent">
        {itinerary?.itinerary?.map((item: any, i: number) => (
          <div key={i} className="relative pl-12 md:pl-20">
            <div className="absolute left-[10px] md:left-[26px] top-0 w-[12px] h-[12px] rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)] border-2 border-black" />
            
            <div className="group bg-neutral-900/50 p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <span className="text-orange-500 font-black text-2xl md:text-3xl tracking-tighter">
                  {item.suggestedTime}
                </span>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  🚀 {item.transportation}
                </div>
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-orange-500 transition-colors">
                {item.name}
              </h3>
              
              <p className="text-gray-400 italic leading-relaxed text-sm md:text-base">
                "{item.aiNote}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Notu */}
      {itinerary?.travelTip && (
        <div className="mt-20 p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
          <h4 className="text-orange-500 font-black uppercase text-xs tracking-[0.3em] mb-4">
            Seyahat Asistanı Tavsiyesi
          </h4>
          <p className="text-lg text-orange-100/90 italic leading-relaxed font-medium">
            {itinerary.travelTip}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ResultsContent />
    </Suspense>
  );
}