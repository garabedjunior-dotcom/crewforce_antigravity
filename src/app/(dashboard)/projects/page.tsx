import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { Folder, PlayCircle, CheckCircle, CircleDollarSign, Plus, Construction, MapPin, Users, FileText, CalendarClock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        include: {
            crews: true,
            dailyLogs: true,
        },
        orderBy: { updatedAt: 'desc' }
    });

    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
    const activeCount = projects.filter(p => p.status === 'ACTIVE').length;
    const completedCount = projects.filter(p => p.status === 'COMPLETED').length;

    const statusStyles: Record<string, string> = {
        ACTIVE: "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30",
        DELAYED: "bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
        COMPLETED: "bg-blue-100/80 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30",
    };

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Project Management" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8">
                <div className="max-w-[1440px] mx-auto space-y-8">

                    <FadeIn delay={0.1} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Active Operations</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage infrastructure deployments, track progress, and budgets.</p>
                        </div>
                        <Link
                            href="/projects/new"
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 shrink-0"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            Deploy New Operation
                        </Link>
                    </FadeIn>

                    <FadeIn delay={0.15} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: "Total Projects", value: projects.length, icon: Folder, iconBg: "bg-slate-100 dark:bg-white/5", iconColor: "text-slate-400", sub: "All time" },
                            { label: "Active Sites", value: activeCount, icon: PlayCircle, iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500", sub: "Live now" },
                            { label: "Completed", value: completedCount, icon: CheckCircle, iconBg: "bg-blue-500/10", iconColor: "text-blue-500", sub: "Delivered" },
                            { label: "Total Budget", value: totalBudget > 0 ? `$${(totalBudget / 1000).toFixed(0)}k` : "$0", icon: CircleDollarSign, iconBg: "bg-amber-500/10", iconColor: "text-amber-500", sub: "Allocated" }
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="glass-card group p-5 hover:-translate-y-1 hover:shadow-glow hover:border-brand/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative flex items-center justify-between mb-4">
                                        <p className="text-slate-500 dark:text-text-secondary text-[11px] font-medium uppercase tracking-wider">{stat.label}</p>
                                        <div className="size-9 rounded-lg bg-slate-100 dark:bg-neutral-bg3 flex items-center justify-center">
                                            <Icon className={stat.iconColor} size={18} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="relative flex items-end gap-2">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                                        <span className={`text-slate-400 dark:text-text-muted text-xs font-medium mb-1.5`}>{stat.sub}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </FadeIn>

                    {projects.length === 0 ? (
                        <div className="glass-card border-dashed p-16 text-center flex flex-col items-center mt-8">
                            <Construction className="text-slate-300 dark:text-slate-600 mb-4" size={56} strokeWidth={1} />
                            <h4 className="text-slate-900 dark:text-white font-semibold text-lg">No active operations</h4>
                            <p className="text-slate-500 dark:text-text-secondary text-sm mt-2 max-w-sm">Create your first infrastructure project to start deploying crews and tracking daily logs.</p>
                            <Link href="/projects/new" className="mt-8 bg-brand text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-hover transition-colors inline-flex items-center gap-2">
                                <Plus size={18} strokeWidth={2.5} />
                                Initialize Project
                            </Link>
                        </div>
                    ) : (
                        <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {projects.map((project, index) => {
                                const colors = ["from-orange-500 to-amber-500", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500", "from-violet-500 to-purple-500"];
                                const colorIndex = index % colors.length;
                                return (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="group glass-card hover:-translate-y-1 hover:shadow-glow hover:border-brand/40 transition-all duration-300 relative overflow-hidden flex flex-col"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        {/* Card Header */}
                                        <div className="relative p-5 flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4 min-w-0 pr-2">
                                                    <div className={`size-12 rounded-2xl bg-gradient-to-br ${colors[colorIndex]} text-white flex items-center justify-center font-black text-xl uppercase shadow-lg shadow-black/10 shrink-0`}>
                                                        {project.name.substring(0, 2)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-bold text-slate-900 dark:text-text-primary group-hover:text-brand transition-colors text-lg truncate">
                                                            {project.name}
                                                        </h3>
                                                        {project.clientName && (
                                                            <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                                                                <Users size={12} className="text-slate-400" />
                                                                {project.clientName}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 ${statusStyles[project.status] || "bg-slate-100 text-slate-600"}`}>
                                                    {project.status}
                                                </span>
                                            </div>

                                            {project.location && (
                                                <p className="text-xs font-medium text-slate-500 dark:text-text-muted flex items-center gap-1 mb-2 bg-slate-50 dark:bg-neutral-bg3 inline-flex px-2 py-1 rounded-md border border-slate-100 dark:border-border-default shadow-sm">
                                                    <MapPin size={12} className="text-slate-400 group-hover:text-brand transition-colors" />
                                                    {project.location}
                                                </p>
                                            )}

                                            {project.description && (
                                                <p className="text-sm text-slate-500 dark:text-text-secondary line-clamp-2 mt-3 font-medium leading-relaxed">{project.description}</p>
                                            )}
                                        </div>

                                        {/* Card Footer */}
                                        <div className="relative px-6 py-3 flex items-center justify-between bg-slate-50 dark:bg-neutral-bg3 border-t border-slate-100 dark:border-border-default">
                                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-text-muted font-bold">
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} className="text-slate-400" />
                                                    {project.crews.length} <span className="hidden sm:inline">Crew{project.crews.length !== 1 ? 's' : ''}</span>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FileText size={14} className="text-slate-400" />
                                                    {project.dailyLogs.length} <span className="hidden sm:inline">Log{project.dailyLogs.length !== 1 ? 's' : ''}</span>
                                                </span>
                                            </div>
                                            {project.deadline && (
                                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <CalendarClock size={12} />
                                                    {new Date(project.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                )
                            })}
                        </FadeIn>
                    )}

                </div>
            </div>
        </main>
    );
}
