export const COMPANION_OPTIONS = {
  rowan: { id: "rowan", name: "Rowan Reedshield", icon: "🛡️", role: "Guardian", style: "guardian", maxHp: 18, description: "Steady, protective, and serious about keeping ordinary people safe." },
  tilda: { id: "tilda", name: "Tilda Quickstep", icon: "🎯", role: "Skirmisher", style: "skirmisher", maxHp: 14, description: "Fast-talking, quick-moving, and good at being where trouble is not." },
  moss: { id: "moss", name: "Moss Fenmere", icon: "✨", role: "Sage", style: "sage", maxHp: 15, description: "Quiet, observant, and calm around old magic." },
};

export const COMPANION_PROGRESSION = {
  rowan: { xpCurve: [0, 40, 90], futurePaths: [{ id: "bulwark", name: "Bulwark", preview: "Leans into protection and holding the line." }, { id: "bannerguard", name: "Banner Guard", preview: "Adds stronger support and party recovery." }] },
  tilda: { xpCurve: [0, 40, 90], futurePaths: [{ id: "duelist", name: "Duelist", preview: "Pushes sharper damage and tempo." }, { id: "trickrunner", name: "Trickrunner", preview: "Leans into disruption and clever utility." }] },
  moss: { xpCurve: [0, 40, 90], futurePaths: [{ id: "wayhealer", name: "Wayhealer", preview: "Focuses on stronger healing." }, { id: "veilseer", name: "Veilseer", preview: "Leans into wards and subtle control." }] },
};
