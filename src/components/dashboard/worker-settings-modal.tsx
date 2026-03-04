"use client";

import { useState, useEffect } from "react";
import { updateWorkerSettings, archiveWorker, WorkerUpdateData } from "@/app/actions/worker-actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
};

type Crew = {
    id: string;
    name: string;
};

interface WorkerSettingsModalProps {
    worker: Worker | null;
    crews: Crew[];
    isOpen: boolean;
    onClose: () => void;
}

export function WorkerSettingsModal({ worker, crews, isOpen, onClose }: WorkerSettingsModalProps) {
    const [isSaving, setIsSaving] = useState(false);

    // Controlled Form State
    const [formData, setFormData] = useState<WorkerUpdateData>({
        name: worker?.name || "",
        email: worker?.email || "",
        employeeType: (worker?.employeeType || "W2") as "W2" | "1099",
        baseHourlyRate: worker?.baseHourlyRate || 0,
        dailyRate: worker?.dailyRate || 0,
        otMultiplier: worker?.otMultiplier || 1.5,
        minHourlyGuarantee: worker?.minHourlyGuarantee ?? false,
        minDailyGuarantee: worker?.minDailyGuarantee ?? false,
        pieceRateEnabled: worker?.pieceRateEnabled ?? true,
        crewId: worker?.crewId || null,
        telegramChatId: worker?.telegramChatId || null,
        jobTitle: worker?.jobTitle || null,
    });

    useEffect(() => {
        if (worker) {
            setFormData({
                name: worker.name || "",
                email: worker.email || "",
                employeeType: (worker.employeeType || "W2") as "W2" | "1099",
                baseHourlyRate: worker.baseHourlyRate || 0,
                dailyRate: worker.dailyRate || 0,
                otMultiplier: worker.otMultiplier || 1.5,
                minHourlyGuarantee: worker.minHourlyGuarantee ?? false,
                minDailyGuarantee: worker.minDailyGuarantee ?? false,
                pieceRateEnabled: worker.pieceRateEnabled ?? true,
                crewId: worker.crewId || null,
                telegramChatId: worker.telegramChatId || null,
                jobTitle: worker.jobTitle || null,
            });
        }
    }, [worker]);

    if (!isOpen || !worker) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await updateWorkerSettings(worker.id, formData);
            if (res.success) {
                toast.success("Worker settings updated!");
                onClose();
            } else {
                toast.error("Failed to save. Check console.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Internal Error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleArchive = async () => {
        if (!confirm(`Are you sure you want to archive ${worker.name}? This removes them from active lists but keeps their financial records.`)) return;

        setIsSaving(true);
        try {
            const res = await archiveWorker(worker.id);
            if (res.success) {
                toast.success("Worker archived successfully!");
                onClose();
            } else {
                toast.error("Failed to archive worker.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Internal Error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 overflow-hidden">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-full">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {worker.name || "Worker Settings"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">{worker.role} • Settings</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                </div>

                {/* Body Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">

                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Profile Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.name || ""}
                                    placeholder="e.g. John Doe"
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.email || ""}
                                    placeholder="e.g. john@example.com"
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Job Title / Cargo na Obra</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.jobTitle || ""}
                                    placeholder="e.g. Operador Míssil, Helper, Imediato..."
                                    onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Assignments</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Employment Type</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.employeeType}
                                    onChange={e => setFormData({ ...formData, employeeType: e.target.value as "W2" | "1099" })}
                                >
                                    <option value="W2">W2 (Employee)</option>
                                    <option value="1099">1099 (Contractor)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Assigned Crew</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.crewId || ""}
                                    onChange={e => setFormData({ ...formData, crewId: e.target.value || null })}
                                >
                                    <option value="">Unassigned</option>
                                    {crews.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Integrations</h3>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                                Telegram Chat ID
                                <span className="text-[10px] text-slate-400 font-normal">Provided by the bot when user sends /start</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">send</span>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg pl-9 pr-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.telegramChatId || ""}
                                    placeholder="e.g. 123456789"
                                    onChange={e => setFormData({ ...formData, telegramChatId: e.target.value || null })}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* Payroll Rates */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Payroll Rates</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                                    Base Hourly Rate ($)
                                </label>
                                <input
                                    type="number" step="0.01"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.baseHourlyRate}
                                    onChange={e => setFormData({ ...formData, baseHourlyRate: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                                    Daily Rate ($)
                                </label>
                                <input
                                    type="number" step="0.01"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.dailyRate}
                                    onChange={e => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">OT Multiplier</label>
                                <input
                                    type="number" step="0.1"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary"
                                    value={formData.otMultiplier}
                                    onChange={e => setFormData({ ...formData, otMultiplier: parseFloat(e.target.value) || 1.5 })}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100 dark:border-slate-800" />

                    {/* Payment Rules / Toggles */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Payment Rules</h3>

                        <div className="space-y-3">

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Enable Piece Rate</p>
                                    <p className="text-xs text-slate-500 font-medium">Earn based on exact field production logs</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                    checked={formData.pieceRateEnabled}
                                    onChange={e => setFormData({ ...formData, pieceRateEnabled: e.target.checked })}
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Minimum Hourly Guarantee</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-500 font-medium">Forces payment via Hourly if Piece Rate fails to match Base</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                    checked={formData.minHourlyGuarantee}
                                    onChange={e => {
                                        setFormData({
                                            ...formData,
                                            minHourlyGuarantee: e.target.checked,
                                            // Ensure both aren't true at once usually, but keeping it simple for now
                                            minDailyGuarantee: e.target.checked ? false : formData.minDailyGuarantee
                                        })
                                    }}
                                />
                            </label>

                            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Minimum Daily Guarantee</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-500 font-medium">Forces payment via (Diárias / Meias Diárias) over piece rate</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                                    checked={formData.minDailyGuarantee}
                                    onChange={e => {
                                        setFormData({
                                            ...formData,
                                            minDailyGuarantee: e.target.checked,
                                            // Mutually exclusive with Hourly Guarantee typically
                                            minHourlyGuarantee: e.target.checked ? false : formData.minHourlyGuarantee
                                        })
                                    }}
                                />
                            </label>

                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
                    <button
                        className="px-4 py-2 rounded-lg font-bold text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2"
                        onClick={handleArchive}
                        disabled={isSaving}
                        title="Archive Worker"
                    >
                        <Trash2 size={16} strokeWidth={2.5} />
                        Archive
                    </button>

                    <div className="flex gap-3">
                        <button
                            className="px-5 py-2 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-5 py-2 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                            ) : (
                                <span className="material-symbols-outlined text-sm">save</span>
                            )}
                            {isSaving ? "Saving..." : "Save Settings"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
