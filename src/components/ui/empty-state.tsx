import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, actionIcon: ActionIcon }: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 p-16 text-center rounded-xl flex flex-col items-center">
      <Icon className="text-slate-300 dark:text-slate-600 mb-4" size={48} strokeWidth={1} />
      <h4 className="text-slate-900 dark:text-white font-semibold text-lg">{title}</h4>
      <p className="text-slate-500 text-sm mt-1.5 max-w-sm">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
        >
          {ActionIcon && <ActionIcon size={16} />}
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
