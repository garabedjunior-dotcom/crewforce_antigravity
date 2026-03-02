import { Header } from "@/components/layout/header";

export default function ProjectDetailsLoading() {
    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="Project Details" />
            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-8">
                <div className="max-w-[1440px] mx-auto animate-pulse">

                    <div className="mb-4 h-4 rounded w-48 bg-slate-200 dark:bg-slate-800"></div>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="h-4 rounded-full w-24 bg-slate-200 dark:bg-slate-800 mb-2"></div>
                                    <div className="h-10 rounded w-64 bg-slate-200 dark:bg-slate-800 mb-2"></div>
                                    <div className="h-4 rounded w-48 bg-slate-200 dark:bg-slate-800"></div>
                                </div>
                                <div className="h-10 rounded w-32 bg-slate-200 dark:bg-slate-800"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                                ))}
                            </div>

                            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl p-6">
                                <div className="h-6 w-48 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>
                                <div className="space-y-6">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
                                            <div className="h-3 w-full bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl p-6">
                                <div className="h-6 w-48 bg-slate-300 dark:bg-slate-700 rounded mb-6"></div>
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-24 w-full bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                            <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl p-6">
                                <div className="h-6 w-32 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
                                <div className="space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="h-16 w-full bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
