"use client";

import dynamic from "next/dynamic";

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

// Leaflet uses `window`, so it must be loaded client-side only
const ProjectMap = dynamic(
    () => import("@/components/dashboard/project-map").then((mod) => mod.ProjectMap),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-slate-900 animate-pulse rounded-xl flex items-center justify-center text-slate-500">
                Loading map...
            </div>
        ),
    }
);

interface MapWrapperProps {
    projects: ProjectPin[];
}

export function MapWrapper({ projects }: MapWrapperProps) {
    return <ProjectMap projects={projects} />;
}
