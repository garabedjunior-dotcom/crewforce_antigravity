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
            <div className="w-full h-full bg-slate-50 dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-3">
                <div className="relative size-10">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-200 dark:border-slate-700"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                </div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Loading map</span>
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
