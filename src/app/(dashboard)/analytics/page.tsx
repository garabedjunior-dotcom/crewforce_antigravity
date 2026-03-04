import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { FadeIn } from "@/components/ui/fade-in";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
    // Fetch all data in parallel
    const [projects, workers, dailyLogs, crews] = await Promise.all([
        prisma.project.findMany({ include: { crews: true, dailyLogs: true } }),
        prisma.user.findMany({ where: { role: { in: ['WORKER', 'MANAGER', 'ADMIN'] } } }),
        prisma.dailyLog.findMany({
            include: { worker: true, project: true },
            orderBy: { dateReported: 'desc' },
        }),
        prisma.crew.findMany(),
    ]);

    // Summary stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
    const totalWorkers = workers.length;
    const totalLogs = dailyLogs.length;
    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

    // Logs by day (last 7 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const last7Days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = dailyLogs.filter(log => {
            const logDate = new Date(log.dateReported);
            return logDate >= date && logDate < nextDate;
        }).length;

        last7Days.push({
            label: dayNames[date.getDay()],
            value: count,
        });
    }

    // Project status breakdown
    const projectStatusBreakdown = [
        { label: "Active", value: projects.filter(p => p.status === 'ACTIVE').length, color: "#10b981" },
        { label: "Delayed", value: projects.filter(p => p.status === 'DELAYED').length, color: "#f59e0b" },
        { label: "Completed", value: projects.filter(p => p.status === 'COMPLETED').length, color: "#3b82f6" },
    ].filter(s => s.value > 0);

    // Logs per project
    const logsByProject = projects
        .map(p => ({
            label: p.name,
            value: p.dailyLogs.length,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

    // Worker activity (top 5 by log count)
    const workerLogCounts = new Map<string, { name: string; logs: number; lastActive: Date }>();
    dailyLogs.forEach(log => {
        const existing = workerLogCounts.get(log.workerId);
        if (existing) {
            existing.logs++;
            if (new Date(log.dateReported) > existing.lastActive) {
                existing.lastActive = new Date(log.dateReported);
            }
        } else {
            workerLogCounts.set(log.workerId, {
                name: log.worker.name || "Unknown",
                logs: 1,
                lastActive: new Date(log.dateReported),
            });
        }
    });

    const workerActivity = Array.from(workerLogCounts.values())
        .sort((a, b) => b.logs - a.logs)
        .slice(0, 5)
        .map(w => ({
            name: w.name,
            logs: w.logs,
            lastActive: w.lastActive.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }));

    // Recent trend (last 14 days of daily log counts for sparkline)
    const recentTrend: number[] = [];
    for (let i = 13; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        const count = dailyLogs.filter(log => {
            const logDate = new Date(log.dateReported);
            return logDate >= date && logDate < nextDate;
        }).length;
        recentTrend.push(count);
    }

    const analyticsData = {
        totalProjects,
        activeProjects,
        totalWorkers,
        totalLogs,
        totalBudget,
        logsByDay: last7Days,
        projectStatusBreakdown,
        logsByProject,
        workerActivity,
        recentTrend,
        crewDistribution: crews.map((c, i) => ({
            label: c.name,
            value: 1,
            color: ["#f97316", "#3b82f6", "#10b981", "#8b5cf6"][i % 4],
        })),
    };

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Analytics" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8">
                <div className="max-w-[1440px] mx-auto space-y-6">
                    <FadeIn delay={0.1}>
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Analytics</h1>
                                <p className="text-slate-500 mt-1">Overview of workforce operations, project performance, and activity trends.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Live Data</span>
                            </div>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.15}>
                        <AnalyticsDashboard data={analyticsData} />
                    </FadeIn>
                </div>
            </div>
        </main>
    );
}
