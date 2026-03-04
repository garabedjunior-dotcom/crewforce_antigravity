import { Header } from "@/components/layout/header";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { createWorker } from "@/app/actions/worker-actions";
import { ChevronRight, Info } from "lucide-react";

export default async function NewWorkerPage() {
    const crews = await prisma.crew.findMany({ orderBy: { name: 'asc' } });

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Add New Worker" />
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8">
                <div className="max-w-2xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/crews" className="hover:text-primary transition-colors">Crews & Personnel</Link>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">Add Worker</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Worker Profile</h2>
                            <p className="text-slate-500 mt-1 mb-8">Register a new team member. They will receive a code to connect their Telegram.</p>
                        </div>

                        <form action={createWorker} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">System Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="WORKER">Field Worker</option>
                                        <option value="MANAGER">Crew Manager</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="crewId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Crew Assignment</label>
                                    <select
                                        id="crewId"
                                        name="crewId"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    >
                                        <option value="none">Unassigned / Floating</option>
                                        {crews.map((crew: { id: string, name: string }) => (
                                            <option key={crew.id} value={crew.id}>{crew.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="telegramChatId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Telegram Chat ID (Optional)</label>
                                <input
                                    type="text"
                                    id="telegramChatId"
                                    name="telegramChatId"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    placeholder="e.g. 6835726434"
                                />
                                <p className="text-xs text-slate-500 mt-1">If the worker already messaged the bot, put their Chat ID here to instantly connect them.</p>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 flex gap-4 mt-8">
                                <div className="text-blue-500 shrink-0">
                                    <Info size={18} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Telegram Onboarding</h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">Once created, the worker must message the bot providing their registered name exactly as typed above to auto-link their device.</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                                <Link href="/crews" className="px-6 py-3 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    Cancel
                                </Link>
                                <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                                    Create Worker Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
