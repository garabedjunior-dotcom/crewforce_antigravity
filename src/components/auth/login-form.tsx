"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth-actions";

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="email">
                        Manager Email
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">mail</span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="admin@crewforce.app"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">lock</span>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-white border-0 rounded-xl py-3.5 text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                ) : (
                    <>
                        Access OS
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                )}
            </button>

            {errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <p>{errorMessage}</p>
                </div>
            )}
        </form>
    );
}
