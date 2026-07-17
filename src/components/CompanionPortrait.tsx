import { useEffect, useState } from "react";
import { COMPANION_OPTIONS } from "../data/companions";

export function CompanionPortrait({
  companion,
  className = "h-24 w-24",
}: {
  companion?: { id?: string | null; name?: string | null; icon?: string | null } | null;
  className?: string;
}) {
  const option = companion?.id ? COMPANION_OPTIONS[companion.id] : null;
  const portraitSrc = option?.portraitSrc;
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [companion?.id, portraitSrc]);

  const showPortrait = Boolean(portraitSrc) && !imageFailed;
  const fallback = companion?.icon || companion?.name?.slice(0, 1) || "?";

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 text-3xl shadow-inner ${className}`}
    >
      {!showPortrait ? <span aria-hidden="true">{fallback}</span> : null}
      {showPortrait ? (
        <img
          src={portraitSrc}
          alt={`Portrait of ${option?.name || companion?.name || "companion"}`}
          className="absolute inset-0 h-full w-full object-cover object-top"
          onError={() => setImageFailed(true)}
        />
      ) : null}
    </div>
  );
}
