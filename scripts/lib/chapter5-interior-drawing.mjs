import {escapeText,neighbors,visibility} from './chapter5-master-drawing.mjs';
export {neighbors};
const propTags={'hub-pier':'Pier','tally-rack':'Tally rack','landing-crates':'Stores','court-cistern':'Covered cistern','court-stores':'Blankets','guard-chairs':'Chairs','records-desk':'Writing desk','record-crates':'Crate cover','records-supply-crate':'Supply crate','copying-bench':'Spare desk','tally-board':'Side tally','record-cabinet':'Shelves','hand-press':'Press','cooling-rack':'Cooling rack','tool-bench':'Stamp chest','prep-bench':'Packet prep','pack-bench':'Inspect & pack','empty-tray-shelf':'Empty trays','wax-stove':'Wax stove','feed-machine':'Brace feed','quenching-trough':'Outer trough','signal-racks':'3 signal lamps','pane-rack':'Pane storage','guide-lamp':'Amber guide','transmission-control':'Transmit','rail-west':'Rail','rail-south':'Rail'};
const nodeTags={landing:'Landing',h01:'Passage',hub:'Cover',h02:'Up',hubRecords:'Records',h03:'Down',hubWorkshop:'Workshop',door:'Inner post',hubSignal:'Signals',courtApproach:'Court approach',h05:'Court path',h06:'Threshold',gathering:'Court',recordsHub:'Hub',l01:'Threshold',ledger:'Cover',workshopHub:'Hub',w01:'Wait here',workshopCrossing:'Lamplit crossing',workshop:'Rack cover',w02:'Up',workshopSignal:'Signals',signalWorkshop:'Workshop',s01:'Stair head',signalCrossing:'Exposed crossing',lanterns:'Signals',s02:'Turn',signalHub:'Inner post'};
const actorTags={'post-one':'Guard','post-two':'Guard','foreman':'Lamp','bearer':'Load','rest-party':'Party','clerk':'Clerk','officer':'Officer','officer-tally':'Officer','bound-officer':'Bound','freed-clerk':'Clerk','orren':'Laborer','dessa':'Supervisor','orren-trough':'Laborer','dessa-trough':'Supervisor','dessa-bound':'Bound','orren-cover':'Laborer'};
export function drawInterior(model,key,options={}){
  const map=model.maps.find(m=>m.key===key),o={node:map.defaultNode,frame:'phone390',paths:true,labels:true,light:false,party:true,guide:false,clearance:false,actors:true,marker:true,state:'occupied',...options};
  const [w,h]=map.source,[bx,by,bw,bh]=map.bounds,s=w/bw,frame=model.frames[o.frame];
  const X=x=>(x-bx)*s,Y=y=>(y-by)*s,P=p=>`${X(p[0])},${Y(p[1])}`;
  const rect=(r,a='')=>`<rect x="${X(r[0])}" y="${Y(r[1])}" width="${r[2]*s}" height="${r[3]*s}" ${a}/>`;
  const circle=(p,r,a='')=>`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${r*s}" ${a}/>`;
  const line=(p,a='')=>`<polyline points="${p.map(P).join(' ')}" fill="none" ${a}/>`;
  const polygon=(p,a='')=>`<polygon points="${p.map(P).join(' ')}" ${a}/>`;
  const text=(p,t,size=.25,a='')=>`<text x="${X(p[0])}" y="${Y(p[1])}" font-size="${size*s}" ${a}>${escapeText(t)}</text>`;
  let art='',lighting='',annotation='',navigation='';
  const defs=`<defs><pattern id="stone" width="${s}" height="${s*.72}" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill="#cfc3a9"/><path d="M0 0H${s}V${s*.72}H0ZM${s*.43} 0V${s*.72}" stroke="#948f7b" stroke-width="${s*.014}" fill="none"/></pattern><pattern id="boards" width="${s*.25}" height="${s*1.3}" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill="#c2a980"/><path d="M0 0V${s*1.3}H${s*.25}" fill="none" stroke="#8b785d" stroke-width="${s*.015}"/></pattern><pattern id="wall" width="${s*.9}" height="${s*.4}" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill="#737e70"/><path d="M0 0H${s*.9}V${s*.4}H0Z" fill="none" stroke="#46564c" stroke-width="${s*.025}"/></pattern></defs>`;
  art+=rect(map.bounds,'fill="#a1ad98"');
  // Context is intentionally blank: neighboring room interiors are not visible through roofs.
  for(const f of map.floors){
    const fill=f.material==='boards'?'url(#boards)':f.material==='court'?'#c1bda3':f.material==='yard'?'#849780':'url(#stone)';
    art+=rect(f.rect,`fill="${fill}" stroke="#6f7b69" stroke-width="${.035*s}"`);
    if(f.material.startsWith('stairs')){
      const [x,y,rw,rh]=f.rect;
      for(let d=.28;d<(rw>rh?rw:rh);d+=.28)art+=line(rw>rh?[[x+d,y],[x+d,y+rh]]:[[x,y+d],[x+rw,y+d]],`stroke="#6d786a" stroke-width="${.035*s}" opacity=".5"`);
    }
  }
  for(const wall of map.solids){
    const isWorkWindow=wall.id==='workshop-window';
    art+=rect(wall.rect,`fill="${isWorkWindow?'#d8af6c':'url(#wall)'}" stroke="#344c42" stroke-width="${s*.035}"`);
    if(isWorkWindow&&o.labels)annotation+=text([wall.rect[0]-.12,wall.rect[1]+.42],'Window',.22,'text-anchor="end" class="label"');
  }
  for(const p of map.props){
    const fill={stone:'#818c7e',iron:'#546b65',water:'#6d9b9c',wood:'#a77e50'}[p.kind];
    art+=rect(p.rect,`fill="${fill}" stroke="#3d5047" stroke-width="${s*.045}" rx="${s*.045}"`);
    if(p.id==='hand-press'){
      const [x,y,width,height]=p.rect;
      art+=line([[x+width*.4,y+height*.16],[x+width*.4,y+height*.84],[x+width*.88,y+height*.5]],`stroke="#263e39" stroke-width="${s*.1}"`);
    }
    if(p.id==='signal-racks')for(let i=0;i<3;i++)art+=circle([p.rect[0]+p.rect[2]/2,p.rect[1]+.5+i*1.1],.24,'fill="#e0b86b" stroke="#43594d" stroke-width="4"');
    if(p.id==='records-desk')art+=rect([39.45,7.05,.8,.45],'fill="#e5dfca" opacity=".9"');
    if(p.id==='copying-bench')art+=rect([35.69,9.37,.45,.8],'fill="#e5dfca" opacity=".9"');
    if(p.id==='guide-lamp')art+=circle([43,24],.18,`fill="${o.guide?'#ffd383':'#806c4c'}"`);
    if(p.id==='court-cistern')art+=circle([23.75,22.1],.5,'fill="#b4bdb0" stroke="#536f64" stroke-width="4"');
    if(o.labels)annotation+=text([p.rect[0]+p.rect[2]/2,p.rect[1]-.16],propTags[p.id]||p.label,.22,'text-anchor="middle" class="label"');
  }
  const solids=map.solids.concat(map.props);
  const active=map.nodes.find(n=>n.id===o.node)||map.nodes.find(n=>n.id===map.defaultNode);
  if(o.light){
    lighting+=rect(map.bounds,'fill="#10292d" opacity=".69"');
    for(const lamp of map.fixedLights)lighting+=polygon(visibility(lamp.point,lamp.radius,solids),`fill="${lamp.color==='green'?'#81ab78':'#f1c278'}" opacity=".29"`);
    if(o.party)lighting+=polygon(visibility(active.point,map.partyRadius,solids),'fill="#f7d8a5" opacity=".23"');
    if(o.guide&&map.guideFan)lighting+=polygon(map.guideFan,'fill="#ffc66b" opacity=".48" stroke="#f0bd6e" stroke-width="3"');
  }
  for(const lamp of map.fixedLights)lighting+=circle(lamp.point,.075,`fill="${lamp.color==='green'?'#a9d08a':'#ffe0a1'}" stroke="#725c3d" stroke-width="3"`);
  if(o.actors)for(const a of map.actors.filter(a=>a.states.includes(o.state))){
    const captive=/clerk|orren|party/.test(a.id),p=a.point;
    navigation+=circle(p,.3,`fill="${captive?'#ddd8ba':'#746054'}" stroke="#303f39" stroke-width="${s*.04}"`);
    if(o.labels)annotation+=text([p[0],p[1]+.6],actorTags[a.id]||a.label,.21,'text-anchor="middle" class="label"');
  }
  if(o.paths){
    for(const e of map.edges){
      const a=map.nodes.find(n=>n.id===e.from).point,b=map.nodes.find(n=>n.id===e.to).point;
      navigation+=line([a,b],`stroke="${e.gate?'#b27045':'#178b85'}" stroke-width="${s*.055}" ${e.gate?`stroke-dasharray="${s*.16} ${s*.1}"`:''}`);
    }
    for(const p of map.portals)navigation+=circle(p.point,.18,`fill="#eee1b8" stroke="#a36338" stroke-width="${s*.05}"`);
    for(const sight of map.sightlines||[])navigation+=line(sight.points,`stroke="#5a9db2" stroke-width="${s*.04}" stroke-dasharray="${s*.15} ${s*.12}"`);
  }
  for(const n of map.nodes){
    if(o.paths)navigation+=circle(n.point,.11,'fill="#e1edda" stroke="#247d75" stroke-width="4"');
    if(o.paths&&n.trigger)navigation+=rect([n.point[0]-.5,n.point[1]-.55,1,1.1],`fill="none" stroke="#a95837" stroke-width="${s*.025}" stroke-dasharray="${s*.13} ${s*.09}"`);
    if(o.labels&&n.id!==active.id)annotation+=text([n.point[0],n.point[1]+.53],nodeTags[n.id]||n.label,.23,'text-anchor="middle" class="label"');
    navigation+=circle(n.point,22/frame.mapWidth*bw,`fill="transparent" data-node="${n.id}" style="cursor:pointer"`);
  }
  const diameter=frame.token/frame.mapWidth*bw,r=diameter/2,center=[active.point[0],active.point[1]-.2*diameter];
  if(o.clearance&&o.marker){
    navigation+=circle(center,r+3/frame.mapWidth*bw,`fill="none" stroke="#bd714b" stroke-width="${s*.025}" stroke-dasharray="${s*.12} ${s*.1}"`);
    navigation+=circle(active.point,.3,`fill="none" stroke="#555052" stroke-width="${s*.025}"`);
  }
  if(o.marker){navigation+=circle(center,r-1/frame.mapWidth*bw,`id="hero" fill="#315c5f" stroke="#f3d389" stroke-width="${2/frame.mapWidth*w}" pointer-events="none"`);
    navigation+=text([center[0],center[1]+r*.27],'H',diameter*.4,'fill="#fff5d9" text-anchor="middle" pointer-events="none"');}
  if(o.labels){
    annotation+=text([bx+.32,by+.56],`${map.shortTitle.toUpperCase()} · ${map.level>0?'+':''}${map.level.toFixed(1)} m`,.32,'font-weight="bold" fill="#2f493e"');
    annotation+=text([bx+.32,by+bh-.35],'N ↑     Metres · marker + 3 px shadow',.23,'fill="#2f493e"');
  }
  if(o.painting){
    art=`<image id="interior-paint-image" width="${w}" height="${h}" href="${o.painting}"/>`;
    lighting=o.light&&o.party?polygon(visibility(active.point,map.partyRadius,solids),'fill="#f7d8a5" opacity=".18"'):'';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeText(map.title)}"><style>text{font-family:Arial,sans-serif}.label{fill:#263f35;paint-order:stroke;stroke:#e4dcc7;stroke-width:${s*.045}px;stroke-linejoin:round}</style>${defs}<g id="architecture">${art}</g><g id="lighting">${lighting}</g><g id="navigation">${navigation}</g><g id="labels" pointer-events="none">${annotation}</g></svg>`;
}

