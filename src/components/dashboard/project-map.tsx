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

const STATUS_COLORS: Record<string, { fill: string; ring: string; label: string }> = {
    ACTIVE: { fill: "#10b981", ring: "rgba(16,185,129,0.25)", label: "Active" },
    DELAYED: { fill: "#f59e0b", ring: "rgba(245,158,11,0.25)", label: "Delayed" },
    COMPLETED: { fill: "#3b82f6", ring: "rgba(59,130,246,0.25)", label: "Completed" },
};

function createMarkerIcon(status: string) {
    const color = STATUS_COLORS[status] || { fill: "#94a3b8", ring: "rgba(148,163,184,0.25)" };
    const isActive = status === "ACTIVE";

    return L.divIcon({
        className: "premium-marker",
        html: `
            <div class="marker-container">
                ${isActive ? `<div class="marker-pulse" style="background:${color.ring};"></div>` : ""}
                <div class="marker-dot" style="background:${color.fill}; box-shadow: 0 0 0 3px rgba(255,255,255,0.9), 0 0 12px ${color.fill}80;"></div>
            </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -14],
    });
}

function createPopupHTML(project: ProjectPin) {
    const status = STATUS_COLORS[project.status] || { fill: "#94a3b8", label: project.status };
    return `
        <div class="popup-inner">
            <div class="popup-header">
                <div class="popup-avatar">${project.name.substring(0, 2)}</div>
                <div class="popup-title-group">
                    <strong class="popup-name">${project.name}</strong>
                    <span class="popup-location">${project.location || "No location set"}</span>
                </div>
            </div>
            <div class="popup-badge" style="background:${status.fill}15; color:${status.fill}; border: 1px solid ${status.fill}30;">
                <span class="popup-badge-dot" style="background:${status.fill};"></span>
                ${status.label}
            </div>
            <div class="popup-stats">
                <div class="popup-stat">
                    <span class="popup-stat-value">${project.crewCount}</span>
                    <span class="popup-stat-label">Crew${project.crewCount !== 1 ? "s" : ""}</span>
                </div>
                <div class="popup-stat-divider"></div>
                <div class="popup-stat">
                    <span class="popup-stat-value">${project.logCount}</span>
                    <span class="popup-stat-label">Log${project.logCount !== 1 ? "s" : ""}</span>
                </div>
            </div>
            <a href="/projects/${project.id}" class="popup-cta">View Project</a>
        </div>
    `;
}

export function ProjectMap({ projects }: ProjectMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const defaultCenter: [number, number] = [25.7617, -80.1918];
        const hasProjects = projects.length > 0;
        const center: [number, number] = hasProjects
            ? [projects[0].latitude, projects[0].longitude]
            : defaultCenter;

        const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false,
        }).setView(center, 12);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        // Minimal attribution — small, non-intrusive
        L.control.attribution({ position: "bottomleft", prefix: false })
            .addAttribution('<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a> | &copy; <a href="https://carto.com" target="_blank" rel="noopener">CARTO</a>')
            .addTo(map);

        // CartoDB Dark Matter — premium dark tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            maxZoom: 20,
            subdomains: "abcd",
        }).addTo(map);

        // Add markers
        projects.forEach((project) => {
            const icon = createMarkerIcon(project.status);
            const marker = L.marker([project.latitude, project.longitude], { icon }).addTo(map);
            marker.bindPopup(createPopupHTML(project), {
                className: "premium-popup",
                maxWidth: 260,
                minWidth: 220,
            });
        });

        // Fit bounds if multiple projects
        if (projects.length > 1) {
            const bounds = L.latLngBounds(projects.map((p) => [p.latitude, p.longitude]));
            map.fitBounds(bounds, { padding: [60, 60] });
        }

        mapInstanceRef.current = map;

        setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 300);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [projects]);

    return (
        <div className="relative w-full h-full min-h-[400px] flex-1 isolate z-0">
            <div ref={mapRef} className="absolute inset-0 rounded-xl z-0" style={{ minHeight: "100%" }} />

            {/* Subtle vignette overlay for depth */}
            <div className="absolute inset-0 rounded-xl pointer-events-none z-[2]"
                style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.15)" }} />

            <style jsx global>{`
                /* ─── Container ─── */
                .leaflet-container {
                    width: 100% !important;
                    height: 100% !important;
                    z-index: 1 !important;
                    background: #1a1a2e !important;
                }

                /* ─── Zoom Controls ─── */
                .leaflet-control-zoom {
                    border: none !important;
                    border-radius: 10px !important;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3) !important;
                }
                .leaflet-control-zoom a {
                    background: rgba(15, 23, 42, 0.9) !important;
                    color: rgba(255,255,255,0.7) !important;
                    border: none !important;
                    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
                    backdrop-filter: blur(12px);
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                    font-size: 16px !important;
                    transition: all 0.15s ease;
                }
                .leaflet-control-zoom a:hover {
                    background: rgba(15, 23, 42, 1) !important;
                    color: white !important;
                }
                .leaflet-control-zoom a:last-child {
                    border-bottom: none !important;
                }

                /* ─── Attribution ─── */
                .leaflet-control-attribution {
                    background: rgba(15, 23, 42, 0.6) !important;
                    color: rgba(255,255,255,0.35) !important;
                    font-size: 9px !important;
                    padding: 2px 8px !important;
                    border-radius: 6px !important;
                    backdrop-filter: blur(8px);
                    margin: 8px !important;
                }
                .leaflet-control-attribution a {
                    color: rgba(255,255,255,0.45) !important;
                    text-decoration: none !important;
                }

                /* ─── Marker ─── */
                .premium-marker {
                    background: none !important;
                    border: none !important;
                }
                .marker-container {
                    position: relative;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .marker-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    position: relative;
                    z-index: 2;
                    transition: transform 0.2s ease;
                }
                .premium-marker:hover .marker-dot {
                    transform: scale(1.3);
                }
                .marker-pulse {
                    position: absolute;
                    inset: -6px;
                    border-radius: 50%;
                    z-index: 1;
                    animation: pulse-ring 2s ease-out infinite;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(2.2); opacity: 0; }
                }

                /* ─── Popup ─── */
                .premium-popup .leaflet-popup-content-wrapper {
                    background: rgba(15, 23, 42, 0.95) !important;
                    backdrop-filter: blur(16px);
                    border-radius: 14px !important;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) !important;
                    color: white;
                    padding: 0 !important;
                    overflow: hidden;
                }
                .premium-popup .leaflet-popup-content {
                    margin: 0 !important;
                    line-height: 1.4;
                }
                .premium-popup .leaflet-popup-tip {
                    background: rgba(15, 23, 42, 0.95) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                .premium-popup .leaflet-popup-close-button {
                    color: rgba(255,255,255,0.4) !important;
                    font-size: 18px !important;
                    top: 8px !important;
                    right: 10px !important;
                    transition: color 0.15s;
                }
                .premium-popup .leaflet-popup-close-button:hover {
                    color: white !important;
                }

                /* ─── Popup Inner Content ─── */
                .popup-inner {
                    font-family: 'Inter', system-ui, sans-serif;
                    padding: 16px;
                }
                .popup-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                }
                .popup-avatar {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 102, 0, 0.15);
                    color: #ff6600;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 13px;
                    text-transform: uppercase;
                    flex-shrink: 0;
                }
                .popup-title-group {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .popup-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .popup-location {
                    font-size: 11px;
                    color: rgba(255,255,255,0.45);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .popup-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 99px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }
                .popup-badge-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                }
                .popup-stats {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 10px 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    margin-bottom: 12px;
                }
                .popup-stat {
                    display: flex;
                    align-items: baseline;
                    gap: 4px;
                }
                .popup-stat-value {
                    font-size: 16px;
                    font-weight: 700;
                    color: white;
                }
                .popup-stat-label {
                    font-size: 11px;
                    color: rgba(255,255,255,0.4);
                    font-weight: 500;
                }
                .popup-stat-divider {
                    width: 1px;
                    height: 16px;
                    background: rgba(255,255,255,0.1);
                }
                .popup-cta {
                    display: block;
                    text-align: center;
                    padding: 8px 16px;
                    background: #ff6600;
                    color: white !important;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    text-decoration: none !important;
                    transition: background 0.15s ease;
                    letter-spacing: 0.3px;
                }
                .popup-cta:hover {
                    background: #e55b00;
                }
            `}</style>
        </div>
    );
}
