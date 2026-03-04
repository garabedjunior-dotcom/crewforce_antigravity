"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth-actions";
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider" htmlFor="email">
                        Manager Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="admin@crewforce.app"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-lg pl-10 pr-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-white border-0 rounded-lg py-3.5 text-sm font-medium shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <Loader2 className="animate-spin" size={18} />
                ) : (
                    <>
                        Access OS
                        <ArrowRight size={16} />
                    </>
                )}
            </button>

            {errorMessage && (
                <div className="flex items-center gap-2 text-red-500 text-sm font-medium p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                    <AlertCircle size={16} />
                    <p>{errorMessage}</p>
                </div>
            )}
        </form>
    );
}
