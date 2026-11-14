// Shared by the standalone art review and SVG exports. Reference artwork only.
export const palette = { paper: '#eee5cf', ink: '#343d39', stone: '#9b9e90', floor: '#d8cdb3', wood: '#886346', moss: '#657b67', teal: '#147d79', amber: '#efb75e', danger: '#b54c36', blue: '#7298b0' };
export const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
export const escapeText = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const rectSegments = ([x,y,w,h]) => [[[x,y],[x+w,y]],[[x+w,y],[x+w,y+h]],[[x+w,y+h],[x,y+h]],[[x,y+h],[x,y]]];
export const pointRectDistance = ([x,y], [a,b,w,h]) => Math.hypot(Math.max(a-x,0,x-a-w),Math.max(b-y,0,y-b-h));
export function neighbors(map, id) {
  return map.edges.flatMap(e => e.from === id ? [{ ...e, target: e.to }] : e.to === id ? [{ ...e, target: e.from, direction: opposite[e.direction] }] : []);
}
// Low party light is occluded by walls, furniture and the cart, not painted over them.
export function visibility(origin, radius, solids, fan=null) {
  const segments = solids.flatMap(s => rectSegments(s.rect));
  const angles = Array.from({length:144}, (_,i) => i*Math.PI/72);
  for (const [a,b] of segments) for (const p of [a,b]) {
    const angle = Math.atan2(p[1]-origin[1],p[0]-origin[0]);
    angles.push(angle-0.0001,angle,angle+0.0001);
  }
  let ordered=angles.sort((a,b)=>a-b);
  if(fan) {
    const a=Math.atan2(fan[1][1]-origin[1],fan[1][0]-origin[0]),b=Math.atan2(fan[2][1]-origin[1],fan[2][0]-origin[0]);
    const wrap=t=>Math.atan2(Math.sin(t),Math.cos(t)), axis=a+wrap(b-a)/2,half=Math.abs(wrap(b-a))/2;
    ordered=angles.concat([axis-half,axis+half]).filter(t=>Math.abs(wrap(t-axis))<=half+1e-8).sort((a,b)=>wrap(a-axis)-wrap(b-axis));
  }
  const result=ordered.map(angle => {
    const d=[Math.cos(angle),Math.sin(angle)]; let distance=radius;
    for (const [a,b] of segments) {
      const v=[b[0]-a[0],b[1]-a[1]], q=[a[0]-origin[0],a[1]-origin[1]];
      const cross=d[0]*v[1]-d[1]*v[0]; if(Math.abs(cross)<1e-9) continue;
      const t=(q[0]*v[1]-q[1]*v[0])/cross, u=(q[0]*d[1]-q[1]*d[0])/cross;
      if(t>0.00001 && u>=0 && u<=1) distance=Math.min(distance,t);
    }
    return [origin[0]+distance*d[0],origin[1]+distance*d[1]];
  });
  return fan?[origin,...result]:result;
}
export function renderMaster(model, view, options={}) {
  const site=view==='site', map=site ? null : model[view];
  const opts={ lighting:false, guide:true, paths:true, triggers:true, sightlines:true, clearance:false, annotations:true, safe:true, marker:true, party:true, actors:true, actorMarkers:true, stage:'initial', frame:'phone390', ...options };
  const [width,height]=site ? [2048,1440] : map.source;
  const bounds=site ? [0,0,68,34] : map.bounds;
  const scale=site ? 1920/68 : width/bounds[2], ox=site ? 64 : 0, oy=site ? 138 : 0;
  const X=x=>ox+(x-bounds[0])*scale, Y=y=>oy+(y-bounds[1])*scale, S=x=>x*scale;
  const pt=p=>`${X(p[0]).toFixed(2)},${Y(p[1]).toFixed(2)}`;
  const path=(points, attrs='')=>`<polyline points="${points.map(pt).join(' ')}" fill="none" ${attrs}/>`;
  const polygon=(points,attrs='')=>`<polygon points="${points.map(pt).join(' ')}" ${attrs}/>`;
  const rect=(r,attrs='')=>`<rect x="${X(r[0])}" y="${Y(r[1])}" width="${S(r[2])}" height="${S(r[3])}" ${attrs}/>`;
  const circle=(p,r,attrs='')=>`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${S(r)}" ${attrs}/>`;
  const label=(p,text,size=.45,attrs='')=>`<text x="${X(p[0])}" y="${Y(p[1])}" font-size="${S(size)}" ${attrs}>${escapeText(text)}</text>`;
  const callout=(p,lines,align='start',size=.39)=>lines.map((line,i)=>label([p[0],p[1]+i*size*1.3],line,size,`text-anchor="${align}" class="label"`)).join('');
  const frame=model.frames[opts.frame], tokenD=site ? 0 : frame.token/frame.mapWidth*bounds[2], envelope=tokenD+2*model.marker.shadow/frame.mapWidth*bounds[2];
  const active=site ? null : map.nodes.find(n=>n.id===opts.node)||map.nodes.find(n=>n.id===map.defaultNode);
  const stroke=`stroke="${palette.ink}" stroke-width="${S(.07)}"`;
  let architecture='', props='', overlays='', annotations='', actors='', light='', defs='';
  defs+=`<pattern id="stone" width="${S(1.1)}" height="${S(.65)}" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill="${palette.stone}"/><path d="M0 0H${S(1.1)}V${S(.65)}H0Z M${S(.5)} 0V${S(.65)}" fill="none" stroke="#717d70" stroke-width="${S(.025)}" opacity=".5"/></pattern><pattern id="floor" width="${S(1)}" height="${S(1)}" patternUnits="userSpaceOnUse"><rect width="100%" height="100%" fill="${palette.floor}"/><path d="M0 0H${S(1)}V${S(1)}H0Z" fill="none" stroke="#aba48e" stroke-width="${S(.015)}"/></pattern><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0 0L6 3 0 6" fill="none" stroke="context-stroke" stroke-width="1.5"/></marker>`;
  const terrain=()=>{
    let out=rect([0,0,68,36],`fill="#a8b29a"`);
    // Long broken contours describe the ridge without masquerading as extra paths.
    for(let i=0;i<11;i++) out+=path([[0,7+i*2.2],[6,8+i*2],[14,10+i*1.9],[21,8+i*2],[30,11+i*1.7]],`stroke="#82937e" stroke-width="${S(.06)}" opacity=".65"`);
    out+=path(model.approach.roadPoints,`stroke="#d3c8a7" stroke-width="${S(2.25)}" stroke-linecap="round" stroke-linejoin="round"`);
    out+=path(model.approach.drainagePoints,`stroke="#7d8f86" stroke-width="${S(1.8)}" stroke-linecap="round" stroke-linejoin="round"`);
    out+=path(model.approach.drainagePoints,`stroke="#668d98" stroke-width="${S(.35)}" stroke-linecap="round"`);
    for(const p of [[18.5,24.5],[20.3,28.5],[24,28.1],[27.6,28.3]]) out+=circle(p,.18,'fill="#c2c7b2"');
    for(const [x,y,r] of [[2,10,1.2],[4,22,1.6],[7,25,1.5],[11,27,1.2],[14,30,1.8],[21,10,1.2],[24,31.8,1],[3,30,2],[14,11,1]]) {
      out+=circle([x,y],r,`fill="#5c765f" opacity=".7"`)+circle([x-.3,y-.25],r*.65,`fill="#7f9675"`);
    }
    // Roof removed: the broken walls retain a concealed, downhill-facing opening.
    out+=rect(model.approach.shelterFloor,`fill="#d5c6a6"`);
    for(const solid of model.approach.solids.filter(s=>s.id.startsWith('shelter-'))) out+=rect(solid.rect,`fill="url(#stone)" ${stroke}`);
    out+=rect([22.5,21,7,3],`fill="#b8b59d"`)+rect([22.5,23.8,7,.2],`fill="url(#stone)"`);
    out+=rect([25.8,19,2.4,1.6],`fill="${palette.wood}" ${stroke}`);
    for(const p of [[26.2,18.95],[27.8,18.95],[26.2,20.65],[27.8,20.65]]) out+=circle(p,.18,`fill="#363a34"`);
    return out;
  };
  if(site || view==='approach') {
    architecture+=terrain();
    if(!site) {
      architecture+=rect([29.5,7.8,16.5,25.875],`fill="#b4b49f"`);
      for(const room of model.rooms.filter(r=>r.rect[0]<46)) architecture+=rect(room.rect,`fill="url(#floor)" stroke="#7a8276" stroke-width="${S(.12)}"`);
      architecture+=rect([29.5,7.8,.4,25.875],`fill="url(#stone)" ${stroke}`);
      props+=path([[29.5,15.9],[29.5,18.6]],`stroke="#a37b49" stroke-width="${S(.28)}"`);
      props+=rect([29.32,27.5,.4,1.4],`fill="#303d3b"`);
      for(let y=27.65;y<28.9;y+=.22) props+=path([[29.15,y],[29.75,y]],`stroke="#8c9690" stroke-width="${S(.07)}"`);
      props+=rect([29.35,25,.3,1],`fill="#efb75e"`);
    }
  }
  if(site) {
    // Circulation strokes beneath room floors show level changes, not bonus doors.
    for(const edge of model.sitePaths) architecture+=path(edge.points,`stroke="#c4b99d" stroke-width="${S(1.45)}" stroke-linecap="round" stroke-linejoin="round"`);
    for(const room of model.rooms) {
      architecture+=rect(room.rect,`fill="url(#floor)" stroke="#45524a" stroke-width="${S(.17)}"`);
      annotations+=callout([room.rect[0]+.3,room.rect[1]+.75],[room.number+' '+room.label[0],...room.label.slice(1),`${room.level>0?'+':''}${room.level.toFixed(1)} m`],'start',.42);
    }
    architecture+=rect([56.4,21.5,3,1.5],`fill="url(#floor)"`);
    for(const edge of model.sitePaths) if(edge.kind!=='subfloor') architecture+=path(edge.points,`stroke="${palette.floor}" stroke-width="${S(.9)}" stroke-linecap="round" stroke-linejoin="round"`);
    for(const edge of model.sitePaths) overlays+=path(edge.points,`stroke="${edge.kind==='subfloor'?palette.blue:palette.teal}" stroke-width="${S(.1)}" ${edge.kind==='walk'?'':`stroke-dasharray="${S(.22)} ${S(.15)}"`}`);
    for(const key of ['approach','rescue']) for(const edge of model[key].edges) {
      const nodes=model[key].nodes;
      overlays+=path([nodes.find(n=>n.id===edge.from).point,nodes.find(n=>n.id===edge.to).point],`stroke="${palette.teal}" stroke-width="${S(.085)}"`);
    }
    // Architectural crop extents connect the two scale masters to this world plan.
    for(const [key,color] of [['approach',palette.blue],['rescue',palette.danger]]) overlays+=rect(model[key].bounds,`fill="none" stroke="${color}" stroke-width="${S(.08)}" stroke-dasharray="${S(.35)} ${S(.2)}"`);
    annotations+=callout([4,7.3],['UPHILL ROADWORKERS’ SHELTER','Silent climb; hidden view of the entrances'],'start',.5);
    annotations+=callout([6,24],['LOW RUNOFF','Below the gate’s lamps'],'start',.48);
    annotations+=callout([17,32.6],['CULVERT → SUBFLOOR → SERVICE LANDING'],'start',.43);
    annotations+=callout([48,8],['NORTH ↑   /   EAST →','Same-night infiltration; one connected station'],'start',.47);
    annotations+=callout([62,18.2],['Bracken →','separate exit'],'start',.38);
    annotations+=callout([47,29],['Quenching yard','outside workshop'],'start',.4);
    props+=rect([37,30,3.5,1.1],`fill="#849a9b" ${stroke}`);
  }
  const drawRescue=()=>{
    let out=rect([42,10.5,20,15],`fill="#8f9b8d"`);
    for(const room of model.rooms.filter(r=>['gallery','crown','cells'].includes(r.id))) out+=rect(room.rect,`fill="url(#floor)"`);
    out+=rect([56.4,21.5,3,1.5],`fill="url(#floor)"`);
    for(const solid of model.rescue.solids.filter(s=>s.id!=='parked-cart')) out+=rect(solid.rect,`fill="${solid.id.includes('table')||solid.id==='mara-console'?palette.wood:'url(#stone)'}" ${stroke}`);
    // Grille window at eye height; opaque lower sill is a light occluder, not a blocked sightline.
    const window=model.rescue.inspectionWindow;
    out+=path([[window.wallX,window.span[0]],[window.wallX,window.span[1]]],`stroke="#d8d0ae" stroke-width="${S(.16)}"`);
    for(let y=window.span[0]+.05;y<window.span[1];y+=.17) out+=path([[window.wallX-.1,y],[window.wallX+.12,y]],`stroke="#66736c" stroke-width="${S(.035)}"`);
    out+=rect([48.6,21.39,.8,.17],`fill="${palette.amber}"`);
    // Ordinary uneven stone landing: no paired guides, rails or track to the steps.
    out+=rect([53.7,21.5,2.2,3.2],`fill="#7a8175"`);
    for(let i=0;i<9;i++) out+=path([[53.7,21.5+i*.35],[55.9,21.5+i*.35]],`stroke="#38483f" stroke-width="${S(.055)}"`);
    if(opts.paths)out+=polygon([[54.6,22],[55,22],[55,23.3],[55.45,23.3],[54.8,24.1],[54.15,23.3],[54.6,23.3]],`fill="${palette.danger}" opacity=".8"`);
    out+=path([[59.5,17.4],[60.7,17.4],[60.7,19.2],[59.5,19.2]],`stroke="#44574e" stroke-width="${S(.08)}"`);
    out+=path([[49.4,14.2],[50.5,15],[51.8,14.2]],`stroke="#d7bb80" stroke-width="${S(.06)}"`);
    return out;
  };
  if(site) {
    // A compact but accurately placed rescue inset on the floor plan.
    props+=rect(model.rescue.solids.find(s=>s.id==='route-table').rect,`fill="${palette.wood}"`)+rect([46,16.8,2,1],`fill="${palette.wood}"`);
    const window=model.rescue.inspectionWindow;
    props+=path([[window.wallX,window.span[0]],[window.wallX,window.span[1]]],`stroke="#425d64" stroke-width="${S(.15)}"`);
    props+=rect([54.3,18.5,1,1.2],`fill="${palette.wood}"`)+rect([53.7,21.5,2.2,2.5],`fill="#849087"`);
    props+=path([[54.8,19.7],[54.8,23.4]],`stroke="${palette.danger}" stroke-width="${S(.1)}" marker-end="url(#arrow)"`);
  } else if(view==='rescue') architecture+=drawRescue();
  if(!site) {
    let solids=map.solids;
    const cart=view==='rescue' ? map.cart[opts.stage] : null;
    if(cart) solids=solids.filter(s=>s.id!=='parked-cart').concat([{rect:[cart[0]-.5,cart[1]-.6,1,1.2]}]);
    const party=opts.party ? visibility(active.point,map.partyRadius,solids) : [];
    const fixed=map.fixedLights.map(f=>({...f, footprint:visibility(f.point,f.radius,solids,f.fan)}));
    defs+=`<radialGradient id="partyGlow"><stop stop-color="#ffc879" stop-opacity=".65"/><stop offset="1" stop-color="#ffc879" stop-opacity=".02"/></radialGradient>`;
    defs+=`<mask id="night"><rect width="${width}" height="${height}" fill="white"/>${polygon(party,'fill="#333"')}${fixed.map(f=>polygon(f.footprint,`fill="${f.color==='green'?'#606060':'#333'}"`)).join('')}${view==='rescue'&&opts.guide?polygon(model.optics.directFan,'fill="#222"'):''}</mask>`;
    for(const f of fixed) {
      light+=polygon(f.footprint,`fill="${f.color==='green'?'#a0c377':palette.amber}" opacity="${opts.lighting?'.32':'.12'}" stroke="${f.color==='green'?'#678b58':'#a97f40'}" stroke-width="${S(.035)}" stroke-dasharray="${S(.12)} ${S(.1)}"`);
      light+=circle(f.point,.09,`fill="${f.color==='green'?'#426339':'#b67f28'}" stroke="#fff1bf" stroke-width="${S(.03)}"`);
    }
    light+=polygon(party,`fill="url(#partyGlow)" stroke="#bb8f47" stroke-width="${S(.035)}" stroke-dasharray="${S(.12)} ${S(.1)}"`);
    if(view==='rescue'&&opts.guide) {
      light+=polygon(model.optics.directFan,`fill="${palette.amber}" opacity=".25"`);
    }
    if(opts.lighting&&!opts.paintingUrl) light+=`<rect width="${width}" height="${height}" fill="#0d2231" opacity=".78" mask="url(#night)"/>`;
    if(opts.clearance) {
      for(const node of map.nodes) overlays+=circle([node.point[0],node.point[1]-(model.marker.anchorY-.5)*tokenD],envelope/2,`fill="#20a9a0" fill-opacity=".06" stroke="#29a69b" stroke-width="${S(.025)}" stroke-dasharray="${S(.08)} ${S(.08)}"`);
      overlays+=circle(active.point,model.marker.bodyRadius,`fill="#192b30" opacity=".7"`);
    }
    if(opts.paths) {
      for(const edge of map.edges) {
        const a=map.nodes.find(n=>n.id===edge.from).point,b=map.nodes.find(n=>n.id===edge.to).point;
        overlays+=path([a,b],`stroke="${edge.gate?palette.danger:palette.teal}" stroke-width="${S(.065)}" ${edge.gate?`stroke-dasharray="${S(.16)} ${S(.12)}"`:''}`);
      }
      for(const node of map.nodes) {
        overlays+=circle(node.point,node.anchor?.14:.085,`fill="${palette.paper}" stroke="${palette.teal}" stroke-width="${S(.04)}"`);
        const pinSize=Math.max(.36,10/frame.mapWidth*bounds[2]);
        if(node.pin) overlays+=label([node.point[0],node.point[1]-.3-pinSize*.12],node.pin,pinSize,`text-anchor="middle" fill="${opts.lighting?'#f6ebd0':palette.teal}" font-weight="700"`);
      }
      for(const portal of map.portals) {
        const node=map.nodes.find(n=>n.id===portal.from);
        overlays+=path([node.point,portal.point],`stroke="${palette.blue}" stroke-width="${S(.06)}" stroke-dasharray="${S(.14)} ${S(.15)}" marker-end="url(#arrow)"`);
      }
    }
    if(opts.triggers) for(const node of map.nodes.filter(n=>n.trigger)) overlays+=rect([node.point[0]-.45,node.point[1]-.45,.9,.9],`fill="none" stroke="${palette.danger}" stroke-width="${S(.03)}" stroke-dasharray="${S(.1)} ${S(.09)}" rx="${S(.08)}"`);
    // Actor footprints are to scale; only the selected party marker is a screen-sized pin.
    const actor=(p,letter,color='#695b48')=>circle(p,.3,`fill="${color}" stroke="#f3dec0" stroke-width="${S(.035)}"`)+label([p[0],p[1]+.12],letter,.32,'text-anchor="middle" fill="#fff6e1" font-weight="700"');
    if(view==='rescue'&&opts.actors) {
      const a=map.actors, running=opts.stage!=='initial';
      if(opts.cartUrl)actors+=`<image id="painted-cart" href="${escapeText(opts.cartUrl)}" x="${X(cart[0]-.7)}" y="${Y(cart[1]-.6)}" width="${S(1.4)}" height="${S(1.2)}" preserveAspectRatio="none" opacity="${opts.guide?1:.78}"/>`;
      else {
        actors+=rect([cart[0]-.5,cart[1]-.6,1,1.2],`fill="${palette.wood}" ${stroke}`);
        for(const x of [cart[0]-.57,cart[0]+.57]) for(const y of [cart[1]-.38,cart[1]+.38]) actors+=circle([x,y],.12,`fill="#252e2d"`);
      }
      if(opts.actorMarkers)actors+=actor([cart[0],cart[1]-.08],'L',opts.stage==='freed'?'#587f66':'#8c765c');
      // A low lamp cannot read the far-side rod through the cart body.
      if(opts.guide||(!opts.paintingUrl&&!opts.lighting))actors+=path([[cart[0]+.55,cart[1]-.3],[cart[0]+.8,cart[1]-.3],[cart[0]+.8,cart[1]+(['initial','braked','freed'].includes(opts.stage)?.22:-.7)]],`id="cart-brake" stroke="${opts.guide?'#ffd885':'#8a7c5d'}" stroke-width="${S(.075)}"`);
      if(opts.actorMarkers) {
        if(opts.stage!=='freed')actors+=path([[cart[0]-.16,cart[1]-.18],[cart[0]+.36,cart[1]-.24]],`id="cart-cuff" stroke="#d0c8b3" stroke-width="${S(.06)}"`);
        actors+=actor(running?a.maraRescue:a.maraCover,'M','#98714f');
        actors+=actor(running?a.companionBrace:a.companionInitial,'C','#53748a');
        if(!running)actors+=actor(a.brackenInitial,'B','#703f44')+actor(a.sentryInitial,'S','#526643')+actor(a.guardWest,'G','#76624e')+actor(a.guardEast,'G','#76624e');
        else {
          actors+=path([[a.sentryFallen[0]-.5,a.sentryFallen[1]-.35],[a.sentryFallen[0]+.5,a.sentryFallen[1]+.35]],`stroke="#526643" stroke-width="${S(.65)}" stroke-linecap="round"`);
          if(opts.stage==='released')actors+=actor(a.brackenExit,'B','#703f44');
        }
        actors+=actor(a.hesta,'H','#8d6a55')+rect([57.1,23.9,.8,.4],`fill="#87765a" ${stroke}`);
      }
      if(opts.paths) {
        overlays+=path([a.brackenInitial,a.brackenKick,a.brackenExit,[61.3,18.3]],`stroke="${palette.danger}" stroke-width="${S(.06)}" stroke-dasharray="${S(.13)} ${S(.1)}" marker-end="url(#arrow)"`);
        overlays+=path([[54.8,19.7],[54.8,21.45]],`stroke="${palette.danger}" stroke-width="${S(.08)}" marker-end="url(#arrow)"`);
      }
    }
    const markerCenter=[active.point[0],active.point[1]-(model.marker.anchorY-.5)*tokenD];
    if(opts.marker) {
      overlays+=circle(markerCenter,envelope/2,'fill="#15302d" opacity=".25"');
      overlays+=circle(markerCenter,(tokenD-3/frame.mapWidth*bounds[2])/2,`fill="#264e56" stroke="#f7e8c4" stroke-width="${S(3/frame.mapWidth*bounds[2])}"`)+label([markerCenter[0],markerCenter[1]+tokenD*.15],'H',tokenD*.43,'text-anchor="middle" fill="#fff1d0" font-weight="700"');
    }
    if(opts.safe) {
      overlays+=rect([bounds[0]+.2,bounds[1]+.2,bounds[2]-.4,bounds[3]-.4],`fill="none" stroke="${opts.lighting?'#d4dfd2':'#677d72'}" stroke-width="${S(.025)}" stroke-dasharray="${S(.15)} ${S(.18)}" opacity=".55"`);
    }
    if(opts.annotations) {
      if(view==='approach') {
        annotations+=callout([1.5,8.5],['ABANDONED SHELTER','Unmarked climb off the road'],'start',.48);
        annotations+=callout([2,32],['↑ N   /   5 m scale below','O shelter   R fork   G gate   W runoff   C culvert'],'start',.43);
        annotations+=callout([31,12.4],['STATION CUTAWAY','01 service landing','02 central hub','03 upper records','04 lower workshop'],'start',.49);
        annotations+=callout([22.7,22],['Service court','Retaining wall ↓'],'start',.43);
        annotations+=callout([31,27.8],['CULVERT','Subfloor link to 01'],'start',.47);
        annotations+=callout([17,25.2],['WET RUNOFF / NO PATH','Streambed beneath gate light'],'end',.43);
      } else {
        annotations+=callout([46,12.25],['CROWN TABLE ROOM   /   NORTH ↑'],'start',.28);
        annotations+=callout([49.45,14.8],['Route','table'],'start',.3);
        annotations+=callout([46.1,16.5],['Mara’s cover'],'start',.26);
        annotations+=callout([60,16.6],['Bracken’s','exit →'],'start',.27);
        annotations+=callout([53.2,24.4],['STEEP STEPS','↓ 2.8 m drop'],'end',.29);
        annotations+=callout([58.95,25],['Hesta'],'start',.25);
        annotations+=callout([56.45,25],['Packed bundle'],'start',.23);
        annotations+=callout([44,21.4],['Inspection','gallery'],'middle',.27);
        annotations+=callout([46.3,22.8],[opts.guide?'AMBER GUIDE LAMP OPEN':'AMBER GUIDE LAMP CLOSED',opts.guide?'High beam reveals brake; warm floor bounce':'Green work lamps; brake remains obscured'],'start',.28);
        annotations+=callout([46.3,24.4],['E entry   G grille   T confrontation','L cart stance   P cell threshold'],'start',.26);
      }
      const sx=bounds[0]+(view==='approach'?2:4.3), sy=bounds[1]+bounds[3]-.65;
      annotations+=path([[sx,sy],[sx+map.scaleBar,sy]],`stroke="${palette.ink}" stroke-width="${S(.07)}"`)+label([sx+map.scaleBar+.18,sy+.1],`${map.scaleBar} m`,.32,'class="label"');
    }
  }
  if(opts.sightlines) {
    const o=model.optics, grilleRays=o.grilleSightTargets.map(target=>[o.grilleSight[0],target.point]);
    const rays=site ? [o.shelterSight,o.yardSight,o.postSight,...grilleRays] : view==='approach' ? [o.shelterSight,[o.shelterSight[0],[29.4,25.5]]] : grilleRays;
    for(const ray of rays) overlays+=path(ray,`stroke="${opts.lighting?'#c9e0dc':'#496e74'}" stroke-width="${S(.045)}" stroke-dasharray="${S(.2)} ${S(.16)}" marker-end="url(#arrow)"`);
    if(site) {
      overlays+=path([o.lamp,o.hubTarget],`stroke="#bd872b" stroke-width="${S(.13)}"`);
      overlays+=polygon([o.lamp,[58,17],[58.5,21.2]],`fill="${palette.amber}" opacity=".22"`);
      overlays+=circle(o.lamp,.22,`fill="#b77c23" stroke="#624e2a" stroke-width="${S(.05)}"`);
      annotations+=callout([46.6,27],['Amber guide lamp','Two straight branches'],'start',.4);
    }
  }
  let sheet='';
  if(site) {
    sheet=`<text x="64" y="62" font-size="37" font-weight="700">BRIARHOLD / ONE CONNECTED PLACE</text><text x="64" y="102" font-size="23" fill="#647468">01 — Site and floor plan · draft v01 · north up · metres</text>`;
    sheet+=`<rect x="64" y="1140" width="1920" height="230" rx="12" fill="#ded4bb"/><text x="88" y="1180" font-size="24" font-weight="700">LEVELS + ORDINARY LIGHT</text>`;
    const levels=[['Workshop',-2],['Landing / hub / rescue',0],['Upper records',2.8],['Signal platform',3.4]];
    for(let i=0;i<levels.length;i++) {
      const xx=100+i*295, yy=1320-levels[i][1]*18;
      sheet+=`<path d="M${xx} ${yy}h245" stroke="#466c64" stroke-width="7"/><text x="${xx}" y="${yy+30}" font-size="19">${escapeText(levels[i][0])}</text><text x="${xx}" y="${yy-14}" font-size="20">${levels[i][1]>0?'+':''}${levels[i][1].toFixed(1)} m</text>`;
    }
    sheet+=`<text x="1330" y="1180" font-size="21">Lamp +4.6 m → opening +2.8 m → brake</text><text x="1330" y="1216" font-size="19">Reflector branches to hub and rescue room.</text><text x="1330" y="1248" font-size="19">High-angle direct light; softer floor reflection.</text><text x="1330" y="1290" font-size="19">Solid teal: main-floor route · dashed: stairs</text><text x="1330" y="1322" font-size="19">Blue dash: subfloor · rust: rescue danger</text><text x="1330" y="1354" font-size="19">Crop boxes: approach (blue) / rescue (rust)</text>`;
    sheet+=`<text x="64" y="1415" font-size="20" fill="#6c6d60">REFERENCE MASTER · proposed physical layout / navigation subdivision · not a registered game map</text>`;
  }
  if(opts.paintingUrl&&!site) {
    architecture=`<image id="painted-background" href="${escapeText(opts.paintingUrl)}" x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="none"/>`;
    props='';
    // The painting already carries the fixed night values. The toggle adds design
    // footprints for comparison, not a second darkness pass or runtime relighting.
    if(!opts.lighting) light='';
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeText(site?'Briarhold coordinated floor plan':map.title+' '+(opts.lighting?'lighting':'scale')+' master')}" fill="${palette.ink}"><title>${escapeText(site?'Briarhold site plan':map.title)} — draft v01</title><style>text{font-family:Arial,Helvetica,sans-serif}.label{paint-order:stroke;stroke:${palette.paper};stroke-width:${site?'4':S(.1)}px;stroke-linejoin:round}</style><defs>${defs}</defs><rect width="${width}" height="${height}" fill="${palette.paper}"/><g id="architecture">${architecture}</g><g id="props">${props}</g><g id="light-footprints">${light}</g><g id="actors">${actors}</g><g id="navigation-and-clearance">${overlays}</g><g id="map-annotations">${annotations}</g><g id="sheet">${sheet}</g></svg>`;
}
