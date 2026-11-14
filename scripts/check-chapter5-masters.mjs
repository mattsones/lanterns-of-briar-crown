import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(root,'assets/reference/concept/environments/chapter-5-masters-v01');
// file:// intentionally verifies offline use; never loads the game or a saved checkpoint.
const url=pathToFileURL(path.join(output,'briarhold-review-v01.html')).href;
const browser=await chromium.launch({headless:true});
const checks=[],errors=[];
function check(condition,message){if(!condition)throw new Error(message);}
try {
  for(const frame of [{id:'desktop',w:1280,h:720,map:870,token:52},{id:'phone390',w:390,h:844,map:332,token:32},{id:'phone430',w:430,h:932,map:372,token:32}]) {
    const context=await browser.newContext({viewport:{width:frame.w,height:frame.h}}),page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url);await page.locator('#canvas svg').waitFor();
    await page.selectOption('#frame',frame.id);
    for(const view of ['approach','rescue']) {
      await page.click(`[data-view="${view}"]`);
      let painted=false;
      if(await page.locator('#painting-label').isVisible()) {
        check(await page.locator('#painted-background').count()===1,'Painting was not loaded beneath the overlays');
        check((await page.locator('#painted-background').getAttribute('href')).startsWith('data:image/webp;base64,'),'Painting is not embedded for offline review');
        await page.uncheck('#painting');
        check(await page.locator('#painted-background').count()===0,'Cannot return from paint to geometry master');
        await page.check('#painting');painted=true;
      }
      if(view==='rescue') {
        await page.selectOption('#node','r00');
        await page.locator('body').click({position:{x:3,y:3}});
        await page.keyboard.press('ArrowUp');
        check(await page.locator('#node').inputValue()==='grille',`${frame.id}: cannot inspect from above E`);
        const openImage=painted?await page.locator('#painted-background').getAttribute('href'):null;
        await page.check('#lighting');await page.uncheck('#guide');await page.check('#clearance');
        if(painted){
          check(await page.locator('#painted-background').getAttribute('href')!==openImage,'Guide switch does not load closed paint');
          check(await page.locator('#painted-cart').count()===1,'Separate painted cart is missing');
          check(await page.locator('#cart-brake').count()===0,'Closed-guide paint exposes the brake rod');
        }
        await page.locator('#canvas').screenshot({path:path.join(output,`review-grille-${frame.id}.png`)});
        await page.locator('body').click({position:{x:3,y:3}});
        await page.keyboard.press('ArrowDown');
        check(await page.locator('#node').inputValue()==='r00',`${frame.id}: grille does not return directly to E`);
      }
      const box=await page.locator('#canvas svg').boundingBox();
      check(Math.abs(box.width-frame.map)<.1,`${frame.id}/${view}: incorrect image width ${box.width}`);
      check(Math.abs(box.height-frame.map*(view==='rescue'?.75:.5625))<.1,`${frame.id}/${view}: wrong aspect`);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${frame.id}/${view}: horizontal overflow`);
      const token=await page.locator('#navigation-and-clearance > circle[fill="#264e56"]').boundingBox();
      // bbox includes the 3px border in SVG geometry; rendered diameter itself is exact.
      check(Math.abs(token.width-frame.token)<.2,`${frame.id}/${view}: incorrect marker ${token.width}`);
      await page.selectOption('#node',view==='approach'?'ridge':'r01');
      await page.locator('body').click({position:{x:3,y:3}});
      await page.keyboard.press('ArrowRight');
      check(await page.locator('#node').inputValue()===(view==='approach'?'a03':'r02'),`${frame.id}/${view}: alias failed`);
      await page.keyboard.press('ArrowLeft');
      check(await page.locator('#node').inputValue()===(view==='approach'?'ridge':'r01'),`${frame.id}/${view}: backtracking failed`);
      await page.check('#lighting');
      if(painted)check(await page.locator('#light-footprints rect[fill="#0d2231"]').count()===0,'Painting receives a duplicate night-darkness pass');
      if(view==='rescue') {
        await page.uncheck('#guide');
        const closed=await page.locator('#lighting').count();
        check(closed===1,'Control ID conflicts with SVG group ID');
        const closedSvg=await page.locator('#canvas').innerHTML();
        await page.check('#guide');
        check(await page.locator('#canvas').innerHTML()!==closedSvg,'Lamp toggle has no visible effect');
        if(painted)check(await page.locator('#cart-brake').count()===1,'Open-guide paint does not reveal brake rod');
        for(const stage of ['released','caught','braked','freed']) {
          const before=await page.locator('#actors').innerHTML();await page.selectOption('#stage',stage);
          check(await page.locator('#actors').innerHTML()!==before,`Stage ${stage} leaves actor geometry unchanged`);
        }
        if(painted){
          check(await page.locator('#cart-cuff').count()===0,'Freed stage leaves the cuff closed');
          await page.uncheck('#actorMarkers');
          check(await page.locator('#actors text').count()===0,'People/staging toggle leaves character markers');
          check(await page.locator('#painted-cart').count()===1,'Hiding people also hides the movable cart');
          await page.check('#actorMarkers');
        }
        await page.selectOption('#stage','caught');await page.selectOption('#node','carriage');
      }
      await page.check('#clearance');
      await page.locator('#canvas').screenshot({path:path.join(output,`review-${view}-${frame.id}.png`)});
      await page.click('#clean');
      check(await page.locator('#map-annotations text').count()===0,'Clean composition leaves debug labels');
      check(await page.locator('#navigation-and-clearance > polyline').count()===0,'Clean composition leaves path/sight overlays');
      checks.push({frame:frame.id,view,painted,width:box.width,height:box.height,marker:token.width,overflow:false,backtracking:true,clean:true});
    }
    await context.close();
  }
  check(errors.length===0,`Browser errors: ${errors.join('; ')}`);
  const report={status:'PASS',offline:true,gameSaveAccess:false,checks,pageErrors:errors};
  await fs.writeFile(path.join(output,'review-checks.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
} finally {await browser.close();}
