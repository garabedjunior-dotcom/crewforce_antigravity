import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import { MapWrapper } from "@/components/dashboard/map-wrapper";
import { MapPin, Users, Plus, Map as MapIcon } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function MapPage() {
    const projects = await prisma.project.findMany({
        where: {
            latitude: { not: null },
            longitude: { not: null },
        },
        include: {
            crews: true,
            dailyLogs: true,
        },
        orderBy: { updatedAt: 'desc' },
    });

    const pins = projects.map((p) => ({
        id: p.id,
        name: p.name,
        location: p.location,
        status: p.status,
        latitude: p.latitude!,
        longitude: p.longitude!,
        crewCount: p.crews.length,
        logCount: p.dailyLogs.length,
    }));

    const activeCount = projects.filter((p) => p.status === "ACTIVE").length;
    const totalCrews = projects.reduce((acc, p) => acc + p.crews.length, 0);

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Map View" />
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">

                {/* Top bar with stats */}
                <FadeIn delay={0.1} className="px-8 pt-6 pb-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Project Map</h1>
                        <p className="text-slate-500 mt-1">Visualize all active project sites on the field.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{activeCount} Active</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-primary" size={14} />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{pins.length} Pinned</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex items-center gap-2">
                                <Users className="text-amber-500" size={14} />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{totalCrews} Crews</span>
                            </div>
                        </div>
                        <Link
                            href="/projects/new"
                            className="bg-primary text-white px-5 py-2 rounded-lg font-medium text-sm shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <MapPin size={14} />
                            Add Project
                        </Link>
                    </div>
                </FadeIn>

                {/* Map container */}
                <div className="flex-1 px-8 pb-6">
                    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg">
                        {pins.length === 0 ? (
                            <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-center p-8">
                                <MapIcon className="text-slate-600 mb-4" size={56} strokeWidth={1} />
                                <h3 className="text-xl font-semibold text-slate-300 mb-2">No projects with coordinates</h3>
                                <p className="text-slate-500 max-w-sm mb-6">Add latitude and longitude to your projects to see them on the map.</p>
                                <Link
                                    href="/projects/new"
                                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    Create Project
                                </Link>
                            </div>
                        ) : (
                            <MapWrapper projects={pins} />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
