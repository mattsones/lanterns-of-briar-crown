import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
import {interiorModel as model} from './lib/chapter5-interior-model.mjs';
import {drawInterior,drawOverview,neighbors} from './lib/chapter5-interior-drawing.mjs';
import {pointRectDistance} from './lib/chapter5-master-drawing.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'assets/reference/concept/environments/chapter-5-interior-masters-v01');
await fs.mkdir(output,{recursive:true});
const foundation=JSON.parse(await fs.readFile(path.join(root,'assets/reference/concept/environments/chapter-5-masters-v01/layout.json'),'utf8'));
const failures=[],metrics=[];const check=(ok,message)=>{if(!ok&&!failures.includes(message))failures.push(message);};
for(const map of model.maps){
  const nodes=new Map(map.nodes.map(n=>[n.id,n]));
  check(nodes.size===map.nodes.length,`${map.key}: duplicate node IDs`);
  check(Math.abs(map.source[0]/map.source[1]-map.bounds[2]/map.bounds[3])<1e-8,`${map.key}: crop aspect`);
  for(const n of map.nodes){const aliases=neighbors(map,n.id).map(e=>e.direction);check(new Set(aliases).size===aliases.length,`${map.key}/${n.id}: ambiguous direction`);}
  for(const p of map.portals.filter(p=>!['rescue','approach','workshop:outer-trough'].some(v=>p.target.startsWith(v)))){
    const [key,id]=p.target.split(':'),target=model.maps.find(m=>m.key===key)?.nodes.find(n=>n.id===id);
    check(target&&Math.hypot(target.point[0]-p.point[0],target.point[1]-p.point[1])<1e-8,`${map.key}: portal ${p.target} is not aligned`);
    check(model.maps.find(m=>m.key===key)?.portals.some(t=>t.target===`${map.key}:${p.from}`),`${map.key}: portal ${p.target} has no reciprocal exit`);
  }
  for(const [name,frame]of Object.entries(model.frames)){
    const d=frame.token/frame.mapWidth*map.bounds[2],r=(frame.token+6)/frame.mapWidth*map.bounds[2]/2;
    let minimum=Infinity,at='',minCrop=Infinity,physical=Infinity;
    for(const e of map.edges){
      check(nodes.has(e.from)&&nodes.has(e.to),`${map.key}: edge endpoint missing`);
      const a=nodes.get(e.from).point,b=nodes.get(e.to).point,steps=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.025);
      for(let i=0;i<=steps;i++){
        const p=[a[0]+(b[0]-a[0])*i/steps,a[1]+(b[1]-a[1])*i/steps],c=[p[0],p[1]-.2*d];
        for(const solid of map.solids.concat(map.props)){
          const gap=pointRectDistance(c,solid.rect)-r;
          if(gap<minimum){minimum=gap;at=`${e.from} → ${e.to} / ${solid.id}`;}
          physical=Math.min(physical,pointRectDistance(p,solid.rect)-model.marker.bodyRadius);
        }
        const [x,y,w,h]=map.bounds;minCrop=Math.min(minCrop,c[0]-r-x,x+w-c[0]-r,c[1]-r-y,y+h-c[1]-r);
        for(let angle=0;angle<Math.PI*2;angle+=Math.PI/4){
          const body=[p[0]+Math.cos(angle)*.3,p[1]+Math.sin(angle)*.3];
          check(map.floors.some(f=>pointRectDistance(body,f.rect)<1e-6),`${map.key}: human footprint leaves floor on ${e.from} → ${e.to}`);
        }
      }
    }
    check(minimum>=model.marker.solidClearance,`${map.key}/${name}: ${minimum.toFixed(3)}m UI gap at ${at}; needs 0.2m`);
    check(physical>=.2,`${map.key}/${name}: human footprint intersects solid`);
    check(minCrop>=0,`${map.key}/${name}: marker clips crop by ${(-minCrop).toFixed(3)}m`);
    metrics.push({map:map.key,frame:name,minimumGapMetres:+minimum.toFixed(3),at,cropGapMetres:+minCrop.toFixed(3),physicalGapMetres:+physical.toFixed(3)});
  }
}
check(!model.topology.some(e=>e[0]==='hub'&&e[1]==='lanterns'),'Accidental hub/platform shortcut');
check(model.maps[0].nodes.find(n=>n.id==='door').point[1]===foundation.rescue.nodes.find(n=>n.id==='r00').point[1],'Existing rescue entry alignment changed');
function blocksSight(from,to,rect){
  for(let i=0;i<=1000;i++){
    const point=from.map((coordinate,axis)=>coordinate+(to[axis]-coordinate)*i/1000);
    if(pointRectDistance(point,rect)===0)return true;
  }
  return false;
}
const hub=model.maps.find(map=>map.key==='hub');
const recordsApproach=['landing','h01','hub','h02','hubRecords'];
const corridorReturn=hub.solids.find(wall=>wall.id==='guard-corridor-return').rect;
for(const guard of hub.actors.filter(actor=>actor.id.startsWith('post-'))){
  for(const id of recordsApproach){
    const waypoint=hub.nodes.find(node=>node.id===id);
    check(blocksSight(guard.point,waypoint.point,corridorReturn),`Posted guard sees the records approach at ${id}`);
  }
}
const platform=model.maps.find(map=>map.key==='lanterns');
const crossing=platform.nodes.find(node=>node.id==='signalCrossing').point;
const signals=platform.nodes.find(node=>node.id==='lanterns').point;
for(const guard of hub.actors.filter(actor=>actor.id.startsWith('post-'))){
  check(!platform.solids.some(wall=>blocksSight(guard.point,crossing,wall.rect)),
    'The open signal crossing is hidden from '+guard.label+' ('+guard.id+')');
  check(platform.solids.some(wall=>blocksSight(guard.point,signals,wall.rect)),
    'The signal operating position is visible from '+guard.label+' ('+guard.id+')');
}
// A safe token route alone does not establish the authored hiding place.
for(const [key,observer,cover]of [['ledger','officer','record-crates'],['workshop','dessa','cooling-rack'],['workshop','orren','cooling-rack']]){
  const map=model.maps.find(m=>m.key===key),a=map.actors.find(v=>v.id===observer).point,b=map.nodes.find(n=>n.id===map.defaultNode).point,rack=map.props.find(p=>p.id===cover).rect;
  check(blocksSight(a,b,rack),`${key}: initial crouching cover does not screen the observer`);
}
const validation={status:failures.length?'FAIL':'PASS',date:model.date,revision:model.revision,samplingMetres:.025,checks:['all movement edges sampled at <= 0.025 m','32/52 px token plus 3 px shadow and -70% anchor','0.2 m wall/prop stand-off','human footprint inside drawn floor','unique reciprocal arrow aliases','paired same-coordinate crop transitions','guard corridor return screens records approach','signal crossing exposed and controls screened from posted guards','records crates and workshop rack screen initial crouching cover','existing rescue entry and topology preserved'],metrics,failures};
await fs.writeFile(path.join(output,'layout.json'),JSON.stringify(model,null,2)+'\n');
await fs.writeFile(path.join(output,'validation.json'),JSON.stringify(validation,null,2)+'\n');
if(failures.length){console.error(JSON.stringify(validation,null,2));process.exit(1);}
const exports=[];
for(const map of model.maps)for(const [suffix,options]of [['scale',{clearance:true}],['lighting-closed',{light:true}],['lighting-open',{light:true,guide:true}],['composition',{paths:false,labels:false,actors:false,marker:false,party:false,light:true}]]){
  const name=`briarhold-${map.key}-${suffix}-v01`,svg=drawInterior(model,map.key,options);
  await fs.writeFile(path.join(output,name+'.svg'),svg);await sharp(Buffer.from(svg)).png().toFile(path.join(output,name+'.png'));exports.push(name);
}
const overview=drawOverview(model,foundation);
await fs.writeFile(path.join(output,'briarhold-interior-layout-v01.svg'),overview);
await sharp(Buffer.from(overview)).png().toFile(path.join(output,'briarhold-interior-layout-v01.png'));
const tiles=[];
for(const [i,map]of model.maps.entries()){
  for(const [j,suffix]of ['scale','lighting-closed'].entries()){
    const name=`briarhold-${map.key}-${suffix}-v01`;
    tiles.push({input:await sharp(path.join(output,name+'.png')).resize(900,760,{fit:'contain',background:'#eee5d0'}).png().toBuffer(),left:32+j*936,top:80+i*830});
    tiles.push({input:Buffer.from(`<svg width="900" height="50"><text x="0" y="31" font-family="Arial" font-size="24" fill="#344b40">${i+1} · ${map.shortTitle} · ${j?'closed lighting':'navigation / phone marker'}</text></svg>`),left:32+j*936,top:24+i*830});
  }
}
await sharp({create:{width:1900,height:3340,channels:3,background:'#eee5d0'}}).composite(tiles).png().toFile(path.join(output,'briarhold-interior-masters-contact-sheet-v01.png'));
// The standalone review embeds all geometry and the already accepted rescue painting.
const utilities=(await fs.readFile(path.join(root,'scripts/lib/chapter5-master-drawing.mjs'),'utf8')).split('export function renderMaster')[0].replaceAll('export ','');
const drawing=(await fs.readFile(path.join(root,'scripts/lib/chapter5-interior-drawing.mjs'),'utf8')).replace(/^import .*;\r?\n/gm,'').replace(/^export \{neighbors\};\r?\n/gm,'').replaceAll('export function','function');
const rescue={};for(const state of ['closed','open'])rescue[state]='data:image/webp;base64,'+(await fs.readFile(path.join(root,`assets/maps/briarhold-rescue-${state}-v02.webp`))).toString('base64');
const hubPaint={};
for(const state of ['closed','open']){
  const painting=await fs.readFile(path.join(output,'../briarhold-hub-paint-v01',`briarhold-hub-${state}-v03-2048.webp`));
  hubPaint[state]='data:image/webp;base64,'+painting.toString('base64');
}
const recordsPaint='data:image/webp;base64,'+(await fs.readFile(path.join(output,'../briarhold-records-paint-v01/briarhold-records-v06-2048.webp'))).toString('base64');
const workshopPaint='data:image/webp;base64,'+(await fs.readFile(path.join(output,'../briarhold-workshop-paint-v01/briarhold-workshop-v02-2048.webp'))).toString('base64');
const template=await fs.readFile(path.join(root,'scripts/lib/chapter5-interior-review.html'),'utf8');
await fs.writeFile(path.join(output,'briarhold-interior-review-v01.html'),template.replace('/* UTILITIES */',utilities).replace('/* DRAWING */',drawing).replace('/* MODEL */',JSON.stringify(model)).replace('/* FOUNDATION */',JSON.stringify(foundation)).replace('/* RESCUE */',JSON.stringify(rescue)).replace('/* HUB PAINT */',JSON.stringify(hubPaint)).replace('/* RECORDS PAINT */',JSON.stringify(recordsPaint)).replace('/* WORKSHOP PAINT */',JSON.stringify(workshopPaint)));
console.log(JSON.stringify({status:'PASS',exports:exports.length+1,metrics,output},null,2));
