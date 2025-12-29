import { NextResponse } from "next/server";
import ankara from "@/data/ankara.json";
import istanbul from "@/data/istanbul.json";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = (searchParams.get("city") || "").toLowerCase();
    const selectedDistricts = (searchParams.get("districts") || "").split(",").map(d => d.trim().toLowerCase()).filter(Boolean);
    const interests = (searchParams.get("interests") || "").split(",").map(i => i.trim().toLowerCase()).filter(Boolean);

    let list: any[] = city === "istanbul" ? istanbul : (city === "ankara" ? ankara : []);

    const filtered = list.filter(p => {
        // 1. İlçe Kontrolü (Seçilen ilçelerden biriyse)
        const matchDistrict = selectedDistricts.length === 0 || 
                             selectedDistricts.includes(p.district?.toLowerCase());

        // 2. İlgi Alanı Kontrolü (Daha esnek: Hiç seçilmediyse true, seçildiyse en az 1 tane eşleşsin)
        const itemTags = (p.tags || []).map((t: string) => t.toLowerCase());
        const matchInterest = interests.length === 0 || 
                             interests.some(i => itemTags.includes(i));

        return matchDistrict && matchInterest;
    });

    // KRİTİK: Eğer filtreleme sonucu boşsa, kullanıcıya boş ekran vermek yerine 
    // seçilen ilçedeki HER ŞEYİ dön (Sistem kırılmasın)
    if (filtered.length === 0 && selectedDistricts.length > 0) {
        const fallback = list.filter(p => selectedDistricts.includes(p.district?.toLowerCase()));
        return NextResponse.json(fallback.slice(0, 15));
    }

    return NextResponse.json(filtered);
}