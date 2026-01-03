import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");

    if (!city) {
        return NextResponse.json({ error: "Şehir yok" }, { status: 400 });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=tr&appid=${apiKey}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return NextResponse.json({ error: "Hava durumu alınamadı" }, { status: 500 });
    }

    const data = await res.json();

    return NextResponse.json({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        city: data.name,
    });
}
