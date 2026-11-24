import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'assets/reference/concepts/chapter-5-enemies');
const reviewVersion = process.argv[2] || 'v03';
if (!['v01', 'v02', 'v03'].includes(reviewVersion)) throw new Error('Use v01, v02 or v03 for the review version.');
const updated = reviewVersion !== 'v01';
const hasLocal = reviewVersion === 'v03';
const reviewDate = updated ? '2026-11-19' : '2026-11-18';
const entries = [
  { id: 'bracken-voss', name: 'Bracken Voss', role: updated ? 'Hearthvale command · seal and sabre' : 'Local command · seal and sabre', hp: 44, intent: 'False Order / Commanding Seal' },
  { id: 'thornroot-sentry', name: 'Thornroot Sentry', role: 'Bound roots · braced timber · feed cord', hp: 32, intent: 'Root Snare / Briar Sweep' },
  { id: 'thornseal-guard', name: 'Thornseal Guard', version: updated ? 'v02' : 'v01', role: updated ? 'Hearthvale elite · shield and ledger' : 'Living guard · shield and ledger', hp: 28, intent: 'Guard the Ledger / Thornseal Bash' },
];
if (hasLocal) entries.push({ id: 'rainroot-local-guard', name: 'Rainroot Local Guard', role: 'Ordinary local detail · buckler and spear', hp: 28, intent: 'Receiving / post / patrol roles' });
const images = {};
const exports = [];
for (const entry of entries) {
  const source = `${entry.id}-concept-${entry.version || 'v01'}.png`;
  const preview = `${entry.id}-portrait-${entry.version || 'v01'}.webp`;
  const metadata = await sharp(path.join(dir, source)).metadata();
  await sharp(path.join(dir, source)).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 86, effort: 6 }).toFile(path.join(dir, preview));
  const bytes = await fs.readFile(path.join(dir, preview));
  images[entry.id] = `data:image/webp;base64,${bytes.toString('base64')}`;
  exports.push({ id: entry.id, source, sourceWidth: metadata.width, sourceHeight: metadata.height, preview, previewBytes: bytes.length });
}
const card = (entry, index) => `<article class="battle-card"><div class="battle-portrait"><img src="${images[entry.id]}" alt="${entry.name} candidate"></div><h3>${entry.name}${index > 1 ? ` ${index - 1}` : ''}</h3><div class="meter" aria-hidden="true"></div><p>${entry.hp} / ${entry.hp} HP</p><p class="intent">${entry.intent}</p></article>`;
const introduction = hasLocal
  ? 'The owner has accepted Bracken, the Thornroot Sentry and both guard designs. Bracken and his elite detail have Hearthvale heritage; the ordinary local guards have Rainroot heritage. This reference review compares all four before role-aware runtime integration. The existing paper-and-wax Seal-Forged Sentry remains a separate enemy.'
  : updated
  ? 'The owner has established Bracken and his elite Thornseal detail as Hearthvale humans. Ordinary local receiving, post and investigating guards have Rainroot heritage. This review uses elite guard v02, with the existing Bracken and Sentry candidates; local guards need their own Rainroot art. Images remain in the reference pack while the owner tests.'
  : 'Three first-pass designs for Chapter 5. Bracken is a controlled local officeholder; the Thornseal Guard is a living shield bearer; the Sentry is a construct of timber, bound roots and ordinary fittings. These images are saved in the reference pack. The running playtest still uses its existing artwork and fallbacks.';
