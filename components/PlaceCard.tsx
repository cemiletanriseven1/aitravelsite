
import { Clock, MapPin, Train, Zap } from "lucide-react";

interface PlaceCardProps {
    place: {
        name: string;
        description: string;
        district?: string;
    };
    order: number;
    suggestedTime: string;
    aiNote: string;
    estimatedDuration: string;
    transportation?: string;
}

export default function PlaceCard({ place, order, suggestedTime, aiNote, estimatedDuration, transportation }: PlaceCardProps) {
    return (
        <div className="bg-neutral-900/70 p-5 rounded-2xl border border-white/10 shadow-xl transition-all hover:border-orange-500/50">
            <div className="flex items-center justify-between mb-3">
                <span className="text-3xl font-black text-orange-500 mr-4">{order}.</span>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-400 flex items-center gap-1 justify-end">
                        <Clock size={14} /> Başlangıç: {suggestedTime}
                    </p>
                    <p className="text-xs text-gray-500">Süre: {estimatedDuration}</p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 leading-snug">{place.name}</h3>

            {/* ULAŞIM BİLGİSİ */}
            {transportation && (
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/30 p-2 rounded-lg mb-3">
                    <Train size={14} />
                    <span className="font-medium">{transportation}</span>
                </div>
            )}

            {/* AI Notu */}
            <div className="bg-white/5 p-3 rounded-xl text-xs text-gray-300 border-l-4 border-orange-500/50">
                <p className="font-bold text-orange-400 mb-1 flex items-center gap-1"><Zap size={12} /> AI Notu:</p>
                {aiNote}
            </div>

        </div>
    );
}