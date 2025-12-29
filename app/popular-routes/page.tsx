"use client";
import { CldImage } from 'next-cloudinary';
import popularRoutes from '@/data/popularRoutes.json';
import Link from 'next/link';
import { Map, Clock, Star, MapPin } from 'lucide-react';

const PopularRouteCard = ({ route }: { route: any }) => {
    const params = new URLSearchParams({
        city: route.city.toLowerCase(),
        districts: route.districts.join(','),
        interests: route.interests.join(','),
        duration: route.duration,
        startLocation: route.startLocation
    });

    return (
        <Link
            href={`/results?${params.toString()}`}
            // DÜZELTME: Kartın arka planı ve bordürü artık moda göre değişiyor
            className="flex flex-col bg-white dark:bg-neutral-900 text-black dark:text-white p-5 rounded-2xl transition-all border border-gray-200 dark:border-white/10 hover:border-orange-500 hover:shadow-xl group"
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
                {/* Etiket Rengi: Siyah yazı */}
                <div className="absolute top-2 right-2 bg-orange-500 text-black font-black px-2 py-0.5 rounded-md z-10 text-[10px]">
                   POPÜLER
                </div>
            </div>

            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1 mb-2">
                <MapPin size={14} /> {route.city}
            </span>

            {/* Başlık Rengi: Light:Siyah / Dark:Beyaz */}
            <h4 className="text-xl font-black text-black dark:text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors">
                {route.title}
            </h4>

            {/* Açıklama Rengi: Light:Koyu Gri / Dark:Açık Gri */}
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
        <div className="max-w-7xl mx-auto px-6 py-8 pt-24 min-h-screen bg-white dark:bg-black transition-colors duration-300">
            {/* GENEL SAYFA BAŞLIKLARI */}
            <h1 className="text-5xl font-black text-black dark:text-white mb-3 flex items-center gap-3 italic uppercase tracking-tighter">
                <Star size={36} className="text-orange-500 fill-orange-500" />
                Popüler <span className="text-orange-500">Rotalar</span>
            </h1>
            
            <p className="text-black dark:text-gray-400 text-lg mb-12 max-w-2xl">
                Yapay zeka asistanımız tarafından en çok önerilen rotalar.
            </p>

            <section className="mb-20">
                <h2 className="text-3xl font-black text-black dark:text-white mb-8 border-b border-orange-500/50 pb-2 flex items-center gap-3 uppercase italic">
                    <Map size={24} className="text-orange-500" /> İstanbul'un Ruhu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {istanbulRoutes.map(route => (
                        <PopularRouteCard key={route.id} route={route} />
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-black text-black dark:text-white mb-8 border-b border-orange-500/50 pb-2 flex items-center gap-3 uppercase italic">
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