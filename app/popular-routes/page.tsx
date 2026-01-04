"use client";
import { CldImage } from 'next-cloudinary';
import popularRoutes from '@/data/popularRoutes.json';
import Link from 'next/link';
import { Map, Clock, Star, MapPin, Heart } from 'lucide-react'; 
import { useState, useEffect } from 'react';

const PopularRouteCard = ({ route }: { route: any }) => {
    const [isSaved, setIsSaved] = useState(false);

    const params = new URLSearchParams({
        city: route.city.toLowerCase(),
        districts: route.districts.join(','),
        interests: route.interests.join(','),
        duration: route.duration.toString(),
        startLocation: route.startLocation || ""
    });

    useEffect(() => {
        const currentSaved = JSON.parse(localStorage.getItem("saved_routes") || "[]");
        const alreadyExists = currentSaved.some((r: any) => r.id === route.id);
        setIsSaved(alreadyExists);
    }, [route.id]);

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault(); 
        e.stopPropagation();

        const userName = localStorage.getItem("userName");
        if (!userName) {
            alert("Kaydetmek için giriş yapmalısın!");
            return;
        }

        const currentSaved = JSON.parse(localStorage.getItem("saved_routes") || "[]");
        const alreadyExists = currentSaved.some((r: any) => r.id === route.id);

        if (!alreadyExists) {
            const newSave = {
                id: route.id,
                title: route.title,
                description: route.description,
                date: "Popüler Rota",
                type: "popular", 
                targetUrl: "/popular-routes" // ✅ POPÜLER SAYFASINA GİTSİN
            };
            
            localStorage.setItem("saved_routes", JSON.stringify([...currentSaved, newSave]));
            setIsSaved(true);
            alert("Popüler rota kaydedildi!");
        } else {
            const updatedSaved = currentSaved.filter((r: any) => r.id !== route.id);
            localStorage.setItem("saved_routes", JSON.stringify(updatedSaved));
            setIsSaved(false);
            alert("Rota listenizden kaldırıldı.");
        }
    };

    return (
        <Link
            href={`/results?${params.toString()}`}
            className="flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white p-5 rounded-2xl transition-all border border-gray-200 dark:border-white/10 hover:border-orange-500 hover:shadow-xl group relative"
        >
            <div className="relative h-44 w-full rounded-xl overflow-hidden mb-4">
                <CldImage
                    width="600"
                    height="400"
                    src={route.image}
                    alt={route.title}
                    crop="fill"
                    gravity="auto"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button 
                    onClick={handleSave}
                    className="absolute top-3 right-3 z-10 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-orange-500 transition-all border border-white/10"
                >
                    <Heart size={18} className={isSaved ? "fill-white text-white" : "text-white"} />
                </button>
            </div>

            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                <MapPin size={14} /> {route.city}
            </span>

            <h4 className="text-xl font-black text-neutral-900 dark:text-neutral-100 mb-2 leading-tight group-hover:text-orange-400 transition-colors">
                {route.title}
            </h4>

            <p className="text-sm text-gray-700 dark:text-gray-400 mb-4 line-clamp-3">
                {route.description}
            </p>

            <div className="mt-auto space-y-2 pt-3 border-t border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Clock size={16} className="text-orange-500" />
                    {route.duration} Saatlik Plan
                </div>
                <div className="flex flex-wrap gap-2">
                    {route.interests.slice(0, 3).map((interest: string) => (
                        <span key={interest} className="text-[10px] text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full font-medium uppercase tracking-tighter">
                            {interest}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default function PopularRoutesPage() {
    const istanbulRoutes = popularRoutes.filter(r => r.city === 'İstanbul');
    const ankaraRoutes = popularRoutes.filter(r => r.city === 'Ankara');

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 pt-24 min-h-screen bg-background transition-colors duration-300">
            <h1 className="text-5xl font-black text-neutral-950 dark:text-neutral-100 mb-3 flex items-center gap-3 italic uppercase tracking-tighter">
                <Star size={36} className="text-orange-500 fill-orange-500" />
                Popüler <span className="text-orange-500">Rotalar</span>
            </h1>
            
            <p className="text-neutral-700 dark:text-neutral-400 text-lg mb-12 max-w-2xl">
                Yapay zeka asistanımız tarafından en çok önerilen rotalar.
            </p>

            <section className="mb-20">
                <h2 className="text-3xl font-black text-neutral-950 dark:text-neutral-100 mb-8 border-b border-orange-500/50 pb-2 flex items-center gap-3 uppercase italic">
                    <Map size={24} className="text-orange-500" /> İstanbul'un Ruhu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {istanbulRoutes.map(route => (
                        <PopularRouteCard key={route.id} route={route} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-black text-neutral-950 dark:text-neutral-100 mb-8 border-b border-orange-500/50 pb-2 flex items-center gap-3 uppercase italic">
                    <Map size={24} className="text-orange-500" /> Ankara'nın Kalbi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ankaraRoutes.map(route => (
                        <PopularRouteCard key={route.id} route={route} />
                    ))}
                </div>
            </section>
        </div>
    );
}