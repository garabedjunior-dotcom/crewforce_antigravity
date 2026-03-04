"use client";

import { useState } from "react";
import { WorkerSettingsModal } from "./worker-settings-modal";
import { Check, Clock, Settings2 } from "lucide-react";

type Crew = {
    id: string;
    name: string;
};

type Worker = {
    id: string;
    name: string | null;
    email?: string | null;
    role: string;
    employeeType: string;
    baseHourlyRate: number;
    dailyRate: number;
    otMultiplier: number;
    minHourlyGuarantee: boolean;
    minDailyGuarantee: boolean;
    pieceRateEnabled: boolean;
    crewId: string | null;
    telegramChatId: string | null;
    jobTitle: string | null;
    crew: Crew | null;
};

interface WorkerDirectoryTableProps {
    workers: Worker[];
    crews: Crew[];
}

export function WorkerDirectoryTable({ workers, crews }: WorkerDirectoryTableProps) {
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    return (
        <>
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border-collapse whitespace-nowrap">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/80 sticky top-0 backdrop-blur-md z-10 border-b border-slate-200/50 dark:border-slate-700/50">
                        <tr className="text-[10px] uppercase font-black text-slate-500 tracking-wider">
                            <th className="px-5 py-4">Name</th>
                            <th className="px-5 py-4">Role</th>
                            <th className="px-5 py-4">Crew</th>
                            <th className="px-5 py-4 text-center">Telegram</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                        {workers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">No personnel registered yet.</td>
                            </tr>
                        ) : (
                            workers.map((worker) => (
                                <tr key={worker.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                    <td className="px-5 py-3 font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{worker.name || "Unnamed"}</td>
                                    <td className="px-5 py-3">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white text-sm font-bold">{worker.jobTitle || "Not Specified"}</span>
                                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{worker.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[10px] font-black uppercase truncate max-w-[120px] inline-block border border-slate-200 dark:border-slate-700">
                                            {worker.crew?.name || "Unassigned"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        {worker.telegramChatId ? (
                                            <span className="bg-emerald-100/80 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 size-7 rounded-full inline-flex items-center justify-center border border-emerald-200 dark:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]" title={`Connected: ${worker.telegramChatId}`}>
                                                <Check size={14} strokeWidth={3} />
                                            </span>
                                        ) : (
                                            <span className="bg-amber-100/80 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 size-7 rounded-full inline-flex items-center justify-center border border-amber-200 dark:border-amber-500/30" title="Pending Connection">
                                                <Clock size={14} strokeWidth={3} />
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <button
                                            onClick={() => setSelectedWorker(worker)}
                                            className="text-[11px] font-black uppercase tracking-wider px-3.5 py-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white rounded-lg transition-all border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary flex items-center gap-1.5 ml-auto group-hover:shadow-[0_4px_12px_rgba(255,102,0,0.15)] hover:-translate-y-0.5"
                                        >
                                            <Settings2 size={12} strokeWidth={3} />
                                            Settings
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Render the robust settings modal if a worker is selected */}
            <WorkerSettingsModal
                worker={selectedWorker}
                crews={crews}
                isOpen={!!selectedWorker}
                onClose={() => setSelectedWorker(null)}
            />
        </>
    );
}
