import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { renderMaster, neighbors, pointRectDistance, visibility } from './lib/chapter5-master-drawing.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'assets/reference/concept/environments/chapter-5-masters-v01');
const model=JSON.parse(await fs.readFile(path.join(output,'layout.json'),'utf8'));
const failures=[], metrics=[];
const assert=(condition,message)=>{if(!condition) failures.push(message);};
const interpolate=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
for(const key of ['approach','rescue']) {
  const map=model[key], ids=new Set(map.nodes.map(n=>n.id));
  assert(ids.size===map.nodes.length,`${key}: duplicate node IDs`);
  assert(Math.abs(map.source[0]/map.source[1]-map.bounds[2]/map.bounds[3])<1e-6,`${key}: export aspect differs from world bounds`);
  for(const edge of map.edges) assert(ids.has(edge.from)&&ids.has(edge.to),`${key}: missing edge endpoint`);
  for(const node of map.nodes) {
    const adjacent=neighbors(map,node.id), aliases=adjacent.map(e=>e.direction);
    assert(new Set(aliases).size===aliases.length,`${key}:${node.id}: ambiguous arrow alias`);
    const [x,y]=node.point,[bx,by,bw,bh]=map.bounds;
    assert(x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh,`${key}:${node.id}: outside art crop`);
    if(node.anchor) assert(Boolean(node.trigger),`${key}:${node.id}: missing anchor trigger`);
  }
  // Include every intermediate position: a cleared endpoint alone cannot prove a safe path.
  let physical=Infinity;
  for(const frame of Object.entries(model.frames)) {
    const [name,settings]=frame, diameter=settings.token/settings.mapWidth*map.bounds[2];
    const radius=(settings.token+model.marker.shadow*2)/settings.mapWidth*map.bounds[2]/2;
    let min=Infinity, at='';
    const phases=key==='rescue' ? ['initial','released','caught','braked','freed'] : ['initial'];
    for(const phase of phases) for(const edge of map.edges) {
      const a=map.nodes.find(n=>n.id===edge.from).point,b=map.nodes.find(n=>n.id===edge.to).point;
      const steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.025);
      for(let i=0;i<=steps;i++) {
        const p=interpolate(a,b,i/steps), center=[p[0],p[1]-(model.marker.anchorY-.5)*diameter];
        const solids=key==='rescue'&&phase!=='initial' ? map.solids.filter(s=>s.id!=='parked-cart').concat([
          {id:`cart-${phase}`,rect:[map.cart[phase][0]-.5,map.cart[phase][1]-.6,...map.cart.size]},
          {id:'fallen-sentry',rect:[48.67,16.42,1.66,1.36]}
        ]) : map.solids;
        for(const solid of solids) {
          const gap=pointRectDistance(center,solid.rect)-radius;
          if(gap<min) {min=gap;at=`${phase}: ${edge.from}→${edge.to} / ${solid.id}`;}
          physical=Math.min(physical,pointRectDistance(p,solid.rect)-model.marker.bodyRadius);
        }
        // Token/shadow stays inside the intended image, including along diagonals.
        const [x,y,w,h]=map.bounds;
        const cropGap=Math.min(center[0]-x-radius,x+w-center[0]-radius,center[1]-y-radius,y+h-center[1]-radius);
        assert(cropGap>=0,`${key}/${name}: token clips art at ${edge.from}→${edge.to}`);
      }
    }
    metrics.push({map:key,frame:name,minimumMarkerGapMetres:+min.toFixed(3),at});
    assert(min>=model.marker.solidClearance,`${key}/${name}: ${min.toFixed(3)}m marker gap at ${at}; needs ${model.marker.solidClearance}m`);
  }
  assert(physical>=.2,`${key}: human footprint intersects architecture`);
}
// Plot-specific checks protect the readable rescue instead of testing renderer string output.
const rescue=model.rescue, o=model.optics;
const actorPoints=[rescue.nodes.find(n=>n.id==='crown').point,...['maraCover','companionInitial','brackenInitial','sentryInitial','guardWest','guardEast'].map(id=>rescue.actors[id])];
for(let i=0;i<actorPoints.length;i++)for(let j=i+1;j<actorPoints.length;j++)assert(Math.hypot(actorPoints[i][0]-actorPoints[j][0],actorPoints[i][1]-actorPoints[j][1])>=model.marker.bodyRadius*2,'Initial actor footprints overlap');
const front=rescue.cart.braked[1]+rescue.cart.size[1]/2;
assert(Math.abs(rescue.cart.stepStart-front-.7)<.001,'Cart must stop 0.7m before the first step');
const grille=rescue.nodes.find(n=>n.id==='grille'),entry=rescue.nodes.find(n=>n.id==='r00');
const window=rescue.inspectionWindow,door=rescue.entranceOpening;
assert(grille.point[1]<entry.point[1],'Inspection grille must be above entry E');
assert(Math.max(grille.point[1],entry.point[1])+model.marker.bodyRadius<=door.span[0]-.1,'Observation route crosses in front of the doorway');
assert(rescue.edges.some(e=>e.from==='r00'&&e.to==='grille'&&e.direction==='up'),'Entry must reach grille directly to the north');
assert(rescue.edges.some(e=>e.from==='r00'&&e.to==='r01'&&e.gate),'Must observe Lio before approaching the doorway');
for(const target of o.grilleSightTargets) {
  const ray=[grille.point,target.point];
  const rayY=ray[0][1]+(window.wallX-ray[0][0])/(ray[1][0]-ray[0][0])*(ray[1][1]-ray[0][1]);
  assert(rayY>=window.span[0]&&rayY<=window.span[1],`${target.label} sight must pass through the actual window`);
  for(let t=0;t<1;t+=.005) {
    const point=interpolate(...ray,t);
    for(const solid of rescue.solids.filter(s=>['route-table','mara-console'].includes(s.id))) assert(pointRectDistance(point,solid.rect)>.05,`${target.label} sight blocked by ${solid.id}`);
  }
}
assert(model.approach.portals.every(p=>p.target==='briarholdHub:landing'),'Both exterior entrances must rejoin at landing');
assert(!model.sitePaths.some(p=>p.id==='hub-platform'),'Accidental direct hub/platform shortcut');
// Party light must cast a shadow behind the cart. The high guide beam is a separate layer.
function inside(point,polygon) {
  let result=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++) {
    const a=polygon[i],b=polygon[j];
    if((a[1]>point[1])!==(b[1]>point[1])&&point[0]<(b[0]-a[0])*(point[1]-a[1])/(b[1]-a[1])+a[0])result=!result;
  }
  return result;
}
const origin=[52.85,19.1],brake=[55.6,19.1];
assert(inside(brake,visibility(origin,rescue.partyRadius,rescue.solids.filter(s=>s.id!=='parked-cart'))),'Brake is beyond the representative light range, so occlusion check would prove nothing');
assert(!inside(brake,visibility(origin,rescue.partyRadius,rescue.solids)),'Cart occlusion fails to hide the far-side brake');
const report={status:failures.length?'FAIL':'PASS',modelRevision:model.revision,samplingMetres:.025,markerIncludesShadow:true,frames:model.frames,clearance:metrics,checks:['unique bidirectional arrow aliases','world/export aspect','anchor triggers and crop bounds','full movement-edge marker and human clearance','both entrances rejoin at landing','grille above entry without crossing doorway','all three grille views through aperture, clear of furniture','first sight before door approach','cart stopping distance','low party-light cart occlusion'],failures};
await fs.writeFile(path.join(output,'validation.json'),JSON.stringify(report,null,2)+'\n');
if(failures.length) {console.error(JSON.stringify(report,null,2));process.exit(1);}

