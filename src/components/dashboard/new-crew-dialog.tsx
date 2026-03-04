"use client";

import { useState, useCallback, useEffect } from "react";
import { Users, Loader2, X } from "lucide-react";
import { createCrew } from "@/app/actions/crew-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    name: string;
}

export function NewCrewDialog({ projects }: { projects: Project[] }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
    }, []);

    useEffect(() => {
        if (open) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [open, handleKeyDown]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const projectId = formData.get("projectId") as string;

        try {
            const result = await createCrew({
                name,
                description: description || undefined,
                projectId: projectId || undefined,
            });

            if (result.success) {
                toast.success("Crew created successfully!");
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to create crew.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
            >
                <Users size={18} strokeWidth={2.5} />
                New Crew
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Crew</h2>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Crew Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    name="name"
                                    placeholder="e.g. Alpha Team"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Assign to Project (Optional)
                                </label>
                                <select
                                    name="projectId"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white"
                                    defaultValue=""
                                >
                                    <option value="">No Project (Idle)</option>
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Brief description of the crew's role..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white min-h-[80px]"
                                />
                            </div>

                            <div className="flex justify-end pt-4 gap-3 border-t border-slate-100 dark:border-slate-800 mt-6 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-medium flex items-center justify-center min-w-[120px]"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : "Create Crew"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
