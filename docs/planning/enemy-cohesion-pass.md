# Enemy Art and Combat Cohesion Pass

Status: planned follow-up after the current Chapter 4 enemy production work.

Review every enemy as one combined character-design and combat-design problem. The pass has two required checks:

1. **Portrait finish:** inspect exposed faces and skin at dialogue/battle-card size. Smooth mottled, crosshatched, stippled, canvas-like, pixel-like, or overly chunky paint texture where needed while preserving identity, expression, age, silhouette, costume, props, environment, and the handmade storybook finish.
2. **Name/look/environment/mechanics cohesion:** verify that each enemy's name, silhouette, equipment, location, HP, damage profile, intent names, and implemented effects communicate the same role. An evocative intent name cannot remain a cosmetic label if the portrait and encounter promise protection, control, movement, construction, tracking, or another distinct behavior.

## Roster

- Bramble Boar
- Thorncoat Ruffian
- Thorny Hound
- Rustroot Skulk
- Briar Knot Warden
- Briar Roadwatcher
- False Sign Scratcher
- Thorn-Collared Hound
- Briar Cargo Runner
- Seal-Forged Sentry
- Briar Relay Guard
- Crown Whisperer
- Bracken Voss
- Thornseal Guard
- Thornroot Sentry

## Review record for each enemy

- Current and recommended portrait version
- Smoothing required: yes/no, with the specific affected area
- Name and visual-role read
- Encounter and environmental read
- Current HP and average damage by intent
- Current implemented effect, if any
- Mismatch or redundancy with another enemy
- Recommended art or mechanics correction
- Owner approval and integration status

## Acceptance criteria

- Every exposed face is readable at the actual battle-card crop and meets the restrained skin-rendering standard in `docs/art/art-direction.md`.
- Every intent accurately previews what the action does.
- Mechanically distinct names and silhouettes produce perceptibly distinct combat decisions.
- Enemies sharing an encounter complement rather than duplicate one another.
- Enemy mechanics remain understandable through the intent panel, status badges, and battle log.
- Approved changes receive focused rules coverage and affected-chapter browser checks.

The Briar Relay Guard and Crown Whisperer are the first completed mechanics case study for this pass: the guard gains real route-protection behavior, while the Whisperer inflicts Shaken and bypasses party Guard.