const exports=[
 ['briarhold-site-layout-v01','site',{}],
 ['briarhold-approach-scale-v01','approach',{node:'ridge',clearance:true}],
 ['briarhold-approach-lighting-v01','approach',{node:'gate',lighting:true,clearance:false}],
 ['briarhold-rescue-scale-v01','rescue',{node:'carriage',clearance:true}],
 ['briarhold-rescue-lighting-closed-v01','rescue',{node:'grille',lighting:true,guide:false}],
 ['briarhold-rescue-lighting-open-v01','rescue',{node:'carriage',lighting:true,guide:true,stage:'caught'}]
];
for(const [name,view,options] of exports) {
  const svg=renderMaster(model,view,options);
  await fs.writeFile(path.join(output,name+'.svg'),svg);
  await sharp(Buffer.from(svg)).png().toFile(path.join(output,name+'.png'));
}
// A single review image is useful alongside the interactive, inspectable source.
const tiles=[];
for(let i=0;i<exports.length;i++) {
  const png=await sharp(path.join(output,exports[i][0]+'.png')).resize(960,720,{fit:'contain',background:'#eee5cf'}).png().toBuffer();
  tiles.push({input:png,left:(i%2)*984+24,top:Math.floor(i/2)*780+74});
  const caption=['01 / Coordinated site + floor plan','02 / Approach: scale + marker clearance','03 / Approach: night + exposed gate','04 / Rescue: scale + danger geometry','05 / Rescue: guide lamp closed','06 / Rescue: guide lamp open + cart caught'][i];
  tiles.push({input:Buffer.from(`<svg width="960" height="48"><text x="0" y="30" fill="#344b44" font-family="Arial" font-size="24">${caption}</text></svg>`),left:(i%2)*984+24,top:Math.floor(i/2)*780+24});
}
await sharp({create:{width:1992,height:2364,channels:3,background:'#f3eddf'}}).composite(tiles).png().toFile(path.join(output,'briarhold-masters-contact-sheet-v01.png'));
const overview=[];
for(const [i,view,caption] of [[0,'site','01 / Briarhold site layout'],[1,'approach','02 / Approach scale + night light'],[2,'rescue','03 / Rescue scale + amber guide light']]) {
  const svg=renderMaster(model,view,{lighting:view!=='site',node:view==='rescue'?'carriage':'ridge',stage:'caught',triggers:false,annotations:false,safe:false});
  overview.push({input:await sharp(Buffer.from(svg)).resize(520,420,{fit:'contain',background:'#eee5cf'}).png().toBuffer(),left:16+i*536,top:75});
  overview.push({input:Buffer.from(`<svg width="520" height="42"><text x="0" y="28" font-family="Arial" font-size="21" fill="#344b44">${caption}</text></svg>`),left:16+i*536,top:24});
}
await sharp({create:{width:1624,height:520,channels:3,background:'#eee5cf'}}).composite(overview).png().toFile(path.join(output,'briarhold-overview-v01.png'));
let moduleSource=await fs.readFile(path.join(root,'scripts/lib/chapter5-master-drawing.mjs'),'utf8');
moduleSource=moduleSource.replace(/^export /gm,'');
const html=await fs.readFile(path.join(root,'scripts/lib/chapter5-master-review.html'),'utf8');
let painting=null;
try{painting='data:image/webp;base64,'+(await fs.readFile(path.join(root,'assets/reference/concept/environments/briarhold-approach-paint-v01/briarhold-approach-paint-v05-2048.webp'))).toString('base64');}catch(error){if(error.code!=='ENOENT')throw error;}
let rescuePainting=null;
try{
  const dir=path.join(root,'assets/reference/concept/environments/briarhold-rescue-paint-v01');
  rescuePainting={};
  for(const state of ['closed','open'])rescuePainting[state]='data:image/webp;base64,'+(await fs.readFile(path.join(dir,`briarhold-rescue-${state}-v02-2048.webp`))).toString('base64');
  rescuePainting.cart='data:image/webp;base64,'+(await fs.readFile(path.join(dir,'briarhold-rescue-cart-v01-trimmed.webp'))).toString('base64');
}catch(error){if(error.code!=='ENOENT')throw error;rescuePainting=null;}
await fs.writeFile(path.join(output,'briarhold-review-v01.html'),html.replace('/* DRAWING_MODULE */',moduleSource).replace('/* LAYOUT_MODEL */',JSON.stringify(model)).replace('/* APPROACH_PAINTING */',JSON.stringify(painting)).replace('/* RESCUE_PAINTING */',JSON.stringify(rescuePainting)));
console.log(JSON.stringify({status:'PASS',exports:exports.length,clearance:metrics,output},null,2));
