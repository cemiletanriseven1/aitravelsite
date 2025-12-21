
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import PlaceCard from "@/components/PlaceCard";
import { MapPin, Sparkles, Clock, Map, Train } from "lucide-react"; // Train ikonu eklendi
import { motion } from "framer-motion";

// Harita bileşeni dinamik yükleme
const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
    loading: () => (
        <div className="flex justify-center items-center bg-neutral-900/50 h-96 rounded-lg text-gray-500">
            Harita Yükleniyor...
        </div>
    ),
});


export default function ResultsPage() {
    const params = useSearchParams();
    const city = params.get("city") || "";
    // YENİ: districts, duration ve startLocation'ı alıyoruz
    const districts = (params.get("districts") || "").split(",").filter(Boolean);
    const interests = (params.get("interests") || "").split(",").filter(Boolean);
    const duration = params.get("duration") || "8";
    const startLocation = params.get("startLocation") || "Şehir Merkezi";

    const [itinerary, setItinerary] = useState<any[]>([]);
    const [travelTip, setTravelTip] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!city || districts.length === 0) return;
        setLoading(true);
        setError(null);

        // 1. POI Listesini Çek (Artık çoklu ilçe gönderiyoruz)
        const fetchPoisUrl = `/api/pois?city=${city.toLowerCase()}&districts=${encodeURIComponent(districts.join(","))}&interests=${encodeURIComponent(interests.join(","))}`;

        fetch(fetchPoisUrl)
            .then((r) => r.json())
            .then((data) => {
                if (!data || data.message || data.length === 0) {
                    setError("Seçtiğiniz bölgelerde ve ilgi alanlarında uygun mekan bulunamadı. Lütfen filtreleri değiştirin.");
                    setLoading(false);
                    return null;
                }

                // 2. AI Rota Oluşturma API'sini Çağır (Yeni parametreler dahil)
                return fetch("/api/itinerary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        city, districts, interests, places: data, duration, startLocation
                    }),
                });
            })
            .then(r => r ? r.json() : null)
            .then((aiResponse) => {
                if (aiResponse && aiResponse.itinerary) {
                    setItinerary(aiResponse.itinerary);
                    setTravelTip(aiResponse.travelTip || "");
                } else if (aiResponse && aiResponse.error) {
                    setError(`Rota oluşturulamadı: ${aiResponse.error}. Detay: ${aiResponse.details}`);
                }
                setLoading(false);
            })
            .catch((e) => {
                console.error("Fetch Error:", e);
                setError("Beklenmedik bir sunucu hatası oluştu.");
                setLoading(false);
            });
    }, [city, districts.join(","), interests.join(","), duration, startLocation]);

    const routePoints = itinerary;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
            <h1 className="text-4xl font-black mb-2 text-white">
                <span className="text-orange-500">{city}</span> Rota Planı
            </h1>

            {/* Rota Özeti */}
            <p className="text-gray-400 text-lg mb-8 space-y-1">
                <span className="flex items-center gap-2">
                    <MapPin size={18} className="text-orange-500" />
                    Bölgeler: {districts.join(", ")}
                </span>
                <span className="flex items-center gap-2">
                    <Clock size={18} className="text-orange-500" />
                    Süre: {duration} Saat
                </span>
                <span className="flex items-center gap-2">
                    <Map size={18} className="text-orange-500" />
                    Başlangıç: {startLocation}
                </span>
            </p>

            {/* Hata ve Yüklenme Durumları */}
            {loading && (
                <div className="text-center py-20">
                    <Sparkles className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-4" />
                    <p className="text-lg text-orange-400">Yapay Zeka Mükemmel Rotanızı Hesaplıyor...</p>
                </div>
            )}

            {error && <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg break-words">{error}</div>}

            {itinerary.length > 0 && !loading && (
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Harita - Sol Kısım */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 order-1"
                    >
                        <MapView places={routePoints} route={routePoints} />

                        {travelTip && (
                            <div className="mt-6 bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-lg text-sm text-gray-300">
                                <p className="font-bold text-orange-400 mb-1 flex items-center gap-2"><Sparkles size={16} />AI Seyahat İpucu:</p>
                                {travelTip}
                            </div>
                        )}
                    </motion.div>

                    {/* Rota Listesi - Sağ Kısım */}
                    <div className="lg:col-span-1 space-y-4 order-2">
                        {itinerary.map((p: any, idx: number) => (
                            <PlaceCard
                                key={idx}
                                place={p}
                                order={idx + 1}
                                suggestedTime={p.suggestedTime}
                                aiNote={p.aiNote}
                                estimatedDuration={p.estimatedDuration}
                                // YENİ: Ulaşım bilgisini prop olarak iletiyoruz
                                transportation={p.transportation}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}