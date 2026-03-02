import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import { FadeIn } from "@/components/ui/fade-in";
import { calculateWeeklyPayroll } from "@/lib/payroll-calculator";
import { DownloadPayslipButton } from "@/components/payroll/download-payslip-button";

export const dynamic = 'force-dynamic';

export default async function PayrollPage() {
    // Current week or specific period logic
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    endOfWeek.setHours(23, 59, 59, 999);

    // Call the newly created calculation engine (extracted from user spreadsheet rules)
    const payrollResults = await calculateWeeklyPayroll(startOfWeek, endOfWeek);

    const totalEstimatedPayout = payrollResults.reduce((acc, curr) => acc + curr.totalPay, 0);
    const totalHoursLogged = payrollResults.reduce((acc, curr) => acc + curr.totalHours, 0);
    const activeWorkers = payrollResults.filter(r => r.totalHours > 0 || r.pieceEarnings > 0).length;

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Timesheets & Payroll" />
            <div className="flex-1 overflow-y-auto px-4 py-8 md:p-8">
                <div className="max-w-[1440px] mx-auto space-y-8">

                    <FadeIn delay={0.1} className="flex justify-between items-end">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Payroll & Production</h1>
                            <p className="text-slate-500 mt-1">Calculations based entirely on field Daily Logs via Telegram.</p>
                        </div>
                        <div className="flex gap-4">
                            <a
                                href={`/api/export/csv?start=${startOfWeek.toISOString()}&end=${endOfWeek.toISOString()}`}
                                download
                                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">download</span>
                                Export CSV
                            </a>
                            <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">payments</span>
                                Process Payments
                            </button>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase">Active Workers Logged</p>
                                <p className="text-3xl font-bold text-amber-700 dark:text-amber-400 mt-1">{activeWorkers}</p>
                            </div>
                            <span className="material-symbols-outlined text-3xl text-amber-500/40">groups</span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800/50 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase">Estimated Period Payout</p>
                                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                                    ${totalEstimatedPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-3xl text-emerald-500/40">account_balance</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-[10px] font-bold uppercase">Total Hours Tracked</p>
                                <p className="text-3xl font-bold mt-1">
                                    {totalHoursLogged.toFixed(1)}h
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-3xl text-slate-400/40">schedule</span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">account_balance_wallet</span> Calculated Payouts</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                    <tr className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Worker</th>
                                        <th className="px-6 py-4 font-semibold">Crew</th>
                                        <th className="px-6 py-4 font-semibold text-center">Hours (Reg+OT)</th>
                                        <th className="px-6 py-4 font-semibold text-center">Base/Guar. Earned</th>
                                        <th className="px-6 py-4 font-semibold text-center">Piece Rate Earned</th>
                                        <th className="px-6 py-4 font-semibold text-center">Payment Rule</th>
                                        <th className="px-6 py-4 font-semibold text-right text-emerald-600 dark:text-emerald-400 font-bold">Estimated Pay</th>
                                        <th className="px-6 py-4 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {payrollResults.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="text-center py-12 text-slate-500">
                                                No workers found for this payroll period.
                                            </td>
                                        </tr>
                                    ) : (
                                        payrollResults.map((stat: import("@/lib/payroll-calculator").PayrollResult) => (
                                            <tr key={stat.workerId} className="text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-3 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                                    <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                        {stat.workerName?.substring(0, 2) || "??"}
                                                    </div>
                                                    {stat.workerName || "Unknown Worker"}
                                                </td>
                                                <td className="px-6 py-3 text-slate-500 text-xs font-semibold">{stat.crewName || "-"}</td>
                                                <td className="px-6 py-3 text-center font-medium">
                                                    <span className="text-slate-700 dark:text-slate-300">{stat.regularHours}h</span>
                                                    {stat.otHours > 0 && <span className="text-amber-500 block text-[10px]">+{stat.otHours}h OT</span>}
                                                </td>
                                                <td className="px-6 py-3 text-center text-slate-500">
                                                    ${stat.hourlyEarnings.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3 text-center text-slate-500">
                                                    ${stat.pieceEarnings.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${stat.minGuaranteeApplied
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {stat.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3 text-right font-black text-emerald-600 dark:text-emerald-500 text-lg">
                                                    ${stat.totalPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <DownloadPayslipButton
                                                        workerData={stat}
                                                        startDate={startOfWeek.toLocaleDateString()}
                                                        endDate={endOfWeek.toLocaleDateString()}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </main>
    );
}
