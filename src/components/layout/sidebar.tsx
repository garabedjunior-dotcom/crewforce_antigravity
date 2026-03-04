"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logOut } from '@/app/actions/auth-actions';
import { LayoutDashboard, HardHat, Users, Map, Wallet, BarChart, Settings, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function Sidebar({ user }: { user?: any }) {
    const pathname = usePathname();

    const navItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard },
        { path: "/projects", label: "Projects", icon: HardHat },
        { path: "/crews", label: "Crews", icon: Users },
        { path: "/map", label: "Map View", icon: Map },
        { path: "/payroll", label: "Payroll", icon: Wallet },
        { path: "/analytics", label: "Analytics", icon: BarChart },
        { path: "/settings", label: "Settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-30">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-orange-500 rounded-lg p-2 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <HardHat size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white leading-none">CrewForce</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Infrastructure OS</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto no-scrollbar">
                {navItems.map(item => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                />
                            )}
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                            <span className={`relative z-10 text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Link href="/settings" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-all duration-200 group">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-colors">
                        <User className="text-primary" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{user?.name || "Admin Worker"}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email || "admin@crewforce.app"}</p>
                    </div>
                </Link>
                <form action={logOut}>
                    <button className="w-full flex items-center gap-3 p-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 font-medium group">
                        <LogOut size={18} className="transition-transform group-hover:-translate-x-1 group-hover:drop-shadow-sm" />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    );
}
