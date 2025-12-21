
import { NextResponse } from "next/server";
import ankara from "@/data/ankara.json";
import istanbul from "@/data/istanbul.json";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = (searchParams.get("city") || "").toLowerCase();

    // YENİ: districts parametresini alıyoruz ve virgülle ayırıp küçük harfe çeviriyoruz
    const selectedDistricts = (searchParams.get("districts") || "").split(",").map(d => d.trim().toLowerCase()).filter(Boolean);
    const interests = (searchParams.get("interests") || "").split(",").map(i => i.trim().toLowerCase()).filter(Boolean);

    let list: any[] = [];
    if (city === "istanbul") list = istanbul;
    if (city === "ankara") list = ankara;

    // Filtreleme Mantığı:
    const filtered = list.filter(p => {
        // 1. İlçe Kontrolü (Çoklu İlçe Desteği)
        // Eğer seçili ilçe listesi boş değilse, POI'nin ilçesi bu listede olmalı.
        const matchDistrict = selectedDistricts.length
            ? selectedDistricts.includes(p.district?.toLowerCase())
            : true; // İlçe seçimi yapılmadıysa bu kriteri atla

        // 2. İlgi Alanı Tags Kontrolü
        const matchInterest = interests.length
            ? interests.some(i => p.tags && p.tags.map((t: string) => t.toLowerCase()).includes(i))
            : true;

        return matchDistrict && matchInterest;
    });

    return NextResponse.json(filtered);
}