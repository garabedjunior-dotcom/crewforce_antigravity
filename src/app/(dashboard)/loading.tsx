import { Header } from "@/components/layout/header";
import { Hourglass } from "lucide-react";

export default function DashboardLoading() {
    return (
        <main className="flex-1 flex flex-col overflow-hidden h-full">
            <Header title="Admin Center" />
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0f172a] p-8 flex gap-8">
                <div className="flex-1">
                    <div className="mb-6">
                        <div className="h-8 bg-slate-200 dark:bg-white/5 rounded-lg w-48 mb-2 skeleton-shimmer"></div>
                        <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-lg w-96 skeleton-shimmer"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-32 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="h-3 bg-slate-200 dark:bg-white/10 rounded-full w-20 skeleton-shimmer"></div>
                                    <div className="size-10 bg-slate-200 dark:bg-white/10 rounded-xl skeleton-shimmer"></div>
                                </div>
                                <div>
                                    <div className="h-8 bg-slate-200 dark:bg-white/10 rounded-lg w-16 mb-2 skeleton-shimmer"></div>
                                    <div className="h-2.5 bg-slate-200 dark:bg-white/10 rounded-full w-12 skeleton-shimmer"></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <section className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-6 bg-slate-200 dark:bg-white/5 rounded-lg w-32 skeleton-shimmer"></div>
                            <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-lg w-16 skeleton-shimmer"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-white/5 rounded-2xl border border-slate-200/60 dark:border-white/5 shadow-[0_2px_20px_rgba(0,0,0,0.02)] p-4 flex items-center gap-6 h-[88px]">
                                    <div className="size-14 rounded-2xl bg-slate-200 dark:bg-white/10 shrink-0 skeleton-shimmer"></div>
                                    <div className="flex-1 flex flex-col justify-center gap-2.5">
                                        <div className="h-4 bg-slate-200 dark:bg-white/10 rounded-full w-32 skeleton-shimmer"></div>
                                        <div className="h-3 bg-slate-200 dark:bg-white/10 rounded-full w-48 skeleton-shimmer"></div>
                                    </div>
                                    <div className="flex items-center px-4">
                                        <div className="h-10 w-24 bg-slate-200 dark:bg-white/10 rounded-xl skeleton-shimmer"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="w-80 border-l border-slate-200/60 dark:border-white/5 bg-white/50 dark:bg-white/5 rounded-2xl p-6 shadow-sm hidden xl:block backdrop-blur-xl">
                    <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg w-32 mb-6 skeleton-shimmer flex items-center gap-2"></div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex gap-3 h-12">
                                <div className="size-10 rounded-full bg-slate-200 dark:bg-white/10 skeleton-shimmer shrink-0"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-3 bg-slate-200 dark:bg-white/10 rounded-full w-full skeleton-shimmer"></div>
                                    <div className="h-2.5 bg-slate-200 dark:bg-white/10 rounded-full w-2/3 skeleton-shimmer"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
