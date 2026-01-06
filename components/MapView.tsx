"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
// Mapbox CSS importu eksikse harita düzgün görünmez, bunu ekledik:
import "mapbox-gl/dist/mapbox-gl.css";

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
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: containerRef.current,
            style: `mapbox://styles/${process.env.NEXT_PUBLIC_MAPBOX_STYLE || "mapbox/streets-v11"}`,
            center: places.length ? [places[0].lng, places[0].lat] : [28.98, 41.01],
            zoom: places.length ? 12 : 5,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
        };
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Eski markerları temizle
        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        // Yeni markerları ekle
        places.forEach((p, idx) => {
            const el = document.createElement("div");
            el.style.width = "14px";
            el.style.height = "14px";
            el.style.borderRadius = "50%";
            el.style.background = "#ff7a00";
            el.style.border = "2px solid white";
            el.style.cursor = "pointer";
            el.title = p.name || `Nokta ${idx + 1}`;

            const marker = new mapboxgl.Marker({ element: el })
                .setLngLat([p.lng, p.lat])
                .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(p.name || ""))
                .addTo(map);

            markersRef.current.push(marker);
        });

        // Rota koordinatlarını hazırla
        const routeCoords = (route && route.length > 0 ? route : places).map((p) => [p.lng, p.lat]);

        // HATA ÇÖZÜMÜ: properties: {} eklendi
        if (map.getSource("route-line")) {
            (map.getSource("route-line") as mapboxgl.GeoJSONSource).setData({
                type: "Feature",
                properties: {}, // Kritik: TypeScript bunu bekler
                geometry: { 
                    type: "LineString", 
                    coordinates: routeCoords as number[][] 
                },
            });
        } else if (routeCoords.length > 1) {
            map.addSource("route-line", {
                type: "geojson",
                data: {
                    type: "Feature",
                    properties: {}, // Kritik: TypeScript bunu bekler
                    geometry: {
                        type: "LineString",
                        coordinates: routeCoords as number[][],
                    },
                },
            });

            map.addLayer({
                id: "route-line-layer",
                type: "line",
                source: "route-line",
                layout: { "line-join": "round", "line-cap": "round" },
                paint: { 
                    "line-color": "#ff7a00", 
                    "line-width": 4, 
                    "line-opacity": 0.85 
                },
            });
        }

        // Haritayı sığdır
        if (routeCoords.length) {
            const bounds = new mapboxgl.LngLatBounds();
            routeCoords.forEach((coord) => bounds.extend(coord as [number, number]));

            try {
                map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 });
            } catch (e) {
                console.error("Bounds error:", e);
            }
        }

    }, [places, route]);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-[480px] rounded-xl overflow-hidden shadow-inner border border-neutral-200 dark:border-white/10" 
        />
    );
}