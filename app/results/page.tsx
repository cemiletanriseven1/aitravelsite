"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";

function ResultsContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [itinerary, setItinerary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);
    const [weather, setWeather] = useState<any>(null);


    // ✅ GERÇEK PDF ÇÖZÜMÜ (html2canvas YOK)
    const downloadPDF = () => {
        window.print();
    };

    useEffect(() => {
        const generatePlan = async () => {
            const cityName = startLocation || city;

fetch(`/api/weather?city=${cityName}`)
    .then(res => res.json())
    .then(data => {
        if (!data.error) setWeather(data);
    });

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

            const cacheKey = `plan_${city}_${districts}_${duration}_${startLocation}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                setItinerary(JSON.parse(cachedData));
                setLoading(false);
                hasFetched.current = true;
                return;
            }

            try {
                setLoading(true);
                setError(null);
                hasFetched.current = true;

                const poisRes = await fetch(
                    `/api/pois?city=${city}&districts=${districts}&interests=${interests}`
                );
                if (!poisRes.ok) throw new Error("Mekanlar listesi alınamadı.");
                const places = await poisRes.json();

                if (places.length === 0) {
                    throw new Error("Seçtiğin kriterlere uygun mekan bulunamadı.");
                }

                const aiRes = await fetch("/api/itinerary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ city, places, duration, startLocation }),
                });

                const finalData = await aiRes.json();

                if (!aiRes.ok || finalData.error) {
                    throw new Error(finalData.error || "Rota oluşturulamadı.");
                }

                localStorage.setItem(cacheKey, JSON.stringify(finalData));
                setItinerary(finalData);
            } catch (err: any) {
                setError(err.message);
                hasFetched.current = false;
            } finally {
                setLoading(false);
            }
        };

        generatePlan();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mb-6"></div>
                <p className="text-xl font-black uppercase tracking-tighter">
                    Yapay Zeka Rotanı Çiziyor...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl max-w-md">
                    <h2 className="text-3xl font-black text-red-500 mb-4 uppercase italic">
                        Bir Sorun Oluştu
                    </h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-white text-black py-3 rounded-xl font-black uppercase"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-32 max-w-4xl mx-auto">
            {weather && (
    <div className="mb-8 p-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-6">
        <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt="hava durumu"
            className="w-16 h-16"
        />
        <div>
            <p className="text-orange-500 font-black uppercase tracking-widest text-xs">
                Başlangıç Noktasında Hava
            </p>
            <p className="text-2xl font-black">
                {weather.city} · {weather.temp}°C
            </p>
            <p className="text-gray-400 italic capitalize">
                {weather.description}
            </p>
        </div>
    </div>
)}

            <h1 className="text-5xl font-black mb-6 uppercase tracking-tighter">
                Senin <span className="text-orange-500 italic">Rotan</span>
            </h1>

            {/* ✅ PDF BUTONU */}
            <button
                onClick={downloadPDF}
                className="mb-12 bg-orange-500 text-black font-black px-6 py-3 rounded-xl uppercase tracking-widest"
            >
                📄 PDF Olarak İndir
            </button>

            {/* ✅ PDF'E GİRECEK TEK ALAN */}
            <div id="pdf-content">
                <div className="relative border-l-2 border-orange-500/30 ml-4 pl-8 space-y-12">
                    {itinerary?.itinerary?.map((item: any, index: number) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-[45px] top-0 w-8 h-8 bg-black border-2 border-orange-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            </div>

                            <div className="bg-neutral-900 border border-white/5 p-8 rounded-3xl">
                                <span className="text-orange-500 font-black text-3xl">
                                    {item.suggestedTime}
                                </span>
                                <h3 className="text-2xl font-black mt-2 mb-3">
                                    {item.name}
                                </h3>
                                <p className="text-gray-400 italic mb-4">
                                    "{item.aiNote}"
                                </p>
                                <div className="inline-flex items-center gap-2 text-xs font-black uppercase bg-orange-500 px-4 py-2 rounded-xl text-black">
                                    🚀 {item.transportation}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {itinerary?.travelTip && (
                    <div className="mt-16 p-8 bg-orange-500/5 border border-orange-500/20 rounded-3xl">
                        <h4 className="text-orange-500 font-black uppercase text-xs mb-3">
                            Asistanın Notu
                        </h4>
                        <p className="text-orange-100/80 text-lg italic">
                            {itinerary.travelTip}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="bg-black min-h-screen" />}>
            <ResultsContent />
        </Suspense>
    );
}
