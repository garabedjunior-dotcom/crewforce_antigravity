import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { EditProjectModal } from "@/components/dashboard/edit-project-modal";
import { Metadata } from "next";

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
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{project.name}</span>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <FadeIn delay={0.1} className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{project.status}</span>
                                        <span className="text-xs text-slate-400 font-medium">ID: {project.id.slice(-5).toUpperCase()}</span>
                                    </div>
                                    <h1 className="text-4xl font-black text-slate-900 dark:text-white">{project.name}</h1>
                                    <p className="text-slate-500 mt-1">{project.location || "Location not specified."}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Link href={`/projects/${project.id}/rates`} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">payments</span>
                                        Team & Rates
                                    </Link>
                                    <EditProjectModal project={project} />
                                    <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-primary/90 transition-colors">Review {project.dailyLogs.length} Logs</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Daily Logs", val: project.dailyLogs.length.toString(), sub: "reports", icon: "feed", trend: project.dailyLogs.length > 0 ? "Active" : "No logs yet" },
                                    { label: "Budget", val: project.budget ? `$${(project.budget / 1000).toFixed(0)}k` : "N/A", sub: "", icon: "payments", trend: project.budget ? "Tracked" : "Not set" },
                                    { label: "Crew Size", val: project.crews.length.toString(), sub: "Active", icon: "groups", trend: project.crews.length > 0 ? "Assigned" : "No crews" },
                                    { label: "Deadline", val: project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "N/A", sub: "", icon: "event", trend: project.deadline ? `${Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days left` : "Not set" }
                                ].map((card, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:-translate-y-1 transition-transform">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-slate-500 text-[10px] font-bold uppercase">{card.label}</p>
                                            <span className="material-symbols-outlined text-primary">{card.icon}</span>
                                        </div>
                                        <p className="text-2xl font-bold">{card.val} <span className="text-sm font-normal text-slate-400">{card.sub}</span></p>
                                        <p className="text-green-600 text-xs font-bold mt-1">{card.trend}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-6">Task Progress Breakdown (Demo)</h2>
                                <div className="space-y-6">
                                    {[
                                        { label: "Trenching", progress: 85, detail: "10,200 ft of 12,000 ft" },
                                        { label: "Directional Boring", progress: 63, detail: "4,100 ft of 6,500 ft" },
                                        { label: "Fiber Splicing", progress: 20, detail: "24 nodes of 120 nodes" }
                                    ].map((task, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="font-bold">{task.label}</p>
                                                    <p className="text-xs text-slate-500">{task.detail}</p>
                                                </div>
                                                <p className="text-primary font-black">{task.progress}%</p>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                                                <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: `${task.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">feed</span>
                                    Recent Daily Logs
                                </h2>
                                {project.dailyLogs.length === 0 ? (
                                    <div className="text-center py-12 text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                                        No logs submitted yet via Telegram.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {project.dailyLogs.map((log: { id: string, description: string, dateReported: Date, imageUrls: string[], worker: { name: string | null } }) => (
                                            <div key={log.id} className="border-l-2 border-primary/30 pl-4 py-2 relative">
                                                <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-3"></div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <span className="font-bold text-slate-900 dark:text-white">{log.worker?.name || "Unknown Worker"}</span>
                                                        <span className="text-xs text-slate-500 ml-2">via Telegram Bot</span>
                                                    </div>
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
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
                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold">Project Schematic</h3>
                                    <button className="material-symbols-outlined text-slate-400 hover:text-slate-600 transition-colors">fullscreen</button>
                                </div>
                                <div className="flex-1 bg-slate-50 relative overflow-hidden group">
                                    <img src="https://images.unsplash.com/photo-1541888081604-5f56ac01bd15?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Map schematic" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-4 h-4 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                                <h3 className="font-bold mb-4">Active Crews</h3>
                                {project.crews.length === 0 ? (
                                    <div className="text-sm text-slate-500 text-center py-4">No active crews assigned.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {project.crews.map((crew: { id: string, name: string, description: string | null }) => (
                                            <div key={crew.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary/30 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                        {crew.name.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">{crew.name}</p>
                                                        <p className="text-[10px] text-slate-500">{crew.description || "On Site"}</p>
                                                    </div>
                                                </div>
                                                <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
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
