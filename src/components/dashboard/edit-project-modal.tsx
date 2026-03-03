"use client";

import { useState } from "react";
import { updateProject, deleteProject, ProjectUpdateData } from "@/app/actions/project-actions";
import { toast } from "sonner";
import { X, Save, FileEdit, ArchiveRestore, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ProjectType = {
    id: string;
    name: string;
    description: string | null;
    location: string | null;
    clientName: string | null;
    budget: number | null;
    status: "ACTIVE" | "DELAYED" | "COMPLETED";
    latitude?: number | null;
    longitude?: number | null;
};

export function EditProjectModal({ project }: { project: ProjectType }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<ProjectUpdateData>({
        name: project.name,
        description: project.description || "",
        location: project.location || "",
        clientName: project.clientName || "",
        budget: project.budget || 0,
        status: project.status,
        latitude: project.latitude || undefined,
        longitude: project.longitude || undefined,
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await updateProject(project.id, {
                ...formData,
                budget: formData.budget ? Number(formData.budget) : null,
                latitude: formData.latitude !== undefined && formData.latitude !== null ? Number(formData.latitude) : undefined,
                longitude: formData.longitude !== undefined && formData.longitude !== null ? Number(formData.longitude) : undefined,
            });
            if (res.success) {
                toast.success("Project updated successfully!");
                setIsOpen(false);
            } else {
                toast.error("Failed to update project.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Internal Error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone and will only succeed if the project has no logs.")) return;

        setIsDeleting(true);
        try {
            const res = await deleteProject(project.id);
            if (res.success) {
                toast.success("Project deleted successfully!");
                setIsOpen(false);
                router.push("/projects");
            } else {
                toast.error(res.error || "Failed to delete project.");
            }
        } catch (e) {
            console.error(e);
            toast.error("Internal Error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-6 py-2 rounded-lg font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-2"
            >
                <FileEdit size={16} strokeWidth={2.5} />
                Edit Details
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white">Edit Project</h2>
                                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{project.id.slice(-6)}</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-full transition-colors"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>
                        </div>

                        {/* Body Form */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value as "ACTIVE" | "DELAYED" | "COMPLETED" })}
                                    >
                                        <option value="ACTIVE">ACTIVE (Running)</option>
                                        <option value="DELAYED">DELAYED (On Hold)</option>
                                        <option value="COMPLETED">COMPLETED (Archived)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget ($)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        value={formData.budget || ""}
                                        onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        value={formData.latitude || ""}
                                        onChange={e => setFormData({ ...formData, latitude: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        value={formData.longitude || ""}
                                        onChange={e => setFormData({ ...formData, longitude: e.target.value ? Number(e.target.value) : undefined })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location / Address</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.location || ""}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    value={formData.clientName || ""}
                                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 font-medium text-slate-900 dark:text-white h-24 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                    value={formData.description || ""}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting || isSaving}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 px-4 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm transition-colors"
                            >
                                {isDeleting ? <ArchiveRestore size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                Delete Project
                            </button>

                            <div className="flex gap-3">
                                <button
                                    className="px-5 py-2.5 rounded-lg font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isSaving || isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-5 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                                    onClick={handleSave}
                                    disabled={isSaving || isDeleting}
                                >
                                    {isSaving ? (
                                        <ArchiveRestore size={16} strokeWidth={2.5} className="animate-spin" />
                                    ) : (
                                        <Save size={16} strokeWidth={2.5} />
                                    )}
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
