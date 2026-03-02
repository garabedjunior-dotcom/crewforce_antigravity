"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-sm border border-slate-200 dark:border-slate-700/50 transition-colors w-9 h-9 flex items-center justify-center pointer-events-none opacity-50">
                <Sun className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
        );
    }

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary bg-white/70 dark:bg-slate-800/50 backdrop-blur-md rounded-full shadow-sm border border-slate-200 dark:border-slate-700/50 transition-all hover:-translate-y-0.5 w-9 h-9 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
            title="Toggle Theme"
        >
            {isDark ? (
                <Sun className="h-[18px] w-[18px] animate-in spin-in-90 duration-300" strokeWidth={2.5} />
            ) : (
                <Moon className="h-[18px] w-[18px] animate-in spin-in-90 duration-300" strokeWidth={2.5} />
            )}
        </button>
    );
}