const localReview = hasLocal ? `<section><h2>Ordinary Rainroot station guards</h2><p class="caption">Local guard art stays distinct from the elite detail even where combat currently shares a profile.</p><div class="battle"><div class="battle-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${card({ ...entries[3], name: 'Rainroot Local Guard 1' }, 0)}${card({ ...entries[3], name: 'Rainroot Local Guard 2' }, 0)}</div></div></section>` : '';
const earlierSentry = hasLocal ? `data:image/webp;base64,${(await fs.readFile(path.join(root, 'assets/portraits/enemies/seal-forged-sentry-v01.webp'))).toString('base64')}` : '';
const sentryComparison = hasLocal ? `<section><h2>The earlier Sentry and the new one</h2><p class="caption">The existing Seal-Forged Sentry appears in Chapters 3 and 4. The Thornroot Sentry is Bracken's separate Chapter 5 support; the new design does not replace the old asset.</p><div class="gallery" style="grid-template-columns:repeat(2,minmax(0,1fr))"><figure class="portrait"><img src="${earlierSentry}" alt="Existing Seal-Forged Sentry"><figcaption><h3>Seal-Forged Sentry</h3><p>Existing production art · paper, wax, tags and thorn cord</p></figcaption></figure><figure class="portrait"><img src="${images['thornroot-sentry']}" alt="New Thornroot Sentry"><figcaption><h3>Thornroot Sentry</h3><p>Chapter 5 design · braced timber, bundled roots and feed cord</p></figcaption></figure></div></section>` : '';
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Briarhold enemy portrait candidates ${reviewVersion}</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#0b1218;color:#eee4cf;font:15px/1.6 Georgia,serif}main{max-width:1180px;margin:auto;padding:24px 16px 48px}h1{font-size:28px;line-height:1.25;margin:0 0 12px}h2{font-size:22px;margin:30px 0 12px}.intro{max-width:850px;color:#c9c1b0}.tag{font:11px system-ui;letter-spacing:.14em;text-transform:uppercase;color:#d6b775;margin-bottom:10px}.gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.portrait{margin:0;min-width:0;background:#141e22;border:1px solid #665a43;border-radius:12px;overflow:hidden}.portrait img{display:block;width:100%;height:auto;aspect-ratio:1}.portrait figcaption{padding:14px}.portrait h3{font-size:19px;line-height:1.3;margin:0}.portrait p{font-size:13px;color:#bdb4a0;margin:5px 0 0}.battle{padding:12px;border:1px solid #634d34;border-radius:18px;background:#171712}.battle-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.battle-card{min-width:0;border:1px solid #6b5a3e;border-radius:14px;background:#101719;padding:12px;font-family:system-ui,sans-serif}.battle-card h3{font-size:14px;line-height:1.35;margin:8px 0;overflow-wrap:anywhere}.battle-card p{font-size:11px;color:#c8c6b9;line-height:1.5;margin:5px 0}.battle-portrait{height:80px;width:100%;border:1px solid #424d4a;border-radius:12px;background:#0d1624;overflow:hidden}.battle-portrait img{display:block;width:100%;height:100%;object-fit:contain;padding:4px}.meter{height:6px;background:#b9773f;border-radius:999px}.caption{font:12px/1.6 system-ui,sans-serif;color:#bdb4a0}footer{border-top:1px solid #4c483b;margin-top:28px;padding-top:15px;color:#bdb4a0;font-size:13px}@media(max-width:1023px){.battle-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:639px){.gallery{grid-template-columns:1fr}.battle-portrait{height:64px}h1{font-size:24px}main{padding-top:16px}}
${hasLocal ? '.gallery{grid-template-columns:repeat(4,minmax(0,1fr))}@media(max-width:899px){.gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:639px){.gallery{grid-template-columns:1fr}}' : ''}
</style></head><body><main><div class="tag">Art review · ${reviewDate} · ${reviewVersion}</div><h1>Briarhold's command and its defenders</h1><p class="intro">${introduction}</p>
<section aria-labelledby="battle-title"><h2 id="battle-title">Four-enemy battle-card scale</h2><p class="caption">The current portrait treatment uses object-contain with 4 px padding: 80 px high above 640 px, 64 px below. Four columns above 1024 px; two on phones. This is a standalone visual review, not a playable battle or an in-game integration claim.</p><div class="battle"><div class="battle-grid">${[entries[0], entries[1], entries[2], entries[2]].map(card).join('')}</div></div></section>
${localReview}<section aria-labelledby="portrait-title"><h2 id="portrait-title">Full compositions</h2><div class="gallery">${entries.map(entry => `<figure class="portrait"><img src="${images[entry.id]}" alt="${entry.name} full portrait"><figcaption><h3>${entry.name}</h3><p>${entry.role}</p></figcaption></figure>`).join('')}</div></section>${sentryComparison}<footer>Generator: built-in image_gen. Native PNGs, exact prompts, optimized reference WebPs and provenance are retained beside this offline page. ${hasLocal ? 'All four current Chapter 5 designs are owner-accepted and await role-aware runtime integration.' : updated ? 'Hearthvale/Rainroot heritage assignments are owner-established; the individual portrait details remain reference candidates.' : 'These are first-pass identity candidates, not owner-approved final cast references.'} Remaining room masters/maps and narrative scenes stay on the production queue.</footer></main></body></html>`;
await fs.writeFile(path.join(dir, `enemy-portrait-review-${reviewVersion}.html`), html);
await fs.writeFile(path.join(dir, `export-${reviewVersion}.json`), `${JSON.stringify({ date: reviewDate, status: hasLocal ? 'owner-accepted designs; awaiting runtime integration' : 'reference candidates; not runtime registered', generator: 'built-in image_gen', entries: exports }, null, 2)}\n`);
console.log(JSON.stringify({ status: hasLocal ? 'owner-accepted designs; awaiting runtime integration' : 'reference candidates', entries: exports, review: path.relative(root, path.join(dir, `enemy-portrait-review-${reviewVersion}.html`)) }, null, 2));
