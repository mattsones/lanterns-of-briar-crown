import { useEffect, useState } from "react";
import { getPlayerArtwork } from "../data/playerArtwork";
import { getAppearanceIcon } from "../game/appearance";
import type { Player } from "../game/types";

type HeroArtworkVariant = "full" | "portrait" | "token";

type HeroArtworkProps = {
  player?: Partial<Player> | null;
  raceId?: string | null;
  gender?: string | null;
  humanHeritageId?: string | null;
  appearanceId?: string | null;
  name?: string | null;
  variant?: HeroArtworkVariant;
  decorative?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function HeroArtwork({
  player,
  raceId,
  gender,
  humanHeritageId,
  appearanceId,
  name,
  variant = "portrait",
  decorative = false,
  className,
  imageClassName,
  fallbackClassName,
}: HeroArtworkProps) {
  const selection = {
    raceId: player?.raceId ?? raceId,
    gender: player?.gender ?? gender,
    humanHeritageId: player?.humanHeritageId ?? humanHeritageId,
    appearanceId: player?.appearanceId ?? appearanceId,
  };
  const artwork = getPlayerArtwork(selection);
  const fallbackIcon = getAppearanceIcon(selection);
  const [artFailed, setArtFailed] = useState(false);
  const showArtwork = !!artwork?.src && !artFailed;

  useEffect(() => {
    setArtFailed(false);
  }, [artwork?.src]);

  if (variant === "token") {
    return showArtwork ? (
      <img
        data-testid="hero-token-art"
        src={artwork.src}
        alt={decorative ? "" : artwork.alt}
        className={imageClassName}
        onError={() => setArtFailed(true)}
      />
    ) : (
      <span className={fallbackClassName}>{fallbackIcon}</span>
    );
  }

  return (
    <div
      className={joinClasses(
        "hero-art-frame",
        variant === "full" ? "hero-art-frame--full" : "hero-art-frame--portrait",
        className,
      )}
      data-testid="hero-artwork"
    >
      {showArtwork ? (
        <img
          src={artwork.src}
          alt={decorative ? "" : artwork.alt || `${name || "Hero"} artwork`}
          className={joinClasses("hero-art-image", imageClassName)}
          onError={() => setArtFailed(true)}
        />
      ) : (
        <span className={joinClasses("hero-art-fallback", fallbackClassName)}>{fallbackIcon}</span>
      )}
    </div>
  );
}
