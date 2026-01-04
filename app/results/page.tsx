"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Heart } from "lucide-react";

function ResultsContent() {
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [itinerary, setItinerary] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  const hasFetched = useRef(false);

  const downloadPDF = () => {
    window.print();
  };

  // ✅ KAYDETME FONKSİYONU
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
      date: new Date().toLocaleDateString('tr-TR'),
      type: "ai", // Kaynak tipi AI
      targetUrl: `/results?${window.location.search.replace('?', '')}` // Gideceği tam link
    };

    localStorage.setItem("saved_routes", JSON.stringify([...currentSaved, newSave]));
    setIsSaved(true);
    alert("AI Rotası başarıyla kaydedildi!");
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

        const weatherCity = startLocation || city;
        const weatherRes = await fetch(`/api/weather?city=${weatherCity}`);
        const weatherData = await weatherRes.json();
        if (!weatherData.error) setWeather(weatherData);

        const cacheKey = `plan_${city}_${districts}_${duration}_${startLocation}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setItinerary(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const poisRes = await fetch(
          `/api/pois?city=${city}&districts=${districts}&interests=${interests}`
        );
        if (!poisRes.ok) throw new Error("Mekanlar alınamadı");
        const places = await poisRes.json();

        const aiRes = await fetch("/api/itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city,
            places,
            duration,
            startLocation,
          }),
        });

        const aiData = await aiRes.json();
        if (!aiRes.ok || aiData.error) {
          throw new Error(aiData.error || "Rota oluşturulamadı");
        }

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
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mb-6" />
        <p className="text-xl font-black uppercase tracking-tighter text-center px-4">
          Yapay Zeka Rotanı Çiziyor...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="p-8 rounded-3xl border border-red-500/40 bg-red-500/10 text-center">
          <h2 className="text-3xl font-black text-red-500 mb-4 uppercase">Bir Sorun Oluştu</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-white text-black px-6 py-3 rounded-xl font-black">
            TEKRAR DENE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-32 max-w-4xl mx-auto">
      {weather && (
        <div className="mb-8 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex gap-6">
          <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="hava" className="w-16 h-16" />
          <div>
            <p className="text-orange-500 text-xs font-black uppercase">Başlangıç Noktası Hava Durumu</p>
            <p className="text-2xl font-black">{weather.city} · {weather.temp}°C</p>
            <p className="text-gray-400 italic capitalize">{weather.description}</p>
          </div>
        </div>
      )}

      <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">
        Senin <span className="text-orange-500 italic">Rotan</span>
      </h1>

      <div className="flex flex-wrap gap-4 mb-12">
        <button onClick={downloadPDF} className="bg-orange-500 text-black font-black px-6 py-3 rounded-xl uppercase flex items-center gap-2 transition-transform active:scale-95">
          📄 PDF Olarak İndir
        </button>

        <button 
          onClick={handleSaveRoute}
          className={`px-6 py-3 rounded-xl font-black uppercase flex items-center gap-2 transition-all active:scale-95 ${
            isSaved ? "bg-white text-black" : "bg-neutral-800 text-white hover:bg-neutral-700 border border-white/10"
          }`}
        >
          <Heart size={18} fill={isSaved ? "black" : "none"} />
          {isSaved ? "KAYDEDİLDİ" : "ROTAYI KAYDET"}
        </button>
      </div>

      <div id="pdf-content" className="space-y-12 border-l-2 border-orange-500/30 pl-8">
        {itinerary?.itinerary?.map((item: any, i: number) => (
          <div key={i} className="relative">
             <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-orange-500 border-4 border-black" />
            <div className="bg-neutral-900 p-8 rounded-3xl border border-white/5">
              <span className="text-orange-500 font-black text-3xl">{item.suggestedTime}</span>
              <h3 className="text-2xl font-black mt-2 uppercase tracking-tight">{item.name}</h3>
              <p className="text-gray-400 italic my-4 leading-relaxed">"{item.aiNote}"</p>
              <div className="inline-block bg-orange-500 text-black px-4 py-2 rounded-xl font-black text-xs uppercase">
                🚀 {item.transportation}
              </div>
            </div>
          </div>
        ))}
      </div>

      {itinerary?.travelTip && (
        <div className="mt-16 p-8 bg-orange-500/5 border border-orange-500/20 rounded-3xl">
          <h4 className="text-orange-500 font-black uppercase text-xs mb-3">Asistanın Notu</h4>
          <p className="italic text-orange-100/80">{itinerary.travelTip}</p>
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