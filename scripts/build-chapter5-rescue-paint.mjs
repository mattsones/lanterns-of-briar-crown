import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {renderMaster} from './lib/chapter5-master-drawing.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets/reference/concept/environments/briarhold-rescue-paint-v01');
const model=JSON.parse(await fs.readFile(path.join(root,'assets/reference/concept/environments/chapter-5-masters-v01/layout.json'),'utf8'));
const report={status:'reference candidate; owner review pending',generator:'built-in imagegen',modelRevision:model.revision,backgrounds:{},cart:{},runtimeRegistered:false,correction:'Ordinary free-wheeled workcart on uneven stone; no floor tracks, paired guides or brass strips'};
const backgrounds={};
for(const state of ['geometry','closed','open']) {
  const svg=renderMaster(model,'rescue',{lighting:state!=='geometry',guide:state==='open',actors:false,marker:false,party:false,paths:false,triggers:false,sightlines:false,clearance:false,annotations:false,safe:false});
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir,`rescue-${state}-reference-r4.png`));
}
for(const state of ['closed','open']) {
  const input=path.join(dir,`briarhold-rescue-${state}-v02.png`),m=await sharp(input).metadata();
  await sharp(input).resize(2048,1536,{fit:'fill'}).png().toFile(path.join(dir,`briarhold-rescue-${state}-v02-2048.png`));
  const dest=path.join(dir,`briarhold-rescue-${state}-v02-2048.webp`);
  await sharp(input).resize(2048,1536,{fit:'fill'}).webp({quality:90,effort:6}).toFile(dest);
  backgrounds[state]='data:image/png;base64,'+(await fs.readFile(path.join(dir,`briarhold-rescue-${state}-v02-2048.png`))).toString('base64');
  report.backgrounds[state]={native:[m.width,m.height],export:[2048,1536],bytes:(await fs.stat(dest)).size,quality:90};
}
const cart=path.join(dir,'briarhold-rescue-cart-v01.png'),cartMeta=await sharp(cart).metadata();
if(!cartMeta.hasAlpha)throw new Error('Generated cart has no alpha channel');
const cartOut=path.join(dir,'briarhold-rescue-cart-v01-trimmed.png');
await sharp(cart).trim().resize(448,384,{fit:'fill'}).png().toFile(cartOut);
await sharp(cartOut).webp({quality:92,alphaQuality:100,effort:6}).toFile(path.join(dir,'briarhold-rescue-cart-v01-trimmed.webp'));
const {data:raw,info}=await sharp(cartOut).ensureAlpha().raw().toBuffer({resolveWithObject:true});
let transparent=0,opaque=0;
for(let i=3;i<raw.length;i+=info.channels){if(raw[i]===0)transparent++;if(raw[i]===255)opaque++;}
if(!transparent||!opaque)throw new Error('Cart alpha does not contain both empty and solid regions');
report.cart={native:[cartMeta.width,cartMeta.height],export:[448,384],transparentPixels:transparent,opaquePixels:opaque,worldBounds:[1.4,1.2],independentBrakeAndCuff:true};
const cartUrl='data:image/png;base64,'+(await fs.readFile(cartOut)).toString('base64');
for(const state of ['closed','open']) {
  const svg=renderMaster(model,'rescue',{paintingUrl:backgrounds[state],cartUrl,guide:state==='open',actorMarkers:false,marker:false,party:false,lighting:false,paths:false,triggers:false,sightlines:false,clearance:false,annotations:false,safe:false});
  await sharp(Buffer.from(svg)).png().toFile(path.join(dir,`rescue-${state}-cart-preview-v02.png`));
}
const comparison=[];
for(const [i,state] of ['closed','open'].entries()) {
  comparison.push({input:await sharp(path.join(dir,`rescue-${state}-cart-preview-v02.png`)).resize(768,576).png().toBuffer(),left:20+i*788,top:66});
  comparison.push({input:Buffer.from(`<svg width="768" height="42"><text x="0" y="29" font-family="Arial" font-size="23" fill="#344b44">${state==='closed'?'Guide closed / green work lights':'Guide open / amber floor and brake light'}</text></svg>`),left:20+i*788,top:16});
}
await sharp({create:{width:1596,height:662,channels:3,background:'#eee5cf'}}).composite(comparison).png().toFile(path.join(dir,'rescue-lighting-comparison-v02.png'));
const tiles=[];
for(const [i,node] of model.rescue.nodes.entries()) {
  const svg=renderMaster(model,'rescue',{paintingUrl:backgrounds.open,cartUrl,node:node.id,frame:'phone390',guide:true,lighting:false,paths:true,actorMarkers:false,triggers:false,sightlines:node.id==='grille',annotations:false,clearance:true,safe:false});
  tiles.push({input:await sharp(Buffer.from(svg)).resize(664,498).png().toBuffer(),left:20+(i%2)*688,top:62+Math.floor(i/2)*544});
  tiles.push({input:Buffer.from(`<svg width="664" height="42"><text x="0" y="29" font-family="Arial" font-size="21" fill="#344b44">${node.id} / ${node.label}</text></svg>`),left:20+(i%2)*688,top:20+Math.floor(i/2)*544});
}
await sharp({create:{width:1396,height:Math.ceil(model.rescue.nodes.length/2)*544+20,channels:3,background:'#eee5cf'}}).composite(tiles).png().toFile(path.join(dir,'painted-node-alignment-v02.png'));
await fs.writeFile(path.join(dir,'paint-export.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
