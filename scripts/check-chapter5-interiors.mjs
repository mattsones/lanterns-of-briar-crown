import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {interiorModel as model} from './lib/chapter5-interior-model.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),output=path.join(root,'assets/reference/concept/environments/chapter-5-interior-masters-v01');
const url=pathToFileURL(path.join(output,'briarhold-interior-review-v01.html')).href;
const browser=await chromium.launch({headless:true}),checks=[],paintedHubChecks=[],errors=[],requests=[];
const check=(ok,message)=>{if(!ok)throw new Error(message);};
try{
  for(const [name,frame]of Object.entries(model.frames)){
    const context=await browser.newContext({viewport:{width:frame.viewport[0],height:frame.viewport[1]}}),page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
    await page.goto(url);await page.locator('#stage svg').waitFor();await page.selectOption('#frame',name);
    await page.locator('#stage').screenshot({path:path.join(output,`review-overview-${name}.png`)});
    for(const map of model.maps){
      await page.click(`[data-map="${map.key}"]`);
      const box=await page.locator('#stage svg').boundingBox(),hero=await page.locator('#hero').boundingBox();
      check(Math.abs(box.width-frame.mapWidth)<.1,`${name}/${map.key}: wrong map width ${box.width}`);
      check(Math.abs(box.height-frame.mapWidth*map.source[1]/map.source[0])<.1,`${name}/${map.key}: wrong aspect`);
      check(Math.abs(hero.width-frame.token)<.1,`${name}/${map.key}: wrong token diameter ${hero.width}`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${name}/${map.key}: horizontal overflow`);
      await page.check('#paths');await page.check('#labels');await page.check('#clearance');
      for(const n of map.nodes){await page.selectOption('#node',n.id);check(await page.locator('#hero').count()===1,`${name}/${map.key}: node ${n.id} missing marker`);}
      for(const e of map.edges){
        await page.selectOption('#node',e.from);await page.locator('h1').click();
        await page.keyboard.press({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[e.direction]);
        check(await page.locator('#node').inputValue()===e.to,`${name}/${map.key}: forward alias ${e.from} → ${e.to}`);
        await page.keyboard.press({up:'ArrowDown',down:'ArrowUp',left:'ArrowRight',right:'ArrowLeft'}[e.direction]);
        check(await page.locator('#node').inputValue()===e.from,`${name}/${map.key}: backtracking ${e.to} → ${e.from}`);
      }
      for(const p of map.portals.filter(p=>model.maps.some(m=>p.target.startsWith(m.key+':')&&m.nodes.some(n=>n.id===p.target.split(':')[1])))){
        await page.selectOption('#node',p.from);await page.getByRole('button',{name:p.label,exact:true}).click();
        const [target,id]=p.target.split(':');check((await page.evaluate(()=>window.reviewState.key))===target,`${name}: transition ${p.target} wrong crop`);
        check(await page.locator('#node').inputValue()===id,`${name}: transition ${p.target} wrong landing`);
        await page.click(`[data-map="${map.key}"]`);
      }
      await page.selectOption('#node',map.defaultNode);await page.check('#light');await page.uncheck('#guide');
      const closed=await page.locator('#stage').innerHTML();await page.check('#guide');const open=await page.locator('#stage').innerHTML();
      if(map.guideFan)check(closed!==open,`${name}/${map.key}: guide lamp does not change light`);
      await page.selectOption('#state','occupied');const occupied=await page.locator('#navigation').innerHTML();
      await page.selectOption('#state','cleared');if(map.actors.length)check(occupied!==await page.locator('#navigation').innerHTML(),`${name}/${map.key}: changed actor state not visible`);
      await page.selectOption('#state',map.key==='hub'?'gathered':'occupied');
      if(name!=='desktop')await page.uncheck('#labels');
      await page.locator('#stage').screenshot({path:path.join(output,`review-${map.key}-${name}.png`)});
      await page.click('#clean');check(await page.locator('#labels text').count()===0,`${name}/${map.key}: clean labels remain`);
      check(await page.locator('#navigation polyline').count()===0,`${name}/${map.key}: clean routes remain`);
      check(await page.locator('#hero').count()===1,`${name}/${map.key}: clean view loses normal marker`);
      if(map.key==='hub')await page.locator('#stage').screenshot({path:path.join(output,`review-hub-clean-${name}.png`)});
      checks.push({frame:name,map:map.key,width:box.width,height:box.height,token:hero.width,nodes:map.nodes.length,edges:map.edges.length,forwardAndBack:true,portals:true,states:true,clean:true,overflow:false});
    }
    await page.click('[data-map="hub"]');
    await page.check('#interior-paint');
    await page.check('#paths');
    await page.check('#labels');
    const paintedHub=page.locator('#interior-paint-image');
    const readHubPainting=()=>paintedHub.evaluate(async svgImage=>{
      const src=svgImage.getAttribute('href');
      const image=new Image();
      image.src=src;
      await image.decode();
      return {src,width:image.naturalWidth,height:image.naturalHeight};
    });
    await page.uncheck('#guide');
    const closedHub=await readHubPainting();
    const bounds=await page.locator('#stage svg').boundingBox();
    check(closedHub.width===2048&&closedHub.height===1536,name+': closed hub painting dimensions');
    check(Math.abs(bounds.width-frame.mapWidth)<.1&&Math.abs(bounds.height-frame.mapWidth*.75)<.1,name+': painted hub crop changed');
    await page.check('#guide');
    const openHub=await readHubPainting();
    check(openHub.src!==closedHub.src&&openHub.width===2048&&openHub.height===1536,name+': open hub painting missing or mis-sized');
    check(await page.locator('#navigation polyline').count()>0,name+': painted hub navigation overlay missing');
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+': painted hub horizontal overflow');
    await page.locator('#stage').screenshot({path:path.join(output,'../briarhold-hub-paint-v01','review-open-'+name+'.png')});
    await page.uncheck('#guide');
    await page.locator('#stage').screenshot({path:path.join(output,'../briarhold-hub-paint-v01','review-closed-'+name+'.png')});
    paintedHubChecks.push({frame:name,width:bounds.width,height:bounds.height,pairedPaintings:true,navigation:true});
    await page.click('[data-map="ledger"]');
    const paintedRecords=page.locator('#interior-paint-image');
    const readRecordsPainting=()=>paintedRecords.evaluate(async svgImage=>{
      const src=svgImage.getAttribute('href');
      const image=new Image();
      image.src=src;
      await image.decode();
      return {src,width:image.naturalWidth,height:image.naturalHeight};
    });
    const records=await readRecordsPainting();
    check(records.width===2048&&records.height===2048,name+': records painting dimensions');
    await page.check('#guide');
    check((await readRecordsPainting()).src===records.src,name+': records should keep its own lighting');
    await page.selectOption('#node','recordsHub');
    await page.locator('h1').click();
    await page.keyboard.press('ArrowUp');
    check(await page.locator('#node').inputValue()==='l01',name+': painted records threshold');
    await page.keyboard.press('ArrowLeft');
    check(await page.locator('#node').inputValue()==='ledger',name+': painted records cover');
    await page.locator('#stage').screenshot({path:path.join(output,'../briarhold-records-paint-v01','review-v06-'+name+'.png')});
    await page.click('[data-map="rescue"]');await page.uncheck('#guide');await page.locator('#accepted-rescue').evaluate(img=>img.decode());
    const closed=await page.locator('#accepted-rescue').getAttribute('src');await page.check('#guide');await page.locator('#accepted-rescue').evaluate(img=>img.decode());
    check(closed!==await page.locator('#accepted-rescue').getAttribute('src'),`${name}: rescue lighting pair missing`);
    await page.getByRole('button',{name:'Return to inner guard post',exact:true}).click();check(await page.locator('#node').inputValue()==='door',`${name}: rescue does not rejoin post`);
    await context.close();
  }
  check(errors.length===0,`Page errors: ${errors.join('; ')}`);check(requests.length===0,'Standalone review makes network requests');
  const report={status:'PASS',date:model.date,offline:true,gameSaveAccess:false,checks,paintedHubChecks,pageErrors:errors,networkRequests:requests};
  await fs.writeFile(path.join(output,'review-checks.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({status:'PASS',frames:3,mapFrameCases:checks.length,paintedHubFrames:paintedHubChecks.length,nodesPerFrame:model.maps.reduce((total,map)=>total+map.nodes.length,0),errors,networkRequests:requests.length,output},null,2));
}finally{await browser.close();}
