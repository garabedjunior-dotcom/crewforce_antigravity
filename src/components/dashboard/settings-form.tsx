"use client";

import { updateCompanySettings, updateDefaultRates } from "@/app/actions/settings-actions";
import { useState } from "react";

interface SettingsFormProps {
    admin: {
        name: string | null;
        email: string | null;
        telegramChatId: string | null;
        baseHourlyRate: number;
        dailyRate: number;
        otMultiplier: number;
    };
    integrations: {
        database: boolean;
        telegram: boolean;
        auth: boolean;
    };
    stats: {
        totalWorkers: number;
        workersWithNoRate: number;
    };
}

export function SettingsForm({ admin, integrations, stats }: SettingsFormProps) {
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);

    async function handleSave(formName: string, action: (formData: FormData) => Promise<void>, formData: FormData) {
        setSaving(formName);
        setSaved(null);
        try {
            await action(formData);
            setSaved(formName);
            setTimeout(() => setSaved(null), 3000);
        } finally {
            setSaving(null);
        }
    }

    return (
        <div className="space-y-8">

            {/* System Integrations Status */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">hub</span>
                        System Integrations
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Status of connected services and APIs.</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { label: "Database", detail: "PostgreSQL via Prisma ORM", connected: integrations.database, icon: "storage" },
                            { label: "Telegram Bot", detail: admin.telegramChatId ? "Chat linked & active" : "Token configured", connected: integrations.telegram, icon: "send" },
                            { label: "Authentication", detail: "NextAuth.js session", connected: integrations.auth, icon: "shield" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                <div className={`size-14 rounded-2xl flex items-center justify-center mb-3 ${item.connected ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    <span className={`material-symbols-outlined text-2xl ${item.connected ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>{item.icon}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white mb-0.5">{item.label}</p>
                                <p className="text-[11px] text-slate-500 mb-3">{item.detail}</p>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.connected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                    {item.connected ? "Active" : "Inactive"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile & Company */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">person</span>
                        Profile & Company
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Your account information and company details.</p>
                </div>
                <form action={(fd) => handleSave("profile", updateCompanySettings, fd)} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                            <input name="ownerName" type="text" defaultValue={admin.name || ""} placeholder="Your name"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                            <input name="ownerEmail" type="email" defaultValue={admin.email || ""} placeholder="your@email.com"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
                            <input name="companyName" type="text" defaultValue="CrewForce" placeholder="Company name"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                            <select name="timezone" defaultValue="America/New_York"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                <option value="America/New_York">Eastern (ET)</option>
                                <option value="America/Chicago">Central (CT)</option>
                                <option value="America/Denver">Mountain (MT)</option>
                                <option value="America/Los_Angeles">Pacific (PT)</option>
                                <option value="America/Sao_Paulo">Brasília (BRT)</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overtime Threshold (hours/week)</label>
                            <input name="overtimeThreshold" type="number" defaultValue={40} step={1}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pay Period</label>
                            <select name="payPeriod" defaultValue="weekly"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all">
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={saving === "profile"}
                            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                            {saving === "profile" ? (
                                <><span className="material-symbols-outlined text-sm animate-spin">refresh</span> Saving...</>
                            ) : saved === "profile" ? (
                                <><span className="material-symbols-outlined text-sm">check</span> Saved!</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm">save</span> Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Default Pay Rates */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        Default Pay Rates
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Apply default rates to workers with no configured pay. Currently <strong className="text-primary">{stats.workersWithNoRate}</strong> of {stats.totalWorkers} workers have $0 rates.
                    </p>
                </div>
                <form action={(fd) => handleSave("rates", updateDefaultRates, fd)} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Hourly Rate ($)</label>
                            <div className="relative">
                                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">$</span>
                                <input name="defaultHourlyRate" type="number" step="0.01" defaultValue={admin.baseHourlyRate || 25} placeholder="25.00"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Daily Rate ($)</label>
                            <div className="relative">
                                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">$</span>
                                <input name="defaultDailyRate" type="number" step="0.01" defaultValue={admin.dailyRate || 200} placeholder="200.00"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">OT Multiplier</label>
                            <input name="defaultOtMultiplier" type="number" step="0.1" defaultValue={admin.otMultiplier || 1.5} placeholder="1.5"
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
                            Only applies to workers with $0 rates. Existing rates are not overwritten.
                        </p>
                        <button type="submit" disabled={saving === "rates"}
                            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                            {saving === "rates" ? (
                                <><span className="material-symbols-outlined text-sm animate-spin">refresh</span> Applying...</>
                            ) : saved === "rates" ? (
                                <><span className="material-symbols-outlined text-sm">check</span> Applied!</>
                            ) : (
                                <><span className="material-symbols-outlined text-sm">tune</span> Apply Defaults</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                    <h2 className="font-bold text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                        <span className="material-symbols-outlined">warning</span>
                        Danger Zone
                    </h2>
                    <p className="text-sm text-red-500/80 mt-1">Irreversible actions. Proceed with caution.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Export All Data</p>
                            <p className="text-xs text-slate-500">Download a full CSV export of projects, workers, and logs.</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-bold border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Export CSV
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                        <div>
                            <p className="text-sm font-bold text-red-700 dark:text-red-400">Reset All Worker Rates</p>
                            <p className="text-xs text-red-500/80">Resets all worker pay rates to $0. This cannot be undone.</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-bold border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">restart_alt</span>
                            Reset Rates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
