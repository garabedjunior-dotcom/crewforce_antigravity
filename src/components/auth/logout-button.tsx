"use client";

import { LogOut } from "lucide-react";
import { logOut } from "@/app/actions/auth-actions";

export function LogoutButton() {
    return (
        <button
            onClick={() => logOut()}
            className="p-2 text-slate-400 hover:text-red-500 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-sm border border-slate-200 dark:border-slate-700/50 transition-colors w-9 h-9 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500/50"
            title="Sign Out"
        >
            <LogOut className="h-[16px] w-[16px]" strokeWidth={2.5} />
        </button>
    );
}
