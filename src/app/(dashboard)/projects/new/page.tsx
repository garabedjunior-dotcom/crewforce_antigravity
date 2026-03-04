"use client";

import { Header } from "@/components/layout/header";
import Link from "next/link";
import { createProject } from "@/app/actions/project-actions";
import { useState } from "react";
import { ChevronRight, MapPin, User, Compass, Plus, Loader2 } from "lucide-react";

export default function NewProjectPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true);
        try {
            await createProject(formData);
        } catch {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            <Header title="New Project" />
            <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-8">
                <div className="max-w-2xl mx-auto">

                    {/* Breadcrumbs */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                        <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
                        <ChevronRight size={14} className="text-slate-400" />
                        <span className="font-semibold text-slate-900 dark:text-white">New Project</span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create New Project</h1>
                            <p className="text-sm text-slate-500 mt-1">Fill in the details to start tracking a new infrastructure project.</p>
                        </div>

                        <form action={handleSubmit} className="p-6 space-y-6">

                            {/* Project Name */}
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g., Fiber Optic Network - Downtown Miami"
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label htmlFor="description" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    placeholder="Brief overview of project scope, objectives, and deliverables..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Location */}
                                <div className="space-y-1.5">
                                    <label htmlFor="location" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" size={16} />
                                        <input
                                            id="location"
                                            name="location"
                                            type="text"
                                            placeholder="e.g., Miami - Sector South"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Client */}
                                <div className="space-y-1.5">
                                    <label htmlFor="clientName" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Client Name
                                    </label>
                                    <div className="relative">
                                        <User className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" size={16} />
                                        <input
                                            id="clientName"
                                            name="clientName"
                                            type="text"
                                            placeholder="e.g., AT&T Network Services"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Budget */}
                                <div className="space-y-1.5">
                                    <label htmlFor="budget" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Budget ($)
                                    </label>
                                    <div className="relative">
                                        <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold">$</span>
                                        <input
                                            id="budget"
                                            name="budget"
                                            type="number"
                                            step="0.01"
                                            placeholder="e.g., 500000"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div className="space-y-1.5">
                                    <label htmlFor="deadline" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Target Deadline
                                    </label>
                                    <input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Latitude */}
                                <div className="space-y-1.5">
                                    <label htmlFor="latitude" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Latitude
                                    </label>
                                    <div className="relative">
                                        <Compass className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" size={16} />
                                        <input
                                            id="latitude"
                                            name="latitude"
                                            type="number"
                                            step="any"
                                            placeholder="e.g., 25.7617"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Longitude */}
                                <div className="space-y-1.5">
                                    <label htmlFor="longitude" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                        Longitude
                                    </label>
                                    <div className="relative">
                                        <Compass className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" size={16} />
                                        <input
                                            id="longitude"
                                            name="longitude"
                                            type="number"
                                            step="any"
                                            placeholder="e.g., -80.1918"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href="/projects"
                                    className="px-6 py-2.5 rounded-lg font-medium text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-lg font-medium text-sm bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                    {isSubmitting ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
