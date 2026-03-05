import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { EditProjectModal } from "@/components/dashboard/edit-project-modal";
import { MapWrapper } from "@/components/dashboard/map-wrapper";
import { Metadata } from "next";
import { ChevronRight, Wallet, FileText, Users, CalendarDays, Clock, Maximize2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { id: params.id },
        select: { name: true, location: true },
    });

    if (!project) {
        return { title: "Project Not Found | CrewForce" };
    }

    return {
        title: `${project.name} | CrewForce`,
        description: `Project details for ${project.name}${project.location ? ` — ${project.location}` : ""}`,
    };
}

export default async function ProjectDetailsPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const project = await prisma.project.findUnique({
        where: { id: params.id },
        include: {
            crews: true,
            dailyLogs: {
                orderBy: { dateReported: "desc" },
                include: { worker: true }
            }
        }
    });

    if (!project) {
        notFound();
    }

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Project Details" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8">
                <div className="max-w-[1440px] mx-auto">

                    {/* Breadcrumbs */}
                    <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/" className="hover:text-primary transition-colors">Dashboard</Link>
                        <ChevronRight size={14} className="text-slate-400" />
                        <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">{project.name}</span>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <FadeIn delay={0.1} className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase">{project.status}</span>
                                        <span className="text-xs text-slate-400 font-medium">ID: {project.id.slice(-5).toUpperCase()}</span>
                                    </div>
                                    <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{project.name}</h1>
                                    <p className="text-slate-500 mt-1">{project.location || "Location not specified."}</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Link href={`/projects/${project.id}/rates`} className="glass-card text-slate-700 dark:text-text-primary px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 hover:border-brand/30 transition-all flex items-center gap-2">
                                        <Wallet size={16} />
                                        Team & Rates
                                    </Link>
                                    <EditProjectModal project={project} />
                                    <button className="bg-brand text-white px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-brand-hover transition-colors">Review {project.dailyLogs.length} Logs</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Daily Logs", val: project.dailyLogs.length.toString(), sub: "reports", icon: FileText, trend: project.dailyLogs.length > 0 ? "Active" : "No logs yet" },
                                    { label: "Budget", val: project.budget ? `$${(project.budget / 1000).toFixed(0)}k` : "N/A", sub: "", icon: Wallet, trend: project.budget ? "Tracked" : "Not set" },
                                    { label: "Crew Size", val: project.crews.length.toString(), sub: "Active", icon: Users, trend: project.crews.length > 0 ? "Assigned" : "No crews" },
                                    { label: "Deadline", val: project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A", sub: "", icon: CalendarDays, trend: project.deadline ? `${Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left` : "Not set" }
                                ].map((card, i) => {
                                    const CardIcon = card.icon;
                                    return (
                                        <div key={i} className="glass-card group p-5 hover:-translate-y-1 hover:shadow-glow hover:border-brand/40 transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative flex items-center justify-between mb-2">
                                                <p className="text-slate-500 dark:text-text-secondary text-[11px] font-medium uppercase tracking-wider">{card.label}</p>
                                                <CardIcon className="text-brand" size={20} />
                                            </div>
                                            <p className="relative text-2xl font-bold dark:text-white">{card.val} <span className="text-sm font-normal text-slate-400 dark:text-text-muted">{card.sub}</span></p>
                                            <p className="relative text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-1">{card.trend}</p>
                                        </div>
                                    );
                                })}
                            </div>


                            <div className="glass-card p-6 border-slate-200 dark:border-border-default shadow-sm">
                                <h2 className="text-lg text-slate-900 dark:text-white font-semibold mb-6 flex items-center gap-2">
                                    <FileText className="text-brand" size={18} />
                                    Recent Daily Logs
                                </h2>
                                {project.dailyLogs.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500 dark:text-text-muted bg-slate-50 dark:bg-white/5 rounded-lg border border-dashed border-slate-200 dark:border-border-strong">
                                        No logs submitted yet via Telegram.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {project.dailyLogs.map((log: { id: string, description: string, dateReported: Date, imageUrls: string[], worker: { name: string | null } }) => (
                                            <div key={log.id} className="border-l-2 border-brand/30 pl-4 py-2 relative">
                                                <div className="absolute w-3 h-3 bg-brand shadow-[0_0_8px_rgba(255,102,0,0.6)] rounded-full -left-[7px] top-3"></div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{log.worker?.name || "Unknown Worker"}</span>
                                                        <span className="text-xs text-slate-500 ml-2">via Telegram Bot</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {new Date(log.dateReported).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap mt-2">{log.description}</p>
                                                {log.imageUrls && log.imageUrls.length > 0 && (
                                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                                        {log.imageUrls.map((url: string, idx: number) => (
                                                            <img key={idx} src={url} alt="Log attachment" className="h-24 w-auto object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3} direction="left" className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <div className="glass-card shadow-sm overflow-hidden flex flex-col h-[400px]">
                                <div className="p-4 border-b border-slate-100 dark:border-border-default flex justify-between items-center relative z-10 bg-white/50 dark:bg-transparent backdrop-blur-md">
                                    <h3 className="font-semibold">Project Schematic</h3>
                                    {project.latitude && project.longitude && (
                                        <Link href="/map" className="text-slate-400 hover:text-slate-600 transition-colors"><Maximize2 size={16} /></Link>
                                    )}
                                </div>
                                <div className="flex-1 bg-slate-50 dark:bg-slate-900 relative group z-0">
                                    {(project.latitude && project.longitude) ? (
                                        <div className="w-full h-full relative z-0">
                                            <MapWrapper projects={[{
                                                id: project.id,
                                                name: project.name,
                                                location: project.location,
                                                status: project.status,
                                                latitude: project.latitude,
                                                longitude: project.longitude,
                                                crewCount: project.crews.length,
                                                logCount: project.dailyLogs.length
                                            }]} />
                                        </div>
                                    ) : (
                                        <>
                                            <img src="https://images.unsplash.com/photo-1541888081604-5f56ac01bd15?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Map schematic" />
                                            <div className="absolute inset-0 flex items-center justify-center flex-col bg-black/50 text-white">
                                                <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 mb-3"></div>
                                                <span className="text-sm font-bold text-center px-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">No coordinates set.<br />Edit project to add them.</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="glass-card p-5 shadow-sm border-slate-200 dark:border-border-default">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Active Crews</h3>
                                {project.crews.length === 0 ? (
                                    <div className="text-sm text-slate-500 dark:text-text-secondary text-center py-4">No active crews assigned.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {project.crews.map((crew: { id: string, name: string, description: string | null }) => (
                                            <div key={crew.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 cursor-pointer hover:border-brand/30 dark:hover:border-brand/30 hover:shadow-glow transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-lg bg-brand-subtle text-brand border border-brand/20 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                                                        {crew.name.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{crew.name}</p>
                                                        <p className="text-[10px] text-slate-500">{crew.description || "On Site"}</p>
                                                    </div>
                                                </div>
                                                <div className="size-2 rounded-full bg-green-500"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </main>
    );
}
