"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type ProjectPin = {
    id: string;
    name: string;
    location: string | null;
    status: string;
    latitude: number;
    longitude: number;
    crewCount: number;
    logCount: number;
};

interface ProjectMapProps {
    projects: ProjectPin[];
}

export function ProjectMap({ projects }: ProjectMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Default center: Miami
        const defaultCenter: [number, number] = [25.7617, -80.1918];
        const hasProjects = projects.length > 0;
        const center: [number, number] = hasProjects
            ? [projects[0].latitude, projects[0].longitude]
            : defaultCenter;

        const map = L.map(mapRef.current, {
            zoomControl: false,
        }).setView(center, 12);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Google Maps Hybrid (Satellite View with Streets and Labels)
        L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
            attribution: '&copy; Google Maps',
            maxZoom: 22,
        }).addTo(map);

        // Custom icon
        const pinIcon = L.divIcon({
            className: "custom-pin",
            html: `<div style="
                width: 32px; height: 32px;
                background: linear-gradient(135deg, #f97316, #ea580c);
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                display: flex; align-items: center; justify-content: center;
            ">
                <span style="transform: rotate(45deg); color: white; font-size: 14px; font-weight: bold;">⚡</span>
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -36],
        });

        const statusColors: Record<string, string> = {
            ACTIVE: "#10b981",
            DELAYED: "#f59e0b",
            COMPLETED: "#3b82f6",
        };

        // Add markers for each project
        projects.forEach((project) => {
            const marker = L.marker([project.latitude, project.longitude], { icon: pinIcon }).addTo(map);

            const statusColor = statusColors[project.status] || "#94a3b8";
            marker.bindPopup(`
                <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="
                            width: 36px; height: 36px;
                            background: rgba(249, 115, 22, 0.1);
                            color: #f97316;
                            border-radius: 8px;
                            display: flex; align-items: center; justify-content: center;
                            font-weight: 900; font-size: 14px; text-transform: uppercase;
                        ">${project.name.substring(0, 2)}</div>
                        <div>
                            <strong style="font-size: 14px; color: #0f172a;">${project.name}</strong>
                            <div style="font-size: 10px; color: #64748b;">${project.location || "No location"}</div>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
                        <span style="
                            background: ${statusColor}20;
                            color: ${statusColor};
                            font-size: 10px; font-weight: 700;
                            padding: 2px 8px; border-radius: 99px;
                            text-transform: uppercase; letter-spacing: 0.5px;
                        ">${project.status}</span>
                    </div>
                    <div style="display: flex; gap: 12px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                        <span>👷 ${project.crewCount} Crew${project.crewCount !== 1 ? 's' : ''}</span>
                        <span>📋 ${project.logCount} Log${project.logCount !== 1 ? 's' : ''}</span>
                    </div>
                    <a href="/projects/${project.id}" style="
                        display: block; text-align: center;
                        margin-top: 10px; padding: 6px 12px;
                        background: #f97316; color: white;
                        border-radius: 6px; font-size: 12px; font-weight: 700;
                        text-decoration: none;
                    ">View Details →</a>
                </div>
            `, { className: "custom-popup" });
        });

        // Fit bounds if multiple projects
        if (projects.length > 1) {
            const bounds = L.latLngBounds(projects.map((p) => [p.latitude, p.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        mapInstanceRef.current = map;

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [projects]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full rounded-xl" />
            <style jsx global>{`
                .custom-popup .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                    padding: 4px;
                }
                .custom-popup .leaflet-popup-tip {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .leaflet-control-zoom a {
                    background: rgba(15, 23, 42, 0.85) !important;
                    color: white !important;
                    border: none !important;
                    backdrop-filter: blur(8px);
                }
                .leaflet-control-zoom a:hover {
                    background: rgba(15, 23, 42, 1) !important;
                }
            `}</style>
        </div>
    );
}
