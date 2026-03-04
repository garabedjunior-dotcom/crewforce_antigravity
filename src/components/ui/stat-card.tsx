import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({ label, value, sub, icon: Icon, iconClassName = "text-slate-400" }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider">{label}</p>
        <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Icon className={iconClassName} size={17} strokeWidth={2} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {sub && <span className="text-slate-400 text-xs font-medium mb-0.5">{sub}</span>}
      </div>
    </div>
  );
}
