import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { renderMaster } from './lib/chapter5-master-drawing.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets/reference/concept/environments/briarhold-approach-paint-v01');
const model=JSON.parse(await fs.readFile(path.join(root,'assets/reference/concept/environments/chapter-5-masters-v01/layout.json'),'utf8'));
const input=path.join(dir,'briarhold-approach-paint-v05.png'),metadata=await sharp(input).metadata();
// Export preparation only. The original and all generative edits stay untouched.
await sharp(input).resize(2048,1152,{fit:'fill'}).png().toFile(path.join(dir,'briarhold-approach-paint-v05-2048.png'));
await sharp(input).resize(2048,1152,{fit:'fill'}).webp({quality:90,effort:6}).toFile(path.join(dir,'briarhold-approach-paint-v05-2048.webp'));
// librsvg does not decode embedded WebP here; PNG is used for raster QA sheets.
// The browser review embeds the optimized WebP separately.
const painting='data:image/png;base64,'+(await fs.readFile(path.join(dir,'briarhold-approach-paint-v05-2048.png'))).toString('base64');
for(const lighting of [false,true]) {
  const svg=renderMaster(model,'approach',{lighting,marker:false,party:false,paths:false,triggers:false,sightlines:false,annotations:false,safe:false});
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir,lighting?'approach-fixed-light-revision2.png':'approach-geometry-revision2.png'));
}
const tiles=[];
for(const [i,node] of model.approach.nodes.entries()) {
  const svg=renderMaster(model,'approach',{paintingUrl:painting,node:node.id,frame:'phone390',lighting:false,paths:true,triggers:false,sightlines:false,annotations:false,clearance:true,safe:false});
  const png=await sharp(Buffer.from(svg)).resize(664,374).png().toBuffer();
  tiles.push({input:png,left:(i%2)*688+20,top:Math.floor(i/2)*420+62});
  tiles.push({input:Buffer.from(`<svg width="664" height="40"><text x="0" y="28" fill="#344b44" font-family="Arial" font-size="22">${node.id} / ${node.label}</text></svg>`),left:(i%2)*688+20,top:Math.floor(i/2)*420+20});
}
await sharp({create:{width:1396,height:2116,channels:3,background:'#eee5cf'}}).composite(tiles).png().toFile(path.join(dir,'painted-node-alignment-v05.png'));
const webp=await fs.stat(path.join(dir,'briarhold-approach-paint-v05-2048.webp'));
await fs.writeFile(path.join(dir,'paint-export.json'),JSON.stringify({status:'reference candidate; awaiting owner art review',generator:'built-in imagegen',selectedPass:'v05',ownerCorrections:['Natural wet runoff, no maintained trail','Shelter farther off road with unmarked uphill scramble'],native:{width:metadata.width,height:metadata.height},export:{width:2048,height:1152,webpBytes:webp.size,quality:90},normalization:'Full-image resize, no crop; native aspect differs from 16:9 by approximately 0.05%. No new image detail is created by export.',runtimeRegistered:false,modelRevision:model.revision},null,2)+'\n');
console.log(JSON.stringify({native:[metadata.width,metadata.height],export:[2048,1152],webpBytes:webp.size,modelRevision:model.revision}));
