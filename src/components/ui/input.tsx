import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={2} />
          )}
          <input
            ref={ref}
            className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-slate-400 transition-colors ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = "", children, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-slate-400 resize-none transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}
