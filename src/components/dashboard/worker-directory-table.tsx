"use client";

import { useState, useMemo } from "react";
import { WorkerSettingsModal } from "./worker-settings-modal";
import { Check, Clock, Settings2, BadgeInfo, Search, X } from "lucide-react";

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
    const [searchQuery, setSearchQuery] = useState("");
    const [crewFilter, setCrewFilter] = useState<string>("all");

    const filteredWorkers = useMemo(() => {
        return workers.filter(w => {
            const matchesSearch = !searchQuery ||
                (w.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (w.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (w.role?.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesCrew = crewFilter === "all" ||
                (crewFilter === "unassigned" && !w.crewId) ||
                w.crewId === crewFilter;

            return matchesSearch && matchesCrew;
        });
    }, [workers, searchQuery, crewFilter]);

    return (
        <>
            {/* Header with search and filter */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
                        <BadgeInfo className="text-primary" size={24} strokeWidth={2.5} /> Personnel Directory
                    </h3>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        {filteredWorkers.length} of {workers.length} workers
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={2.5} />
                        <input
                            type="text"
                            placeholder="Search by name, role, or title..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-slate-400 transition-colors"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <select
                        value={crewFilter}
                        onChange={(e) => setCrewFilter(e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors sm:w-48"
                    >
                        <option value="all">All Crews</option>
                        <option value="unassigned">Unassigned</option>
                        {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
                        <tr className="text-[11px] uppercase font-medium text-slate-500 tracking-wider">
                            <th className="px-6 py-4 w-[30%]">Name</th>
                            <th className="px-6 py-4 w-[25%]">Role</th>
                            <th className="px-6 py-4 w-[20%]">Crew</th>
                            <th className="px-6 py-4 text-center w-[10%]">Telegram</th>
                            <th className="px-6 py-4 text-right w-[15%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {workers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-500 font-medium">No personnel registered yet.</td>
                            </tr>
                        ) : filteredWorkers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12">
                                    <Search className="text-slate-300 dark:text-slate-600 mx-auto mb-3" size={32} strokeWidth={1.5} />
                                    <p className="text-slate-500 font-medium">No workers match your search.</p>
                                    <button onClick={() => { setSearchQuery(""); setCrewFilter("all"); }} className="text-primary text-sm font-medium mt-2 hover:underline">
                                        Clear filters
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            filteredWorkers.map((worker) => (
                                <tr key={worker.id} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                {(worker.name || "??").substring(0, 2)}
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white truncate">
                                                {worker.name || "Unnamed"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 dark:text-white text-sm font-medium">{worker.jobTitle || "Not Specified"}</span>
                                            <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">{worker.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-medium uppercase truncate max-w-[120px] inline-block border border-slate-200 dark:border-slate-700">
                                            {worker.crew?.name || "Unassigned"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        {worker.telegramChatId ? (
                                            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 size-7 rounded-full inline-flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20" title={`Connected: ${worker.telegramChatId}`}>
                                                <Check size={14} strokeWidth={3} />
                                            </span>
                                        ) : (
                                            <span className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 size-7 rounded-full inline-flex items-center justify-center border border-amber-200 dark:border-amber-500/20" title="Pending Connection">
                                                <Clock size={14} strokeWidth={3} />
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button
                                            onClick={() => setSelectedWorker(worker)}
                                            className="text-[11px] font-medium uppercase tracking-wider px-3.5 py-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white rounded-lg transition-colors border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary flex items-center gap-1.5 ml-auto"
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
