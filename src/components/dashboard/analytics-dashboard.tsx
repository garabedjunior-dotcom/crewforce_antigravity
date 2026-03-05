"use client";

import { BarChart, DonutChart, Sparkline } from "./charts";
import { Folder, PlayCircle, Users, FileText, Wallet, BarChart3, PieChart, Trophy, TrendingUp, type LucideIcon } from "lucide-react";

interface AnalyticsData {
    // Summary stats
    totalProjects: number;
    activeProjects: number;
    totalWorkers: number;
    totalLogs: number;
    totalBudget: number;
    // Charts data
    logsByDay: { label: string; value: number }[];
    projectStatusBreakdown: { label: string; value: number; color: string }[];
    logsByProject: { label: string; value: number; color?: string }[];
    workerActivity: { name: string; logs: number; lastActive: string }[];
    recentTrend: number[];
    crewDistribution: { label: string; value: number; color: string }[];
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {([
                    { label: "Total Projects", value: data.totalProjects.toString(), icon: Folder, color: "text-primary", trend: data.recentTrend },
                    { label: "Active Projects", value: data.activeProjects.toString(), icon: PlayCircle, color: "text-emerald-500", trend: null },
                    { label: "Total Workers", value: data.totalWorkers.toString(), icon: Users, color: "text-blue-500", trend: null },
                    { label: "Daily Logs", value: data.totalLogs.toString(), icon: FileText, color: "text-violet-500", trend: data.recentTrend },
                    { label: "Total Budget", value: data.totalBudget > 0 ? `$${(data.totalBudget / 1000).toFixed(0)}k` : "$0", icon: Wallet, color: "text-amber-500", trend: null },
                ] as { label: string; value: string; icon: LucideIcon; color: string; trend: number[] | null }[]).map((card, i) => (
                    <div key={i} className="glass-card group p-5 hover:-translate-y-1 hover:shadow-glow hover:border-brand/40 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center justify-between mb-3">
                            <p className="text-slate-500 dark:text-text-secondary text-[11px] font-medium uppercase tracking-wider">{card.label}</p>
                            <div className="size-9 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-transparent dark:border-white/5">
                                <card.icon className={card.color.replace('text-primary', 'text-brand')} size={17} />
                            </div>
                        </div>
                        <p className="relative text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
                        {card.trend && card.trend.length > 1 && (
                            <div className="mt-2 relative">
                                <Sparkline data={card.trend} color={card.color.includes("primary") ? "#f97316" : "#8b5cf6"} height={30} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Logs by Day */}
                <div className="lg:col-span-2 glass-card p-6 shadow-sm border-slate-200 dark:border-border-default">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Daily Log Activity</h3>
                            <p className="text-xs text-slate-500 dark:text-text-secondary">Logs submitted per day (last 7 days)</p>
                        </div>
                        <BarChart3 className="text-slate-400 dark:text-text-muted" size={18} />
                    </div>
                    {data.logsByDay.length > 0 ? (
                        <BarChart data={data.logsByDay} height={180} />
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">No daily log data yet</div>
                    )}
                </div>

                {/* Project Status Donut */}
                <div className="glass-card p-6 shadow-sm border-slate-200 dark:border-border-default">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Project Status</h3>
                            <p className="text-xs text-slate-500 dark:text-text-secondary">Distribution by status</p>
                        </div>
                        <PieChart className="text-slate-400 dark:text-text-muted" size={18} />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <DonutChart
                            segments={data.projectStatusBreakdown}
                            centerValue={data.totalProjects.toString()}
                            centerLabel="Projects"
                        />
                        <div className="flex flex-wrap justify-center gap-3">
                            {data.projectStatusBreakdown.map((seg, i) => (
                                <div key={i} className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{seg.label} ({seg.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Logs per Project */}
                <div className="glass-card p-6 shadow-sm border-slate-200 dark:border-border-default">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Logs per Project</h3>
                            <p className="text-xs text-slate-500 dark:text-text-secondary">Report volume by project</p>
                        </div>
                        <Trophy className="text-slate-400 dark:text-text-muted" size={18} />
                    </div>
                    {data.logsByProject.length > 0 ? (
                        <div className="space-y-3">
                            {data.logsByProject.map((proj, i) => {
                                const maxLogs = Math.max(...data.logsByProject.map(p => p.value), 1);
                                return (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{proj.label}</span>
                                            <span className="text-sm font-bold text-brand">{proj.value}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-white/10 border border-transparent dark:border-white/5 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,102,0,0.5)]"
                                                style={{
                                                    width: `${(proj.value / maxLogs) * 100}%`,
                                                    background: "linear-gradient(90deg, #f97316, #f59e0b)",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No project data yet</div>
                    )}
                </div>

                {/* Worker Activity */}
                <div className="glass-card p-6 shadow-sm border-slate-200 dark:border-border-default">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Worker Activity</h3>
                            <p className="text-xs text-slate-500 dark:text-text-secondary">Most active team members</p>
                        </div>
                        <TrendingUp className="text-slate-400 dark:text-text-muted" size={18} />
                    </div>
                    {data.workerActivity.length > 0 ? (
                        <div className="space-y-3">
                            {data.workerActivity.map((worker, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-brand/30 dark:hover:border-brand/30 transition-all cursor-default">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-brand-subtle text-brand border border-brand/20 font-bold text-sm shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{worker.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-text-muted">Last active: {worker.lastActive}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-bold text-brand">{worker.logs}</p>
                                        <p className="text-[11px] text-slate-500 dark:text-text-muted font-semibold uppercase">Logs</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex items-center justify-center text-slate-400 text-sm">No worker activity yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}
