"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Place {
    name?: string;
    lat: number;
    lng: number;
}

export default function MapView({ places, route }: { places: Place[]; route: Place[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;
        if (mapRef.current) return; // sadece bir defa oluştur

        mapRef.current = new mapboxgl.Map({
            container: containerRef.current,
            style: `mapbox://styles/${process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox/streets-v11"}`,
            center: places.length ? [places[0].lng, places[0].lat] : [28.98, 41.01],
            zoom: places.length ? 12 : 5,
        });

        // kontrol ekle
        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    // markerları ve rota güncelle
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // temizle önce
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        // ekle markerlar
        places.forEach((p, idx) => {
            const el = document.createElement("div");
            el.style.width = "14px";
            el.style.height = "14px";
            el.style.borderRadius = "50%";
            el.style.background = "#ff7a00";
            el.style.border = "2px solid white";
            el.title = p.name || `Nokta ${idx + 1}`;

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([p.lng, p.lat])
                .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(p.name || ""))
                .addTo(map);

            markersRef.current.push(marker);
        });

        // rota çiz (simple line) - önce var olan source/layer sil
        const routeCoords = (route || places).map((p) => [p.lng, p.lat]);

        if (map.getSource("route-line")) {
            (map.getSource("route-line") as mapboxgl.GeoJSONSource).setData({
                type: "Feature",
                geometry: { type: "LineString", coordinates: routeCoords },
            });
        } else if (routeCoords.length > 1) {
            map.addSource("route-line", {
                type: "geojson",
                data: {
                    type: "Feature",
                    geometry: { type: "LineString", coordinates: routeCoords },
                },
            } as any);

            map.addLayer({
                id: "route-line-layer",
                type: "line",
                source: "route-line",
                layout: { "line-join": "round", "line-cap": "round" },
                paint: { "line-color": "#ff7a00", "line-width": 4, "line-opacity": 0.85 },
            });
        }

        // haritayı rota ortalamasına kaydır
        if (routeCoords.length) {
            const lngs = routeCoords.map((c) => c[0]);
            const lats = routeCoords.map((c) => c[1]);
            const minLng = Math.min(...lngs);
            const maxLng = Math.max(...lngs);
            const minLat = Math.min(...lats);
            const maxLat = Math.max(...lats);

            const bounds = [
                [minLng, minLat],
                [maxLng, maxLat],
            ] as [[number, number], [number, number]];

            try {
                map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 });
            } catch (e) {
                // ignore
            }
        }

    }, [places, route]);

    return <div ref={containerRef} style={{ width: "100%", height: 480, borderRadius: 8, overflow: "hidden" }} />;
}
