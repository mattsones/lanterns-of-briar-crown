import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Panel({ title, children, right }: { title: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

export function Meter({
  value,
  max,
  label,
  colorClass = "bg-emerald-400",
}: {
  value: number;
  max: number;
  label: ReactNode;
  colorClass?: string;
}) {
  const pct = Math.max(0, Math.min(100, ((value || 0) / Math.max(1, max || 1)) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-white/70">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="h-3 rounded-full bg-white/10">
        <div className={`h-3 rounded-full ${colorClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatBadge({ label, value, bonus = 0 }: { label: ReactNode; value: ReactNode; bonus?: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 px-2 py-1 text-xs">
      <div className="text-white/70">{label}</div>
      <div className="font-semibold text-white">
        {value}
        {bonus > 0 ? <span className="ml-1 text-emerald-300">+{bonus}</span> : null}
      </div>
    </div>
  );
}

export function ChoiceButton({ choice, onChoose }) {
  return (
    <button
      disabled={choice.locked}
      onClick={() => !choice.locked && onChoose(choice)}
      className={`w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${
        choice.locked ? "border-slate-700 bg-slate-800/80 text-slate-400" : "border-white/10 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <div className="font-medium">{choice.label}</div>
      {choice.requirement ? <div className="mt-1 text-xs opacity-80">{choice.requirement}</div> : null}
    </button>
  );
}
