"use client";

import { useState } from "react";
import { updateProjectWorkerRate, ProjectRateUpdateData } from "@/app/actions/rate-actions";

type User = {
    id: string;
    name: string | null;
    role: string;
    baseHourlyRate: number;
    dailyRate: number;
};

type ProjectRate = {
    id: string;
    workerId: string;
    customHourlyRate: number | null;
    customDailyRate: number | null;
    customPieceRate: number | null;
    perDiem: number | null;
    accommodation: number | null;
};

interface ProjectRatesTableProps {
    projectId: string;
    workers: User[];
    existingRates: ProjectRate[];
}

export function ProjectRatesTable({ projectId, workers, existingRates }: ProjectRatesTableProps) {
    const [savingId, setSavingId] = useState<string | null>(null);

    const handleSave = async (workerId: string, form: HTMLFormElement) => {
        setSavingId(workerId);
        const formData = new FormData(form);

        const data: ProjectRateUpdateData = {
            workerId,
            projectId,
            customHourlyRate: formData.get("hourly") ? parseFloat(formData.get("hourly") as string) : null,
            customDailyRate: formData.get("daily") ? parseFloat(formData.get("daily") as string) : null,
            customPieceRate: formData.get("pieceRate") ? parseFloat(formData.get("pieceRate") as string) : null,
            perDiem: formData.get("perDiem") ? parseFloat(formData.get("perDiem") as string) : null,
            accommodation: formData.get("accommodation") ? parseFloat(formData.get("accommodation") as string) : null,
        };

        await updateProjectWorkerRate(data);
        setSavingId(null);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            <th className="px-6 py-4">Worker</th>
                            <th className="px-6 py-4">Global Rates</th>
                            <th className="px-6 py-4">Project Hourly ($)</th>
                            <th className="px-6 py-4">Project Daily ($)</th>
                            <th className="px-6 py-4">Produção (Piece Rate)</th>
                            <th className="px-6 py-4">Per Diem ($)</th>
                            <th className="px-6 py-4">Accommodation ($)</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {workers.map((worker) => {
                            const rate = existingRates.find(r => r.workerId === worker.id);
                            const isSavingThis = savingId === worker.id;

                            return (
                                <tr key={worker.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{worker.name || "Unnamed"}</div>
                                        <div className="text-xs text-slate-500 font-medium">{worker.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                            H: ${worker.baseHourlyRate.toFixed(2)}<br />
                                            D: ${worker.dailyRate.toFixed(2)}
                                        </div>
                                    </td>
                                    <td colSpan={6} className="p-0">
                                        <form
                                            className="grid grid-cols-6 items-center w-full"
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleSave(worker.id, e.currentTarget);
                                            }}
                                        >
                                            <div className="px-6 py-4">
                                                <input
                                                    type="number" step="0.01" name="hourly"
                                                    defaultValue={rate?.customHourlyRate || ""}
                                                    placeholder="Global"
                                                    className="w-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="px-6 py-4">
                                                <input
                                                    type="number" step="0.01" name="daily"
                                                    defaultValue={rate?.customDailyRate || ""}
                                                    placeholder="Global"
                                                    className="w-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="px-6 py-4">
                                                <input
                                                    type="number" step="0.001" name="pieceRate"
                                                    defaultValue={rate?.customPieceRate ?? ""}
                                                    placeholder="$0.00"
                                                    className="w-24 bg-slate-50 dark:bg-slate-950 border border-amber-200 dark:border-amber-700/50 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-amber-500 text-amber-900 dark:text-amber-100 placeholder-amber-400 dark:placeholder-amber-700 bg-amber-50 dark:bg-amber-950"
                                                />
                                            </div>
                                            <div className="px-6 py-4">
                                                <input
                                                    type="number" step="0.01" name="perDiem"
                                                    defaultValue={rate?.perDiem || ""}
                                                    placeholder="$0.00"
                                                    className="w-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="px-6 py-4">
                                                <input
                                                    type="number" step="0.01" name="accommodation"
                                                    defaultValue={rate?.accommodation || ""}
                                                    placeholder="$0.00"
                                                    className="w-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div className="px-6 py-4 text-right">
                                                <button
                                                    type="submit"
                                                    disabled={isSavingThis}
                                                    className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1 ml-auto"
                                                >
                                                    {isSavingThis ? "Saving..." : "Save Rate"}
                                                </button>
                                            </div>
                                        </form>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
