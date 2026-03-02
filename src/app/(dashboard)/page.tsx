import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { Folder, Users, HardHat, FileText, Pickaxe, MapPin, Activity, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const [activeProjects, totalCrews, pendingLogs, totalWorkers, projects, recentLogs] = await Promise.all([
        prisma.project.count({ where: { status: "ACTIVE" } }),
        prisma.crew.count(),
        prisma.dailyLog.count(),
        prisma.user.count({ where: { role: { in: ["WORKER", "MANAGER"] } } }),
        prisma.project.findMany({
            take: 4,
            orderBy: { updatedAt: "desc" },
            include: { crews: true, dailyLogs: { take: 1, orderBy: { dateReported: "desc" } } },
        }),
        prisma.dailyLog.findMany({
            take: 5,
            orderBy: { dateReported: "desc" },
            include: { worker: true, project: true },
        }),
    ]);

    const totalBudget = (await prisma.project.aggregate({ _sum: { budget: true } }))._sum.budget || 0;

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Admin Center" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8 flex gap-6 md:gap-8">
                <div className="flex-1 min-w-0">
                    <FadeIn delay={0.1} className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Overview — Today</h2>
                        <p className="text-slate-500 font-medium mt-1.5 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Live system tracking active deployments across all regions.
                        </p>
                    </FadeIn>

                    {/* KPI Cards */}
                    <FadeIn delay={0.15} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: "Active Projects", value: activeProjects, sub: "Live", subColor: "text-emerald-500", icon: Folder, iconBg: "bg-primary/10", iconColor: "text-primary" },
                            { label: "Total Crews", value: totalCrews, sub: "In field", subColor: "text-blue-500", icon: Users, iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
                            { label: "Workers", value: totalWorkers, sub: "Registered", subColor: "text-violet-500", icon: HardHat, iconBg: "bg-violet-500/10", iconColor: "text-violet-500" },
                            { label: "Daily Logs", value: pendingLogs, sub: "Received", subColor: "text-amber-500", icon: FileText, iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
                        ].map((card, i) => {
                            const Icon = card.icon;
                            return (
                                <div key={i} className="group bg-white/70 dark:bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-white/40 dark:from-white/5 to-transparent rounded-full -mr-10 -mt-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
                                        <div className={`size-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                                            <Icon className={card.iconColor} size={18} strokeWidth={2.5} />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <h3 className="text-3xl font-black text-slate-900 dark:text-white drop-shadow-sm">{card.value}</h3>
                                        <span className={`${card.subColor} text-xs font-bold mb-1.5`}>{card.sub}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </FadeIn>

                    {/* Project Progress */}
                    <FadeIn delay={0.2} className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Pickaxe className="text-primary" size={20} strokeWidth={2.5} />
                                Active Operations
                            </h3>
                            <Link href="/projects" className="text-primary text-sm font-bold hover:underline flex items-center gap-1 group">
                                View All
                                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {projects.length === 0 ? (
                            <div className="bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 backdrop-blur-xl p-16 text-center rounded-3xl flex flex-col items-center shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.02] bg-[size:32px_32px]"></div>
                                <Pickaxe className="text-slate-300 dark:text-slate-600 mb-4" size={56} strokeWidth={1} />
                                <h4 className="text-slate-900 dark:text-white font-black text-xl z-10">No active projects yet</h4>
                                <p className="text-slate-500 text-sm mt-2 max-w-sm z-10">Create your first infrastructure project to start deploying crews and tracking daily logs.</p>
                                <Link href="/projects/new" className="mt-8 bg-primary text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 z-10">
                                    <Folder size={18} />
                                    Initialize Project
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((project, index) => {
                                    const colors = ["from-orange-500 to-amber-500", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500", "from-violet-500 to-purple-500"];
                                    const colorIndex = index % colors.length;
                                    const lastLog = project.dailyLogs[0];
                                    return (
                                        <Link href={`/projects/${project.id}`} key={project.id} className="bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col sm:flex-row sm:items-center p-4 gap-5 group hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(255,102,0,0.08)] cursor-pointer">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center shrink-0 shadow-lg shadow-black/10 relative overflow-hidden`}>
                                                <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="text-white text-2xl font-black relative z-10">{project.name.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2.5 mb-1.5">
                                                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${project.status === 'ACTIVE' ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30' : project.status === 'DELAYED' ? 'bg-amber-100/80 text-amber-700 border border-amber-200' : 'bg-blue-100/80 text-blue-700 border border-blue-200'}`}>{project.status}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                        <MapPin size={10} />
                                                        {project.location || "No locale"}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{project.name}</h4>
                                                <p className="text-xs text-slate-500 truncate font-medium mt-0.5">{project.crews.length} crew{project.crews.length !== 1 ? 's' : ''} deployed on site</p>
                                            </div>
                                            <div className="sm:text-right shrink-0 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Latest Intelligence</p>
                                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 sm:justify-end">
                                                    <Activity size={14} className={lastLog ? 'text-primary' : 'text-slate-400'} />
                                                    {lastLog ? new Date(lastLog.dateReported).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : "No logs available"}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </FadeIn>
                </div>

                {/* Recent Activity Sidebar */}
                <FadeIn delay={0.25} direction="left" className="w-[320px] shrink-0 hidden xl:block">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.15)] p-6 sticky top-28">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"></div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Activity className="text-primary" size={20} strokeWidth={2.5} />
                            Live Feed
                        </h3>
                        {recentLogs.length === 0 ? (
                            <div className="text-center py-10 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                                <Activity className="text-slate-300 dark:text-slate-600 mx-auto mb-3" size={32} />
                                <p className="text-slate-500 font-medium text-sm">Awaiting field intelligence...</p>
                                <p className="text-slate-400 text-xs mt-1 px-4">Daily logs from Telegram will appear here in real-time.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentLogs.map((log) => (
                                    <Link href={`/projects/${log.projectId}`} key={log.id} className="flex items-start gap-3.5 p-3 -mx-3 rounded-2xl hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all duration-200 group border border-transparent hover:border-slate-100 dark:hover:border-white/5 cursor-pointer">
                                        <div className="size-10 rounded-xl bg-gradient-to-br from-primary/10 to-orange-500/10 dark:from-primary/20 dark:to-orange-500/20 flex items-center justify-center shrink-0 border border-primary/10">
                                            <FileText className="text-primary group-hover:scale-110 transition-transform" size={16} strokeWidth={2.5} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate group-hover:text-primary transition-colors">{log.worker.name}</p>
                                            <p className="text-[11px] text-slate-500 truncate font-medium mt-0.5 flex items-center gap-1">
                                                <Folder size={10} />
                                                {log.project.name}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold mt-1.5 bg-slate-100 dark:bg-white/5 inline-block px-1.5 py-0.5 rounded-md">
                                                {new Date(log.dateReported).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <button className="w-full mt-6 py-2.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors tracking-wider uppercase">View All History</button>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
