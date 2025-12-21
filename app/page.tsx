// app/page.tsx
"use client";
import { CldImage } from 'next-cloudinary';
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Target, Sparkles, Clock, Map, ChevronRight } from "lucide-react";
import districtsData from "@/data/districts.json";


export default function HomePage() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [districts, setDistricts] = useState<string[]>([]); 
  const [interests, setInterests] = useState<string[]>([]);
  const [duration, setDuration] = useState("8"); 
  const [startLocation, setStartLocation] = useState(""); 

  // Şehir listesi 
  const cities = [
    {
      name: "İstanbul",
      id: "istanbul",
      img: "istanbul-1_z78qcn" 
    },
    {
      name: "Ankara",
      id: "ankara",
      img: "ankara-1_g2iedq"
    }
  ];

  const interestOptions = ["Tarih", "Doğa", "Yemek", "Müze", "Eğlence", "Alışveriş"];
  const durationOptions = [4, 6, 8, 10, 12, 16]; 

  const currentDistricts = useMemo(() => {
    if (!city) return [];
    const selectedCity = cities.find(c => c.name === city);
    if (selectedCity) {
      return (districtsData as any)[selectedCity.id] || [];
    }
    return [];
  }, [city]);

  const toggleDistrict = (d: string) => {
    setDistricts(prev =>
      prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]
    );
  };

  const isFormValid = city && districts.length > 0 && duration;

  const handleGenerate = () => {
    if (!isFormValid) return;
    const params = new URLSearchParams({
      city: city.toLowerCase(),
      districts: districts.join(","),
      interests: interests.join(","),
      duration: duration,
      startLocation: startLocation || "Şehir Merkezi",
    });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden pt-24 pb-12">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Sol Taraf: Metinler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} /> Yapay Zeka Seyahat Asistanı
          </span>
          <h2 className="text-6xl md:text-7xl font-black text-white leading-[1.1] mb-6">
            Şehri <br /> <span className="text-orange-500 tracking-tighter uppercase italic">Akıllıca</span> Keşfet.
          </h2>
          <p className="text-gray-400 text-lg max-w-md leading-relaxed">
            Saniyeler içinde sana özel rota. Zamanını planlamaya değil, gezmeye ayır.
          </p>
        </motion.div>

        {/* Sağ Taraf: Form Kartı */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900/40 backdrop-blur-3xl border border-white/10 p-8 rounded-[32px] shadow-2xl shadow-orange-500/5"
        >
          <div className="space-y-6">
            {/* ŞEHİR SEÇİMİ */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <MapPin size={14} className="text-orange-500" /> Şehir Seçimi
              </label>
              <div className="grid grid-cols-2 gap-4">
                {cities.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setCity(c.name); setDistricts([]); }}
                    className={`relative h-28 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${c.name === city
                      ? "border-orange-500 scale-[1.05] shadow-xl shadow-orange-500/20 z-10"
                      : "border-transparent opacity-40 hover:opacity-100 hover:scale-[1.02]"
                      }`}
                  >
                    <CldImage
                      width="400"
                      height="300"
                      src={c.img}
                      alt={c.name}
                      crop="fill"
                      gravity="auto"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end justify-center pb-4">
                      <span className="font-black text-white text-sm tracking-widest uppercase">{c.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* BAŞLANGIÇ KONUMU */}
            <div className={`transition-all duration-500 ${city ? "opacity-100 translate-y-0" : "opacity-20 pointer-events-none translate-y-4"}`}>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Map size={14} className="text-orange-500" /> Başlangıç Konumunuz (Otel / İlçe)
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="Örn: Taksim, Beşiktaş veya Otel Adı"
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 transition-all"
              />
            </div>

            {/* SÜRE SEÇİMİ */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Clock size={14} className="text-orange-500" /> Rota Süresi (Yaklaşık)
              </label>
              <div className="flex flex-wrap gap-2">
                {durationOptions.map((h) => (
                  <button
                    key={h}
                    onClick={() => setDuration(String(h))}
                    className={`px-4 py-2 rounded-xl text-sm font-black tracking-tighter border transition-all ${duration === String(h)
                      ? "bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-orange-500/50"
                      }`}
                  >
                    {h} Saat
                  </button>
                ))}
              </div>
            </div>

            {/* İLÇE SEÇİMİ (Çoklu) */}
            <div className={`transition-all duration-500 ${city ? "opacity-100 translate-y-0" : "opacity-20 pointer-events-none translate-y-4"}`}>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Target size={14} className="text-orange-500" /> Gezmek İstediğiniz Bölgeler (Çoklu Seçim)
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                {currentDistricts.map((d: string) => (
                  <button
                    key={d}
                    onClick={() => toggleDistrict(d)}
                    className={`px-4 py-2 rounded-xl text-[12px] font-black tracking-tighter border transition-all ${districts.includes(d)
                      ? "bg-white border-white text-neutral-900 shadow-lg shadow-white/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-white/50"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* İLGİ ALANLARI (Çoklu) */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                <Sparkles size={14} className="text-orange-500" /> İlgi Alanları
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setInterests(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-tighter border transition-all ${interests.includes(tag)
                      ? "bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20"
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-orange-500/50"
                      }`}
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* ROTA OLUŞTUR BUTONU */}
            <button
              onClick={handleGenerate}
              disabled={!isFormValid}
              className="w-full group bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-800 disabled:text-gray-600 text-black font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-orange-500/10"
            >
              {isFormValid ? "YOLCULUĞU BAŞLAT" : "LÜTFEN ŞEHİR, BÖLGE VE SÜRE SEÇİN"}
              <ChevronRight className={`group-hover:translate-x-1 transition-transform ${!isFormValid && 'hidden'}`} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}