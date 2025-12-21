// src/lib/geo.ts
export function toRad(deg: number) {
    return (deg * Math.PI) / 180;
}

// km cinsinden Haversine
export function haversineDistance(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371; // km
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const aa = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
}

// Basit nearest-neighbor rota: start index 0 (ilk nokta) veya verilen start koordinatı
export function nearestNeighborRoute(points: { lat: number; lng: number }[], start?: { lat: number; lng: number }) {
    if (!points || points.length === 0) return [];
    const remaining = points.map((p, i) => ({ ...p, __i: i }));
    const route: typeof remaining = [];

    // başlangıç noktası: eğer start verilmişse en yakın noktayı başlangıç kabul et
    let current;
    if (start) {
        let minIdx = 0;
        let minD = haversineDistance(start, remaining[0]);
        for (let i = 1; i < remaining.length; i++) {
            const d = haversineDistance(start, remaining[i]);
            if (d < minD) { minD = d; minIdx = i; }
        }
        current = remaining.splice(minIdx, 1)[0];
    } else {
        current = remaining.shift()!;
    }
    route.push(current);

    while (remaining.length) {
        let minIdx = 0;
        let minD = haversineDistance(current, remaining[0]);
        for (let i = 1; i < remaining.length; i++) {
            const d = haversineDistance(current, remaining[i]);
            if (d < minD) { minD = d; minIdx = i; }
        }
        current = remaining.splice(minIdx, 1)[0];
        route.push(current);
    }

    return route;
}
