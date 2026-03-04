"use client";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  descriptionClassName?: string;
}

export function Toggle({ checked, onChange, label, description, descriptionClassName = "text-slate-500" }: ToggleProps) {
  return (
    <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
        {description && <p className={`text-xs ${descriptionClassName} mt-0.5`}>{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"}`}
      >
        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
    </label>
  );
}
