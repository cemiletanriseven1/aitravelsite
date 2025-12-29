"use client";
import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

function ResultsContent() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [itinerary, setItinerary] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        const generatePlan = async () => {
            if (hasFetched.current) return;

            const city = searchParams.get('city');
            const districts = searchParams.get('districts');
            const interests = searchParams.get('interests');
            const duration = searchParams.get('duration');
            const startLocation = searchParams.get('startLocation');

            if (!city || !duration) {
                setError("Eksik bilgi! Lütfen arama formunu tam doldurun.");
                setLoading(false);
                return;
            }

            // --- KOTA DOSTU: ÖNBELLEK KONTROLÜ ---
            const cacheKey = `plan_${city}_${districts}_${duration}_${startLocation}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                console.log("Önbellekten veri çekildi 🚀");
                setItinerary(JSON.parse(cachedData));
                setLoading(false);
                hasFetched.current = true;
                return;
            }
            // ------------------------------------

            try {
                setLoading(true);
                setError(null);
                hasFetched.current = true;

                // 1. Mekanları Getir
                const poisRes = await fetch(`/api/pois?city=${city}&districts=${districts}&interests=${interests}`);
                if (!poisRes.ok) throw new Error("Mekanlar listesi alınamadı.");
                const places = await poisRes.json();

                if (places.length === 0) throw new Error("Seçtiğin kriterlere uygun mekan bulunamadı.");

                // 2. AI Rota Oluştur
                const aiRes = await fetch('/api/itinerary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ city, places, duration, startLocation }),
                });
                
                const finalData = await aiRes.json();
                
                if (!aiRes.ok || finalData.error) {
                    throw new Error(finalData.error || "Rota oluşturulamadı.");
                }

                // --- VERİYİ ÖNBELLEĞE KAYDET ---
                localStorage.setItem(cacheKey, JSON.stringify(finalData));
                // -------------------------------

                setItinerary(finalData);
            } catch (err: any) {
                setError(err.message);
                hasFetched.current = false; // Hata durumunda tekrar denemeye izin ver
            } finally {
                setLoading(false);
            }
        };

        generatePlan();
    }, [searchParams]);

    if (loading) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-orange-500 mb-6"></div>
            <p className="text-xl font-bold animate-pulse tracking-tighter uppercase">Yapay Zeka Rotanı Çiziyor...</p>
            <p className="text-gray-500 text-sm mt-2">Bu işlem Google AI yoğunluğuna göre 15sn sürebilir.</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-[32px] max-w-md shadow-2xl shadow-red-500/5">
                <h2 className="text-3xl font-black text-red-500 mb-4 tracking-tighter uppercase italic">Bir Sorun Oluştu</h2>
                <p className="text-gray-400 mb-8 leading-relaxed font-medium">{error}</p>
                <button 
                    onClick={() => {
                        hasFetched.current = false;
                        window.location.reload();
                    }} 
                    className="w-full bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all active:scale-95"
                >
                    Tekrar Dene
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-32 max-w-4xl mx-auto">
            <h1 className="text-5xl font-black mb-12 text-white uppercase tracking-tighter">
                Senin <span className="text-orange-500 italic">Rotan</span>
            </h1>
            
            <div className="relative border-l-2 border-orange-500/30 ml-4 pl-8 space-y-12">
                {itinerary?.itinerary?.map((item: any, index: number) => (
                    <div key={index} className="relative group">
                        {/* Zaman Baloncuğu */}
                        <div className="absolute -left-[45px] top-0 w-8 h-8 bg-black border-2 border-orange-500 rounded-full flex items-center justify-center z-10 group-hover:bg-orange-500 transition-colors">
                            <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-white" />
                        </div>
                        
                        <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-[24px] group-hover:border-orange-500/40 transition-all duration-500">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-orange-500 font-black text-3xl tracking-tighter">{item.suggestedTime}</span>
                                <span className="text-[10px] font-bold bg-white/5 border border-white/10 px-4 py-1 rounded-full text-gray-400 uppercase tracking-widest">{item.estimatedDuration}</span>
                            </div>
                            <h3 className="text-2xl font-black mb-3 text-white tracking-tight">{item.name}</h3>
                            <p className="text-gray-400 text-base mb-6 leading-relaxed italic">"{item.aiNote}"</p>
                            <div className="inline-flex items-center gap-2 text-[11px] text-white font-black uppercase tracking-widest bg-orange-500 px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20">
                                🚀 {item.transportation}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {itinerary?.travelTip && (
                <div className="mt-16 p-8 bg-orange-500/5 border border-orange-500/20 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <span className="text-6xl text-orange-500 font-black">?</span>
                    </div>
                    <h4 className="text-orange-500 font-black uppercase tracking-widest text-xs mb-3">Asistanın Notu</h4>
                    <p className="text-orange-100/80 text-lg leading-relaxed font-medium italic relative z-10">
                        {itinerary.travelTip}
                    </p>
                </div>
            )}
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