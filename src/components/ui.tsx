import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { getItemArtwork } from "../data/itemArtwork";

export function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`storybook-button rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Panel({ title, children, right }: { title: ReactNode; children: ReactNode; right?: ReactNode }) {
  return (
    <section className="story-panel rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {right}
      </div>
      {children}
    </section>
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

const itemIconSizes = {
  xs: "h-7 w-7 text-base",
  sm: "h-9 w-9 text-lg",
  md: "h-12 w-12 text-2xl",
  lg: "h-16 w-16 text-3xl",
};

export function ItemIcon({
  item,
  size = "md",
  className = "",
}: {
  item?: { id?: string; icon?: ReactNode; name?: string } | null;
  size?: keyof typeof itemIconSizes;
  className?: string;
}) {
  const artwork = getItemArtwork(item?.id);
  const label = item?.name || "Item";
  const [artFailed, setArtFailed] = useState(false);

  useEffect(() => {
    setArtFailed(false);
  }, [item?.id]);

  const showArtwork = !!artwork && !artFailed;

  return (
    <span
      aria-label={label}
      title={label}
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-amber-200/20 bg-slate-950/70 text-white shadow-inner ${itemIconSizes[size]} ${className}`}
    >
      {!showArtwork ? <span>{item?.icon || "?"}</span> : null}
      {showArtwork ? (
        <img
          src={artwork.src}
          alt={artwork.alt}
          className="absolute inset-0 h-full w-full object-contain p-1"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            setArtFailed(true);
          }}
        />
      ) : null}
    </span>
  );
}

export function ChoiceButton({ choice, onChoose }) {
  const isQuiet = choice.variant === "quiet";
  const isPrimary = choice.variant === "primary";
  return (
    <button
      disabled={choice.locked}
      onClick={() => !choice.locked && onChoose(choice)}
      className={`min-h-12 w-full rounded-2xl border px-3 py-3 text-left text-sm transition ${
        choice.locked
          ? "border-slate-700 bg-slate-800/80 text-slate-400"
          : isQuiet
            ? "border-white/5 bg-white/[0.04] text-white/75 hover:bg-white/10 hover:text-white"
            : isPrimary
              ? "border-emerald-300/60 bg-emerald-400/20 text-emerald-50 shadow-[0_0_0_1px_rgba(110,231,183,0.08)] hover:bg-emerald-400/30"
              : "border-white/10 bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <div className="font-medium">{choice.label}</div>
      {choice.requirement ? <div className="mt-1 text-xs opacity-80">{choice.requirement}</div> : null}
    </button>
  );
}
