import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { WorkerDirectoryTable } from "@/components/dashboard/worker-directory-table";
import { Users, UserPlus, HardHat, Send, Pickaxe, BadgeInfo } from "lucide-react";
import { DeleteCrewButton } from "@/components/dashboard/delete-crew-button";
import { NewCrewDialog } from "@/components/dashboard/new-crew-dialog";

export const dynamic = 'force-dynamic';

export default async function CrewsPage() {
    const crews = await prisma.crew.findMany({
        include: {
            members: true,
            project: true,
        },
        orderBy: { name: 'asc' }
    });

    const workers = await prisma.user.findMany({
        where: { role: { in: ['WORKER', 'MANAGER', 'ADMIN'] }, isActive: true },
        include: { crew: true },
        orderBy: { name: 'asc' }
    });

    // Fetch projects for the create crew dialog
    const projects = await prisma.project.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    });

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Workforce Management" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8">
                <div className="max-w-[1440px] mx-auto space-y-8">

                    <FadeIn delay={0.1} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Crews & Personnel</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage active teams, project assignments, and field workers.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 shrink-0">
                            <Link href="/crews/new-worker" className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 hover:shadow-md hover:-translate-y-0.5">
                                <UserPlus size={18} strokeWidth={2.5} />
                                Add Worker
                            </Link>
                            <NewCrewDialog projects={projects} />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "Total Personnel", value: workers.length, icon: HardHat, iconBg: "bg-slate-100 dark:bg-white/5", iconColor: "text-slate-400" },
                            { label: "Active Crews", value: crews.length, icon: Users, iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
                            { label: "Telegram Active", value: workers.filter((w: { telegramChatId: string | null }) => w.telegramChatId).length, icon: Send, iconBg: "bg-blue-500/10", iconColor: "text-blue-500" }
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="group bg-white/70 dark:bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] duration-300 relative overflow-hidden flex items-center justify-between">
                                    <div className="absolute top-0 right-0 p-16 bg-gradient-to-bl from-white/40 dark:from-white/5 to-transparent rounded-full -mr-10 -mt-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                                    <div>
                                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1 drop-shadow-sm">{stat.value}</p>
                                    </div>
                                    <div className={`size-12 rounded-2xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                                        <Icon className={stat.iconColor} size={22} strokeWidth={2.5} />
                                    </div>
                                </div>
                            );
                        })}
                    </FadeIn>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Crews List */}
                        <FadeIn delay={0.2} className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col h-[600px] relative">
                            <div className="p-6 border-b border-slate-100/50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <h3 className="font-black text-xl flex items-center gap-2 text-slate-900 dark:text-white"><Users className="text-primary" size={24} strokeWidth={2.5} /> Field Crews</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                                {crews.length === 0 ? (
                                    <div className="text-center py-16 flex flex-col items-center">
                                        <Users className="text-slate-300 dark:text-slate-600 mb-4" size={48} strokeWidth={1} />
                                        <p className="text-slate-500 font-medium">No crews created yet.</p>
                                    </div>
                                ) : (
                                    crews.map((crew: { id: string, name: string, description: string | null, members: any[], project: { name: string } | null }) => (
                                        <div key={crew.id} className="group border border-slate-200/60 dark:border-white/10 rounded-2xl p-5 hover:border-primary/30 dark:hover:border-primary/30 transition-all bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 hover:shadow-sm">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/10 to-orange-500/10 text-primary flex items-center justify-center font-black text-lg uppercase shadow-inner border border-primary/10 shrink-0">
                                                        {crew.name.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-primary transition-colors">{crew.name}</h4>
                                                        <p className="text-xs text-slate-500 font-medium">{crew.description || "No description provided."}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                                                        {crew.members.length} Members
                                                    </span>
                                                    <DeleteCrewButton crewId={crew.id} crewName={crew.name} />
                                                </div>
                                            </div>

                                            <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-2">
                                                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                                                    <Pickaxe size={12} />
                                                    Current Assignment
                                                </p>
                                                {crew.project ? (
                                                    <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-900/50 px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 w-fit">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">{crew.project.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm bg-amber-50 dark:bg-amber-900/10 px-3 py-2.5 rounded-xl border border-amber-100 dark:border-amber-900/30 w-fit">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                        <span className="font-bold text-amber-700 dark:text-amber-500">Unassigned - Idle</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </FadeIn>

                        {/* Workers List */}
                        <FadeIn delay={0.25} className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col h-[600px] relative">
                            <div className="p-6 border-b border-slate-100/50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                                <h3 className="font-black text-xl flex items-center gap-2 text-slate-900 dark:text-white"><BadgeInfo className="text-primary" size={24} strokeWidth={2.5} /> Personnel Directory</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto overflow-x-auto p-0 no-scrollbar relative w-[990px] xl:w-full">
                                <WorkerDirectoryTable
                                    workers={workers.map(w => ({
                                        id: w.id,
                                        name: w.name,
                                        email: w.email,
                                        role: w.role,
                                        employeeType: w.employeeType,
                                        baseHourlyRate: w.baseHourlyRate,
                                        dailyRate: w.dailyRate,
                                        otMultiplier: w.otMultiplier,
                                        minHourlyGuarantee: w.minHourlyGuarantee,
                                        minDailyGuarantee: w.minDailyGuarantee,
                                        pieceRateEnabled: w.pieceRateEnabled,
                                        crewId: w.crewId,
                                        telegramChatId: w.telegramChatId,
                                        jobTitle: w.jobTitle,
                                        crew: w.crew ? { id: w.crew.id, name: w.crew.name } : null,
                                    }))}
                                    crews={crews.map(c => ({ id: c.id, name: c.name }))}
                                />
                            </div>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </main>
    );
}