export function drawOverview(model,foundation){
  const w=2048,h=1680,b=[21,5,42,28],s=44,X=x=>76+(x-b[0])*s,Y=y=>200+(y-b[1])*s;
  const rect=(r,a)=>`<rect x="${X(r[0])}" y="${Y(r[1])}" width="${r[2]*s}" height="${r[3]*s}" ${a}/>`;
  const text=(x,y,t,size=21,a='')=>`<text x="${x}" y="${y}" font-size="${size}" ${a}>${escapeText(t)}</text>`;
  const palette=['#168b82','#416cb0','#b27d31','#8b5b91'];let out='';
  // Rooms establish architecture; zoom crops are drawn separately to avoid implying corridors through rooms at another level.
  for(const map of model.maps)for(const f of map.floors)out+=rect(f.rect,`fill="#cfc4a7" stroke="#7c8a75" stroke-width="2"`);
  for(const map of model.maps){for(const wall of map.solids)out+=rect(wall.rect,'fill="#637967"');for(const p of map.props)out+=rect(p.rect,'fill="#a38358"');}
  for(const room of foundation.rooms.filter(r=>['gallery','crown','cells'].includes(r.id)))out+=rect(room.rect,'fill="#cec3aa" stroke="#6c7163" stroke-width="4"');
  for(const solid of foundation.rescue.solids)out+=rect(solid.rect,`fill="${['route-table','mara-console'].includes(solid.id)?'#a17a51':'#6c7d6d'}"`);
  const poly=(points,a)=>`<polyline points="${points.map(p=>`${X(p[0])},${Y(p[1])}`).join(' ')}" fill="none" ${a}/>`;
  for(const [i,map]of model.maps.entries()){
    for(const e of map.edges){const a=map.nodes.find(n=>n.id===e.from),z=map.nodes.find(n=>n.id===e.to);out+=poly([a.point,z.point],`stroke="${palette[i]}" stroke-width="4"`);}
    for(const n of map.nodes.filter(n=>n.trigger))out+=`<circle cx="${X(n.point[0])}" cy="${Y(n.point[1])}" r="6" fill="${palette[i]}"/>`;
  }
  for(const e of foundation.rescue.edges)out+=poly([foundation.rescue.nodes.find(n=>n.id===e.from).point,foundation.rescue.nodes.find(n=>n.id===e.to).point],'stroke="#b45e44" stroke-width="4"');
  const innerDoor=model.maps.find(map=>map.key==='hub').nodes.find(node=>node.id==='door');
  const inspectionEntry=foundation.rescue.nodes.find(node=>node.id==='r00');
  out+=poly([innerDoor.point,inspectionEntry.point],'stroke="#b45e44" stroke-width="4" stroke-dasharray="8 6"');
  out+=poly([[29.5,17.3],[32,17.3]],'stroke="#426c70" stroke-width="4"');
  out+=poly([[29.5,28.2],[31,26],[32,20],[32,17.3]],'stroke="#63849a" stroke-width="3" stroke-dasharray="8 7"');
  out+=poly([model.guide.lamp,model.guide.hubTarget],'stroke="#dca84c" stroke-width="4" stroke-dasharray="10 5"');
  out+=poly([model.guide.lamp,model.guide.rescueOpening,model.guide.brake],'stroke="#dca84c" stroke-width="4" stroke-dasharray="10 5"');
  const captions=[[[37.0,7.2],'2 · RECORDS  +2.8 m'],[[29.6,14.8],'SERVICE LANDING'],[[36.1,15.6],'1 · HUB  0 m'],[[23.0,23.6],'SHELTERED COURT'],[[29.8,29.8],'3 · WORKSHOP  −2 m'],[[40.0,28.9],'4 · SIGNALS  +3.4 m'],[[47,12.4],'5 · RESCUE  0 m'],[[56.5,24.7],'CELLS'],[[42.6,13],'GRILLE']];
  for(const [p,t]of captions)out+=text(X(p[0]),Y(p[1]),t,17,'font-weight="bold" fill="#283f35" style="paint-order:stroke;stroke:#eee5d0;stroke-width:4px"');
  for(const [i,p]of [[[25.5,12.1],'Receiving gate → same landing'],[[23.5,28.8],'Culvert → subfloor → landing'],[[38.2,22.2],'Guard corridor'],[[48,22.8],'No rails to loading steps'],[[47.2,27.0],'Amber light travels above floor level']].entries())out+=text(X(p[0][0]),Y(p[0][1]),p[1],17,'fill="#3d574b"');
  let cards='';for(const [i,m]of model.maps.entries())cards+=text(80+(i%2)*960,1440+Math.floor(i/2)*68,`${i+1}  ${m.title} · ${m.source[0]===m.source[1]?'square':'4:3'} crop`,23,`fill="${palette[i]}" font-weight="bold"`);
  cards+=text(80,1590,'5  Existing rescue painting, inspection gallery and adjoining cells · 4:3 crop',23,'fill="#b45e44" font-weight="bold"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Arial,sans-serif"><rect width="100%" height="100%" fill="#eee5d0"/>${text(76,74,'BRIARHOLD · FIVE INTERIOR MAPS, ONE BUILDING',40,'font-weight="bold" fill="#304a40"')}${text(76,120,'Navigation proposal · north up · guard corridor and left-hand records cover',24,'fill="#577063"')}${out}<rect x="52" y="1380" width="1944" height="258" rx="15" fill="#ded3b5"/>${cards}</svg>`;
}
