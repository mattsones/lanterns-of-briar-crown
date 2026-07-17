export type GrowthArtwork = {
  src: string;
  alt: string;
};

const powerEmblem = new URL(
  "../../assets/icons/ui/level-up-power-v01.png",
  import.meta.url,
).href;
const resolveEmblem = new URL(
  "../../assets/icons/ui/level-up-resolve-v01.png",
  import.meta.url,
).href;
const clevernessEmblem = new URL(
  "../../assets/icons/ui/level-up-cleverness-v01.png",
  import.meta.url,
).href;
const heartEmblem = new URL(
  "../../assets/icons/ui/level-up-heart-v01.png",
  import.meta.url,
).href;
const craftEmblem = new URL(
  "../../assets/icons/ui/level-up-craft-v02.png",
  import.meta.url,
).href;

export const HERO_GROWTH_ARTWORK: Record<string, GrowthArtwork> = {
  power: { src: powerEmblem, alt: "A village hatchet cutting through a thorny briar" },
  resolve: { src: resolveEmblem, alt: "A roadwarden shield standing firm against roots" },
  cleverness: { src: clevernessEmblem, alt: "A route map revealing one honest glowing path" },
  heart: { src: heartEmblem, alt: "Two hands sheltering a warm road lantern" },
  craft: { src: craftEmblem, alt: "A bundle of well-used handcrafting tools" },
};

export function getHeroGrowthArtwork(growthId?: string | null) {
  return growthId ? HERO_GROWTH_ARTWORK[growthId] || null : null;
}
