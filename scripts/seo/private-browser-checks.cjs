const {chromium,firefox}=require(process.env.PLAYWRIGHT_MODULE);
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.SEO_PREVIEW_URL||'http://127.0.0.1:8096';
const out=process.env.PRIVATE_EVIDENCE_DIR||'/tmp/merkad-private-smoke';fs.mkdirSync(out,{recursive:true});
(async()=>{const output={date:new Date().toISOString(),base,engines:[]};
for(const [name,type] of [['chromium',chromium],['firefox',firefox]]){
 const browser=await type.launch({headless:true});const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:'block'});
 const blocked=[],forbidden=[],methods=[],errors=[];await context.route('**/*',async route=>{const request=route.request(),url=new URL(request.url());methods.push(request.method());if(url.origin!==new URL(base).origin){blocked.push({host:url.hostname,kind:request.resourceType()});if(!['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname))forbidden.push(url.hostname);return route.abort();}if(request.method()!=='GET'){forbidden.push('mutation');return route.abort();}return route.continue();});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));const checks=[];
 await page.goto(base+'/admin');await page.waitForURL('**/admin/login');await page.getByRole('button',{name:'Sign in with Google'}).waitFor();checks.push('signed-out admin redirects to login');
 assert.equal(await page.locator('header a').getAttribute('href'),'/');assert(!/AI Lead Capture|Book.*Call|cal\.com/.test(await page.locator('body').innerText()));checks.push('login has safe website chrome, retained Google control');await page.screenshot({path:path.join(out,name+'-login.png')});
 await page.reload();await page.getByRole('button',{name:'Sign in with Google'}).waitFor();checks.push('login refresh loads preserved live CSS/favicon');
 for(const [suffix,text] of [['/sign/synthetic-boundary-review','Invalid contract link. Please check the URL.'],['/sign/synthetic-boundary-review?token='+Buffer.from('other:synthetic-client:fixture').toString('base64'),'Invalid or expired link.'],['/sign/synthetic-boundary-review/?token='+Buffer.from('other:synthetic-client:fixture').toString('base64'),'Invalid or expired link.'],['/sign/synthetic-boundary-review?token=%25%25%25bad','Failed to load contract. Please try again.']]){
  await page.goto(base+suffix);await page.getByText(text,{exact:true}).waitFor();checks.push('private signing rejection: '+text);
 }
 await page.screenshot({path:path.join(out,name+'-invalid-signing.png')});await page.goto(base+'/admin/unmatched-boundary');await page.getByRole('link',{name:'Return to MerkadAgency',exact:true}).waitFor();checks.push('unmatched private scope has safe fallback');
 await page.goto(base+'/admin/login');await page.getByRole('button',{name:'Sign in with Google'}).waitFor();
 const assets=fs.readdirSync('dist-private/assets');const pdf=assets.find(x=>/^index\.es-.*\.js$/.test(x));assert(pdf);
 const modules=await page.evaluate(async({pdf})=>{const m=await import('/assets/'+pdf),canvas=await import('/assets/html2canvas.esm-QH1iLAAe.js'),purify=await import('/assets/purify.es-B9ZVCkUG.js');return {pdf:typeof m.default,canvas:typeof canvas.default,sanitized:purify.default.sanitize('<p onclick="bad()">Synthetic</p>')}} ,{pdf});
 assert.deepEqual(modules,{pdf:'function',canvas:'function',sanitized:'<p>Synthetic</p>'});checks.push('all three coupled/independent support modules link and load');
 assert.equal(errors.length,0);assert.equal(forbidden.length,0);assert(methods.every(m=>m==='GET'));checks.push('no data API, analytics or mutation request even attempted');
 output.engines.push({name,version:browser.version(),checks,blockedFonts:blocked,forbidden,errors});await context.close();await browser.close();
}fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(output,null,2));console.log(output.engines.map(e=>({name:e.name,checks:e.checks.length,blockedFonts:e.blockedFonts.length,forbidden:e.forbidden.length})));})().catch(e=>{console.error(e);process.exit(1)});
