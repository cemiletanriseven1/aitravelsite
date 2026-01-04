import { NextResponse } from "next/server";

// Örnek bir kayıt listesi (Gerçek projede burası Veritabanı olacak)
let savedRoutes: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, routeData } = body;

    if (!userId) return NextResponse.json({ error: "Giriş yapmalısınız" }, { status: 401 });

    // Rota zaten kayıtlı mı kontrolü
    const exists = savedRoutes.find(r => r.id === routeData.id && r.userId === userId);
    if (exists) {
      savedRoutes = savedRoutes.filter(r => r.id !== routeData.id || r.userId !== userId);
      return NextResponse.json({ message: "Kaldırıldı", action: "removed" });
    }

    const newSave = { ...routeData, userId, savedAt: new Date() };
    savedRoutes.push(newSave);

    return NextResponse.json({ message: "Kaydedildi", action: "saved" });
  } catch (error) {
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const userSaved = savedRoutes.filter(r => r.userId === userId);
  return NextResponse.json(userSaved);
}