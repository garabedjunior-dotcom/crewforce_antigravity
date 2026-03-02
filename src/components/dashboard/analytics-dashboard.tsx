"use client";

import { BarChart, DonutChart, Sparkline } from "./charts";

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
                {[
                    { label: "Total Projects", value: data.totalProjects.toString(), icon: "folder", color: "text-primary", bg: "bg-primary/10", trend: data.recentTrend },
                    { label: "Active Projects", value: data.activeProjects.toString(), icon: "play_circle", color: "text-emerald-500", bg: "bg-emerald-500/10", trend: null },
                    { label: "Total Workers", value: data.totalWorkers.toString(), icon: "groups", color: "text-blue-500", bg: "bg-blue-500/10", trend: null },
                    { label: "Daily Logs", value: data.totalLogs.toString(), icon: "feed", color: "text-violet-500", bg: "bg-violet-500/10", trend: data.recentTrend },
                    { label: "Total Budget", value: data.totalBudget > 0 ? `$${(data.totalBudget / 1000).toFixed(0)}k` : "$0", icon: "payments", color: "text-amber-500", bg: "bg-amber-500/10", trend: null },
                ].map((card, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:-translate-y-0.5 transition-transform">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{card.label}</p>
                            <div className={`size-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-lg ${card.color}`}>{card.icon}</span>
                            </div>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{card.value}</p>
                        {card.trend && card.trend.length > 1 && (
                            <div className="mt-2">
                                <Sparkline data={card.trend} color={card.color.includes("primary") ? "#f97316" : "#8b5cf6"} height={30} />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Logs by Day */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Log Activity</h3>
                            <p className="text-xs text-slate-500">Logs submitted per day (last 7 days)</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">bar_chart</span>
                    </div>
                    {data.logsByDay.length > 0 ? (
                        <BarChart data={data.logsByDay} height={180} />
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">No daily log data yet</div>
                    )}
                </div>

                {/* Project Status Donut */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Status</h3>
                            <p className="text-xs text-slate-500">Distribution by status</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">donut_small</span>
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
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Logs per Project</h3>
                            <p className="text-xs text-slate-500">Report volume by project</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">leaderboard</span>
                    </div>
                    {data.logsByProject.length > 0 ? (
                        <div className="space-y-3">
                            {data.logsByProject.map((proj, i) => {
                                const maxLogs = Math.max(...data.logsByProject.map(p => p.value), 1);
                                return (
                                    <div key={i} className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{proj.label}</span>
                                            <span className="text-sm font-bold text-primary">{proj.value}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
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
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Worker Activity</h3>
                            <p className="text-xs text-slate-500">Most active team members</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-400">trending_up</span>
                    </div>
                    {data.workerActivity.length > 0 ? (
                        <div className="space-y-3">
                            {data.workerActivity.map((worker, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{worker.name}</p>
                                        <p className="text-xs text-slate-500">Last active: {worker.lastActive}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-black text-primary">{worker.logs}</p>
                                        <p className="text-[10px] text-slate-500 font-semibold uppercase">Logs</p>
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
