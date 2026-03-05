"use client";

import { updateCompanySettings, updateDefaultRates, changePassword } from "@/app/actions/settings-actions";
import { useState, useRef } from "react";
import { Network, User, Wallet, Loader2, Check, Save, SlidersHorizontal, AlertTriangle, Download, RotateCcw, Database, Send, Shield, Lock, type LucideIcon } from "lucide-react";

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
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const passwordFormRef = useRef<HTMLFormElement>(null);

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
            <div className="glass-card shadow-sm overflow-hidden border-slate-200 dark:border-border-default">
                <div className="p-6 border-b border-slate-100 dark:border-border-default bg-slate-50/50 dark:bg-white/5">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-text-primary">
                        <Network className="text-brand" size={18} />
                        System Integrations
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">Status of connected services and APIs.</p>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {([
                            { label: "Database", detail: "PostgreSQL via Prisma ORM", connected: integrations.database, icon: Database },
                            { label: "Telegram Bot", detail: admin.telegramChatId ? "Chat linked & active" : "Token configured", connected: integrations.telegram, icon: Send },
                            { label: "Authentication", detail: "NextAuth.js session", connected: integrations.auth, icon: Shield },
                        ] as { label: string; detail: string; connected: boolean; icon: LucideIcon }[]).map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-slate-50 dark:bg-neutral-bg3 border border-slate-100 dark:border-white/5 shadow-sm hover:border-brand/20 transition-colors">
                                <div className={`size-14 rounded-2xl flex items-center justify-center mb-3 ${item.connected ? 'bg-emerald-100 dark:bg-emerald-500/10' : 'bg-red-100 dark:bg-red-500/10'}`}>
                                    <item.icon className={`${item.connected ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`} size={20} />
                                </div>
                                <p className="text-sm font-medium text-slate-800 dark:text-white mb-0.5">{item.label}</p>
                                <p className="text-[11px] text-slate-500 dark:text-text-muted mb-3">{item.detail}</p>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wider ${item.connected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${item.connected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'}`} />
                                    {item.connected ? "Active" : "Inactive"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Profile & Company */}
            <div className="glass-card shadow-sm overflow-hidden border-slate-200 dark:border-border-default">
                <div className="p-6 border-b border-slate-100 dark:border-border-default bg-slate-50/50 dark:bg-white/5">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-text-primary">
                        <User className="text-brand" size={18} />
                        Profile & Company
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">Your account information and company details.</p>
                </div>
                <form action={(fd) => handleSave("profile", updateCompanySettings, fd)} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Full Name</label>
                            <input name="ownerName" type="text" defaultValue={admin.name || ""} placeholder="Your name"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Email</label>
                            <input name="ownerEmail" type="email" defaultValue={admin.email || ""} placeholder="your@email.com"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Company Name</label>
                            <input name="companyName" type="text" defaultValue="CrewForce" placeholder="Company name"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Timezone</label>
                            <select name="timezone" defaultValue="America/New_York"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white appearance-none">
                                <option value="America/New_York" className="dark:bg-neutral-bg2">Eastern (ET)</option>
                                <option value="America/Chicago" className="dark:bg-neutral-bg2">Central (CT)</option>
                                <option value="America/Denver" className="dark:bg-neutral-bg2">Mountain (MT)</option>
                                <option value="America/Los_Angeles" className="dark:bg-neutral-bg2">Pacific (PT)</option>
                                <option value="America/Sao_Paulo" className="dark:bg-neutral-bg2">Brasilia (BRT)</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Overtime Threshold (hours/week)</label>
                            <input name="overtimeThreshold" type="number" defaultValue={40} step={1}
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Pay Period</label>
                            <select name="payPeriod" defaultValue="weekly"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white appearance-none">
                                <option value="weekly" className="dark:bg-neutral-bg2">Weekly</option>
                                <option value="biweekly" className="dark:bg-neutral-bg2">Bi-Weekly</option>
                                <option value="monthly" className="dark:bg-neutral-bg2">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={saving === "profile"}
                            className="px-6 py-2.5 rounded-lg font-medium text-sm bg-brand text-white hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-50">
                            {saving === "profile" ? (
                                <><Loader2 className="animate-spin" size={16} /> Saving...</>
                            ) : saved === "profile" ? (
                                <><Check size={16} /> Saved!</>
                            ) : (
                                <><Save size={16} /> Save Changes</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password */}
            <div className="glass-card shadow-sm overflow-hidden border-slate-200 dark:border-border-default">
                <div className="p-6 border-b border-slate-100 dark:border-border-default bg-slate-50/50 dark:bg-white/5">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-text-primary">
                        <Lock className="text-brand" size={18} />
                        Change Password
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">Update your account password.</p>
                </div>
                <form
                    ref={passwordFormRef}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setSaving("password");
                        setSaved(null);
                        setPasswordError(null);
                        const fd = new FormData(e.currentTarget);
                        try {
                            const result = await changePassword(fd);
                            if (result.error) {
                                setPasswordError(result.error);
                            } else {
                                setSaved("password");
                                passwordFormRef.current?.reset();
                                setTimeout(() => setSaved(null), 3000);
                            }
                        } finally {
                            setSaving(null);
                        }
                    }}
                    className="p-6 space-y-5"
                >
                    {passwordError && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {passwordError}
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Current Password</label>
                            <input name="currentPassword" type="password" required placeholder="Enter current password"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">New Password</label>
                            <input name="newPassword" type="password" required minLength={6} placeholder="Min. 6 characters"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Confirm New Password</label>
                            <input name="confirmPassword" type="password" required minLength={6} placeholder="Re-enter new password"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={saving === "password"}
                            className="px-6 py-2.5 rounded-lg font-medium text-sm bg-brand text-white hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-50">
                            {saving === "password" ? (
                                <><Loader2 className="animate-spin" size={16} /> Updating...</>
                            ) : saved === "password" ? (
                                <><Check size={16} /> Updated!</>
                            ) : (
                                <><Lock size={16} /> Update Password</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Default Pay Rates */}
            <div className="glass-card shadow-sm overflow-hidden border-slate-200 dark:border-border-default">
                <div className="p-6 border-b border-slate-100 dark:border-border-default bg-slate-50/50 dark:bg-white/5">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-text-primary">
                        <Wallet className="text-brand" size={18} />
                        Default Pay Rates
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-text-secondary mt-1">
                        Apply default rates to workers with no configured pay. Currently <strong className="text-brand">{stats.workersWithNoRate}</strong> of {stats.totalWorkers} workers have $0 rates.
                    </p>
                </div>
                <form action={(fd) => handleSave("rates", updateDefaultRates, fd)} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Default Hourly Rate ($)</label>
                            <div className="relative">
                                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">$</span>
                                <input name="defaultHourlyRate" type="number" step="0.01" defaultValue={admin.baseHourlyRate || 25} placeholder="25.00"
                                    className="glass-input w-full rounded-lg pl-8 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">Default Daily Rate ($)</label>
                            <div className="relative">
                                <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">$</span>
                                <input name="defaultDailyRate" type="number" step="0.01" defaultValue={admin.dailyRate || 200} placeholder="200.00"
                                    className="glass-input w-full rounded-lg pl-8 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 dark:text-text-muted uppercase tracking-wider">OT Multiplier</label>
                            <input name="defaultOtMultiplier" type="number" step="0.1" defaultValue={admin.otMultiplier || 1.5} placeholder="1.5"
                                className="glass-input w-full rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand/50 transition-all text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <p className="text-xs text-slate-500 dark:text-text-muted flex items-center gap-1">
                            <AlertTriangle className="text-amber-500" size={14} />
                            Only applies to workers with $0 rates. Existing rates are not overwritten.
                        </p>
                        <button type="submit" disabled={saving === "rates"}
                            className="px-6 py-2.5 rounded-lg font-medium text-sm bg-brand text-white hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-50">
                            {saving === "rates" ? (
                                <><Loader2 className="animate-spin" size={16} /> Applying...</>
                            ) : saved === "rates" ? (
                                <><Check size={16} /> Applied!</>
                            ) : (
                                <><SlidersHorizontal size={16} /> Apply Defaults</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="glass-card shadow-sm overflow-hidden border border-red-200 dark:border-red-900/50">
                <div className="p-6 border-b border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-500/5">
                    <h2 className="font-semibold text-lg flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle size={18} />
                        Danger Zone
                    </h2>
                    <p className="text-sm text-red-500/80 mt-1">Irreversible actions. Proceed with caution.</p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-neutral-bg2 border border-slate-100 dark:border-white/5">
                        <div>
                            <p className="text-sm font-medium text-slate-800 dark:text-text-primary">Export All Data</p>
                            <p className="text-xs text-slate-500 dark:text-text-muted">Download a full CSV export of projects, workers, and logs.</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-white/10 text-slate-700 dark:text-text-primary hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20">
                        <div>
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">Reset All Worker Rates</p>
                            <p className="text-xs text-red-500/80">Resets all worker pay rates to $0. This cannot be undone.</p>
                        </div>
                        <button className="px-4 py-2 rounded-lg text-sm font-medium border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
                            <RotateCcw size={16} />
                            Reset Rates
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
