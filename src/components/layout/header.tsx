"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, UserPlus, MapPin, Search, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LogoutButton } from "@/components/auth/logout-button";

export function Header({ title }: { title?: string }) {
    const pathname = usePathname();

    const getAction = () => {
        if (pathname === "/" || pathname.startsWith("/projects")) {
            return { label: "New Project", icon: Plus, href: "/projects/new" };
        }
        if (pathname.startsWith("/crews")) {
            return { label: "Add Worker", icon: UserPlus, href: "/crews" };
        }
        if (pathname.startsWith("/map")) {
            return { label: "Add Location", icon: MapPin, href: "/projects/new" };
        }
        return null;
    };

    const action = getAction();
    const ActionIcon = action?.icon;

    return (
        <header className="h-[72px] border-b border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-8 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-4 flex-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{title || "Overview"}</h2>
                <div className="hidden md:flex relative w-64 ml-8 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} strokeWidth={2.5} />
                    <input
                        className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-white/5 border border-transparent dark:border-white/5 rounded-xl text-sm focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-slate-400 outline-none transition-all shadow-sm shadow-black/5"
                        placeholder="Search projects, crews..."
                        type="text"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <LogoutButton />
                </div>

                <button className="relative size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 group">
                    <Bell size={18} strokeWidth={2} className="group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
                    <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full shadow-[0_0_8px_rgba(255,102,0,0.6)]"></span>
                </button>

                {action && ActionIcon && (
                    <>
                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-white/10"></div>
                        <Link href={action.href} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2.5 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200">
                            <ActionIcon size={16} strokeWidth={3} />
                            {action.label}
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
