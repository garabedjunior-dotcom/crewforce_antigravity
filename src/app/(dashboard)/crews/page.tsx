import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { WorkerDirectoryTable } from "@/components/dashboard/worker-directory-table";
import { Users, UserPlus, HardHat, Send, Pickaxe } from "lucide-react";
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
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">Crews & Personnel</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage active teams, project assignments, and field workers.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 shrink-0">
                            <Link href="/crews/new-worker" className="glass-card text-slate-700 dark:text-text-primary px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 hover:border-brand/30">
                                <UserPlus size={18} strokeWidth={2.5} />
                                Add Worker
                            </Link>
                            <NewCrewDialog projects={projects} />
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "Total Personnel", value: workers.length, icon: HardHat, iconBg: "bg-slate-100 dark:bg-white/5", iconColor: "text-slate-400 group-hover:text-brand" },
                            { label: "Active Crews", value: crews.length, icon: Users, iconBg: "bg-amber-500/10", iconColor: "text-amber-500" },
                            { label: "Telegram Active", value: workers.filter((w: { telegramChatId: string | null }) => w.telegramChatId).length, icon: Send, iconBg: "bg-blue-500/10", iconColor: "text-blue-500" }
                        ].map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <div key={i} className="glass-card group hover:-translate-y-1 hover:shadow-glow hover:border-brand/40 p-5 transition-all duration-300 relative overflow-hidden flex items-center justify-between">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative">
                                        <p className="text-slate-500 dark:text-text-secondary text-[11px] font-medium uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                                    </div>
                                    <div className="relative size-9 rounded-lg bg-slate-100 dark:bg-neutral-bg3 flex items-center justify-center shrink-0">
                                        <Icon className={`${stat.iconColor} transition-colors`} size={22} strokeWidth={2.5} />
                                    </div>
                                </div>
                            );
                        })}
                    </FadeIn>

                    <div className="space-y-8">
                        {/* Field Crews */}
                        <FadeIn delay={0.2} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Users className="text-brand" size={24} strokeWidth={2.5} /> Field Crews
                                </h3>
                            </div>
                            {crews.length === 0 ? (
                                <div className="glass-card text-center py-16 flex flex-col items-center">
                                    <Users className="text-slate-300 dark:text-slate-600 mb-4" size={48} strokeWidth={1} />
                                    <p className="text-slate-500 dark:text-text-secondary font-medium">No crews created yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {crews.map((crew: { id: string, name: string, description: string | null, members: any[], project: { name: string } | null }) => (
                                        <div key={crew.id} className="glass-card group p-4 flex flex-col hover:-translate-y-1 hover:shadow-glow hover:border-brand/40 transition-all duration-300 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="relative flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="size-10 rounded-lg bg-brand-subtle text-brand flex items-center justify-center font-semibold text-sm uppercase shrink-0 shadow-sm border border-brand/20">
                                                        {crew.name.substring(0, 2)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-medium text-slate-900 dark:text-text-primary text-base truncate group-hover:text-brand transition-colors">{crew.name}</h4>
                                                        <p className="text-xs text-slate-500 dark:text-text-muted font-medium truncate">{crew.description || "No description provided."}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-text-secondary px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border border-slate-200 dark:border-white/10 shadow-sm">
                                                        {crew.members.length} Members
                                                    </span>
                                                    <DeleteCrewButton crewId={crew.id} crewName={crew.name} />
                                                </div>
                                            </div>

                                            <div className="relative border-t border-slate-100 dark:border-white/5 pt-4 mt-auto">
                                                <p className="text-[10px] font-medium text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1 group-hover:text-amber-500/80 transition-colors">
                                                    <Pickaxe size={12} />
                                                    Current Assignment
                                                </p>
                                                {crew.project ? (
                                                    <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-neutral-bg3 px-3 py-2.5 rounded-lg border border-slate-100 dark:border-border-default w-fit shadow-sm">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                                                        <span className="font-medium text-slate-700 dark:text-text-primary">{crew.project.name}</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-sm dark:bg-amber-500/10 px-3 py-2.5 rounded-lg border border-amber-100 dark:border-amber-500/20 w-fit backdrop-blur-sm">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                                        <span className="font-medium text-amber-700 dark:text-amber-400">Unassigned - Idle</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FadeIn>

                        {/* Personnel Directory */}
                        <FadeIn delay={0.25} className="glass-card overflow-hidden">
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
                        </FadeIn>
                    </div>

                </div>
            </div>
        </main>
    );
}
