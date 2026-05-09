export const ITEM_DB = {
  old_hatchet: { id: "old_hatchet", name: "Old Hatchet", rarity: "Common", slot: "weapon", description: "A familiar village hatchet that has split wood, trimmed roots, and somehow become yours.", bonuses: { Might: 1 }, skills: ["scrappy_chop"], icon: "🪓" },
  turnipwood_blade: { id: "turnipwood_blade", name: "Turnipwood Blade", rarity: "Uncommon", slot: "weapon", description: "A surprisingly respectable sword carved from enchanted rootwood.", bonuses: { Might: 1, Precision: 1 }, skills: ["rootcut_lunge"], icon: "🗡️" },
  pebbleknock_hammer: { id: "pebbleknock_hammer", name: "Pebbleknock Hammer", rarity: "Uncommon", slot: "weapon", description: "A squat hammer with an extremely satisfying thunk.", bonuses: { Might: 2, Grit: 1 }, skills: ["pebbleknock_slam"], icon: "🔨" },
  kettle_helm: { id: "kettle_helm", name: "Apprentice Kettle Helm", rarity: "Common", slot: "helm", description: "Protective, practical, and a little soup-adjacent.", bonuses: { Guard: 1, Craft: 1 }, icon: "⛑️" },
  briar_vest: { id: "briar_vest", name: "Briarweave Vest", rarity: "Uncommon", slot: "armor", description: "A roadwarden vest stitched with thorn-resistant lining.", bonuses: { Guard: 1, Vitality: 1 }, icon: "🥋" },
  giggleleaf_cloak: { id: "giggleleaf_cloak", name: "Giggleleaf Cloak", rarity: "Uncommon", slot: "cloak", description: "A bright cloak that makes sneaking feel cheerful.", bonuses: { Agility: 1, Charm: 1 }, icon: "🍃" },
  friendmaker_cloak: { id: "friendmaker_cloak", name: "Friendmaker Cloak", rarity: "Uncommon", slot: "cloak", description: "A bright cloak that makes helpful people trust you faster.", bonuses: { Charm: 1, Heart: 1 }, icon: "🧥" },
  stormbell_charm: { id: "stormbell_charm", name: "Stormbell Charm", rarity: "Uncommon", slot: "trinket1", description: "A bell that crackles when you grin at danger.", bonuses: { Precision: 1, Will: 1 }, skills: ["spark_toss"], icon: "🔔" },
  lantern_pin: { id: "lantern_pin", name: "Lantern Pin", rarity: "Uncommon", slot: "trinket2", description: "A polished pin worn by dependable roadwardens.", bonuses: { Will: 1, Heart: 1 }, skills: ["roadwarden_resolve"], icon: "📌" },
  warden_chain: { id: "warden_chain", name: "Warden Chain", rarity: "Rare", slot: "trinket1", description: "A heavy chain-token pulled from the cellar guardian.", bonuses: { Guard: 1, Will: 1, Grit: 1 }, skills: ["rootbind"], icon: "⛓️" },
  edden_cloth: { id: "edden_cloth", name: "Edden's Blue Watch Cloth", rarity: "Story", type: "story", description: "A torn strip of blue watch-runner cloth found beside the sealed iron door. Proof that Edden reached the old way below Bramblecross.", icon: "🧵" },
  healing_fizzpop: { id: "healing_fizzpop", name: "Healing Fizzpop", rarity: "Crafted", type: "consumable", description: "Restores HP and turns your hair mint green for a while. Worth it.", effectText: "Use: Restore 10 HP", icon: "🧪" },
  trail_snack: { id: "trail_snack", name: "Trail Snack", rarity: "Common", type: "consumable", description: "A crunchy pocket snack that restores a bit of HP.", effectText: "Use: Restore 6 HP", icon: "🥨" },
  fizzberry_handpie: { id: "fizzberry_handpie", name: "Fizzberry Handpie", rarity: "Uncommon", type: "consumable", description: "A flaky pocket pie with suspiciously energetic berries inside.", effectText: "Use: Restore 8 HP", icon: "🥧" },
  bubbleburst_tonic: { id: "bubbleburst_tonic", name: "Bubbleburst Tonic", rarity: "Crafted", type: "consumable", description: "A fizzy brew that pops loudly and heals a little.", effectText: "Use: Restore 4 HP", icon: "🫧" },
  moonmint: { id: "moonmint", name: "Moonmint", rarity: "Common", type: "ingredient", description: "Cool, bright leaves used in cheerful tonics.", icon: "🌿" },
  bubblecap: { id: "bubblecap", name: "Bubblecap Mushroom", rarity: "Common", type: "ingredient", description: "A mushroom that literally bubbles when squeezed.", icon: "🍄" },
};

export const BATTLE_CONSUMABLES = {
  healing_fizzpop: { name: "Healing Fizzpop", heal: 10, description: "A minty burst that restores a solid chunk of HP.", allyTarget: true },
  trail_snack: { name: "Trail Snack", heal: 6, description: "A quick bite that patches you up in a pinch.", allyTarget: true },
  fizzberry_handpie: { name: "Fizzberry Handpie", heal: 8, description: "A sturdier snack with enough sugar and courage for a fight.", allyTarget: true },
  bubbleburst_tonic: { name: "Bubbleburst Tonic", heal: 4, description: "A fizzy quick-fix with unnecessary sound effects.", allyTarget: true },
};

export const SHOP_PRICES = {
  old_hatchet: 6, turnipwood_blade: 12, pebbleknock_hammer: 19, kettle_helm: 10, briar_vest: 16, giggleleaf_cloak: 17,
  friendmaker_cloak: 14, stormbell_charm: 18, lantern_pin: 15, warden_chain: 26, healing_fizzpop: 7, trail_snack: 5,
  fizzberry_handpie: 9, bubbleburst_tonic: 6, moonmint: 4, bubblecap: 4,
};
