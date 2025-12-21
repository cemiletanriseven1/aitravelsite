
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// !!! DEBUG SATIRI: Terminalde anahtarın okunup okunmadığını kontrol edin !!!
console.log("API Key Durumu:", GEMINI_API_KEY ? "OKUNUYOR (Hata devam ederse: Sunucuyu yeniden başlatın veya anahtarı kontrol edin)" : "OKUNMUYOR - KRİTİK HATA");
// !!! DEBUG SATIRI BİTİŞ !!!

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: Request) {
    // YENİ: duration ve startLocation'ı alıyoruz
    const { city, districts, interests, places, duration, startLocation } = await req.json();

    if (!places || places.length === 0) {
        return NextResponse.json({ error: "Rota oluşturulacak mekan bulunamadı." }, { status: 400 });
    }

    // KRİTİK KONTROL: Eğer anahtar okunmuyorsa, detaylı hata mesajı döndür
    if (!GEMINI_API_KEY) {
        return NextResponse.json({
            error: "Yapay Zeka Servisi Hatası: GEMINI_API_KEY ortam değişkeni ayarlanmamış.",
            details: "Lütfen .env.local dosyanızı kontrol edin ve sunucuyu yeniden başlatın."
        }, { status: 500 });
    }

    const placeListForAI = places.map((p: any) => ({
        name: p.name,
        district: p.district,
        lat: p.lat,
        lng: p.lng,
        tags: p.tags.join(", "),
        description: p.description,
    }));

    // PROMPT KISMI
    const systemInstruction = `Sen, kullanıcıya özel gezi rotası oluşturan üst düzey bir yapay zeka seyahat asistanısın. Görevin, verilen gezilecek yerler (POI) listesini, aşağıdaki kurallara göre mantıklı ve kronolojik bir gezi planına dönüştürmektir:
        1. Rota, kullanıcının belirttiği ${duration} saatlik gezi süresini aşmayacak şekilde en uygun ${Math.floor(Number(duration) / 2) || 4} mekanı seçmelidir.
        2. Başlangıç saati her zaman 09:00'u kabul et.
        3. İlk durak, kullanıcının "${startLocation}" başlangıç konumuna coğrafi olarak en yakın POI olmalıdır.
        4. Her mekana ortalama 2 saat ziyaret süresi ayır.
        5. Mekanları birbirine coğrafi olarak en yakın sıraya koy (verimli rota).
        6. Her durak için özel bir 'aiNote' (Türkçe) oluştur. Bu not, yerin neden seçildiğini ve kullanıcıya özel ipuçlarını içermeli.
        7. Her durak için, bir önceki mekandan (veya ilk durak için başlangıç noktasından) nasıl gidileceğine dair **KISA** bir 'transportation' (ulaşım) notu ekle (Örn: "5 dk yürüyüş" veya "Metro ile 3 durak").
        8. Çıktı formatın SADECE ve SADECE JSON olmalıdır. Başka hiçbir metin, açıklama veya markdown formatı KULLANMA.

        Kullanıcı Bilgisi:
        Şehir: ${city}, Gezi Süresi: ${duration} saat, Başlangıç Konumu: ${startLocation}, İlgilenilen Bölgeler: ${districts.join(", ")}

        POI Listesi: ${JSON.stringify(placeListForAI)}
        
        İstenen Çıktı JSON Formatı:
        {
            "itinerary": [
                {
                    "name": "[POI Adı]",
                    "suggestedTime": "[hh:mm formatında ziyaret başlangıç saati]",
                    "aiNote": "[Kişiye özel, Türkçe not]",
                    "lat": [lat],
                    "lng": [lng],
                    "estimatedDuration": "[ör: 2 saat]",
                    "transportation": "[Önceki noktadan ulaşım notu]" // YENİ ALAN
                }
            ],
            "travelTip": "[Bu gezi için şehirle ilgili genel, kısa bir Türkçe ipucu]"
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Yukarıdaki talimatlara göre gezi planını oluştur ve SADECE JSON çıktısını ver.",
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        return NextResponse.json(result);
    } catch (error) {
        // Hata yakalama bloğu
        console.error("AI API İstek Hatası:", error);

        let errorMessage = "Bilinmeyen bir hata oluştu.";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'toString' in error) {
            errorMessage = error.toString();
        }

        // Anahtar hatası veya API kota hatasını spesifik yakalama
        if (errorMessage.includes("API key not valid") || errorMessage.includes("API_KEY_INVALID")) {
            errorMessage = "Gemini API Anahtarınız geçersiz veya eksik. Lütfen .env.local dosyanızı kontrol edin.";
        }

        return NextResponse.json({
            error: "Rota oluşturulurken kritik bir AI hatası oluştu.",
            details: errorMessage
        }, { status: 500 });
    }
}