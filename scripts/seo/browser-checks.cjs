const {chromium,firefox,webkit}=require(process.env.PLAYWRIGHT_MODULE);
const fs=require('node:fs');const assert=require('node:assert/strict');
const base=process.env.SEO_PREVIEW_URL||'http://127.0.0.1:8096';
const out='docs/seo-oct20/evidence';fs.mkdirSync(out,{recursive:true});
const routes=['/','/services/website-development','/resources/website-brief','/contact','/legal/privacy','/legal/terms'];
const results={base,date:new Date().toISOString(),engines:[],limitations:[],network:[]};
(async()=>{
for(const [name,type] of [['chromium',chromium],['firefox',firefox]]){
 const browser=await type.launch({headless:true});const checks=[];
 const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await ctx.newPage();
 const requests=[],failures=[],errors=[];page.on('request',r=>requests.push({url:r.url(),method:r.method(),type:r.resourceType()}));page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
 for(const width of [320,390,844,1280]){await page.setViewportSize({width,height:width===844?390:844});for(const route of routes){
  const response=await page.goto(base+route);assert.equal(response.status(),200);assert.match(response.headers()['x-robots-tag'],/noindex/);
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('form,input,iframe').count(),0);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,`${name} ${width} ${route} overflow`);
  await page.addScriptTag({path:process.env.AXE_PATH});const scan=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.equal(scan.violations.length,0,JSON.stringify(scan.violations.map(v=>v.id)));
  checks.push({route,width,status:200,axeViolations:0,axeIncomplete:scan.incomplete.map(v=>v.id),overflow:false});
 }}
 await page.goto(base+'/services/website-development');await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').innerText(),'Skip to content');await page.keyboard.press('Enter');assert.equal(await page.locator(':focus').getAttribute('id'),'main');checks.push({check:'keyboard skip to main',pass:true});
 const first=page.locator('summary').first();await first.focus();await page.keyboard.press('Enter');assert.equal(await first.evaluate(e=>e.parentElement.open),true);await page.keyboard.press('Enter');assert.equal(await first.evaluate(e=>e.parentElement.open),false);checks.push({check:'native disclosure keyboard toggle',pass:true});
 for(const route of routes){await page.setViewportSize({width:390,height:844});await page.goto(base+route);await page.addStyleTag({content:':root{font-size:36px!important}'});assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)),`text200 overflow ${name} ${route}`);}checks.push({check:'200% root text size surrogate all routes',pass:true});
 await page.emulateMedia({media:'print'});await page.goto(base+'/resources/website-brief');assert.equal(await page.locator('header nav').isVisible(),false);assert.equal(await page.locator('main').isVisible(),true);await page.emulateMedia({media:'screen'});checks.push({check:'guide print styles preserve readable content',pass:true});
 await page.goto(base+'/contact');assert.equal(await page.getByRole('link',{name:'Email Camilo about your website'}).getAttribute('href'),'mailto:camiloreyna@merkadagency.com');assert(!(await page.locator('body').innerText()).includes('successfully'));await page.screenshot({path:`${out}/${name}-contact-mobile.png`});checks.push({check:'email-only contact, no unusable form or false success',pass:true});
 await page.setViewportSize({width:1280,height:900});await page.goto(base+'/services/website-development');await page.screenshot({path:`${out}/${name}-service-desktop.png`});await page.setViewportSize({width:390,height:844});await page.goto(base+'/resources/website-brief');await page.screenshot({path:`${out}/${name}-brief-mobile.png`});
 assert(!requests.some(r=>!r.url.startsWith(base)||r.method!=='GET'));assert.equal(failures.length,0);assert.equal(errors.length,0);checks.push({check:'no analytics, intake, external or mutation requests; no HTTP/page failures',pass:true,requests:requests.length});
 const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();for(const route of routes){await np.goto(base+route);assert.equal(await np.locator('h1').count(),1);assert((await np.locator('main').innerText()).length>200);}await nojs.close();checks.push({check:'all six pages readable with JavaScript disabled',pass:true});
 results.engines.push({name,version:browser.version(),checks});results.network.push({name,requests,failures,errors});await ctx.close();await browser.close();
}
try{const b=await webkit.launch({headless:true});await b.close();results.limitations.push('WebKit launch available but matrix not yet run');}catch(e){results.limitations.push('WebKit unavailable: '+e.message.split('\n')[0]);}
fs.writeFileSync(`${out}/browser-results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results.engines.map(e=>({name:e.name,version:e.version,checks:e.checks.length})),null,2));console.log(results.limitations);
})().catch(e=>{fs.writeFileSync(`${out}/browser-failure.txt`,e.stack);console.error(e);process.exit(1);});
