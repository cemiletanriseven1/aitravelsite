import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!, // ✅ DOĞRU KULLANIM
});

export async function POST(req: Request) {
  try {
    const { city, duration, startLocation, places } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API anahtarı eksik" },
        { status: 500 }
      );
    }

    const placeList = places?.map((p: any) => p.name).join(", ");

    const prompt = `
Şehir: ${city}
Süre: ${duration} saat
Başlangıç noktası: ${startLocation}
Gezilecek yerler: ${placeList}

Görev:
Mantıklı bir günlük gezi rotası oluştur.

⚠️ SADECE GEÇERLİ JSON DÖN
⚠️ Markdown kullanma
⚠️ Açıklama yazma

JSON formatı:
{
  "itinerary": [
    {
      "name": "",
      "suggestedTime": "",
      "aiNote": "",
      "lat": 0,
      "lng": 0,
      "estimatedDuration": "",
      "transportation": ""
    }
  ],
  "travelTip": ""
}
`;

    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL!, // ✅ MODEL ZORUNLU
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content ?? "";

    // 🛡 JSON güvenliği
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    if (start === -1 || end === -1) {
      throw new Error("AI geçerli JSON döndürmedi");
    }

    const cleanJson = text.slice(start, end);

    return NextResponse.json(JSON.parse(cleanJson));
  } catch (error: any) {
    console.error("Groq Error:", error);
    return NextResponse.json(
      { error: "AI rota oluşturamadı." },
      { status: 500 }
    );
  }
}
