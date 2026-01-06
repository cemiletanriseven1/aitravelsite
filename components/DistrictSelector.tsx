"use client";

import districts from "@/data/districts.json";

interface Props {
    city: string;
    value: string;
    onChange: (val: string) => void;
}

export default function DistrictSelector({ city, value, onChange }: Props) {
    /** * Hatanın Çözümü: 
     * 'city' değişkenini districts objesinin bir anahtarı (key) olarak tanımlıyoruz.
     * Eğer city boşsa veya karşılığı yoksa boş dizi döner.
     */
    const cityKey = city as keyof typeof districts;
    const list = districts[cityKey] || [];

    return (
        <div className="flex flex-col gap-1">
            <label 
                htmlFor="district-select" 
                className="text-sm font-black uppercase tracking-widest text-orange-500"
            >
                İlçe Seçimi
            </label>
            <select
                id="district-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={!city}
                className="w-full h-12 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.5em'
                }}
            >
                <option value="">
                    {city ? "-- İlçe Seçiniz --" : "-- Önce Şehir Seçiniz --"}
                </option>
                {list.map((districtName: string) => (
                    <option key={districtName} value={districtName}>
                        {districtName}
                    </option>
                ))}
            </select>
        </div>
    );
}