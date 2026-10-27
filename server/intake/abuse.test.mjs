import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createLimiter, createTurnstileVerifier } from './abuse.mjs';
import { createRuntime, runtimeConfig, nodeListener } from './runtime.mjs';
import { createServer } from 'node:http';
import { once } from 'node:events';
test('limiter bounds bursts and memory, expires buckets, rejects missing address',()=>{
  let time=0;const allow=createLimiter({limit:2,maxEntries:1,windowMs:100,now:()=>time});
  assert.equal(allow(''),false);assert.equal(allow('a'),true);assert.equal(allow('a'),true);assert.equal(allow('a'),false);assert.equal(allow('b'),false);time=101;assert.equal(allow('b'),true);
});
test('verifier checks secret/token, provider success, hostname and action',async()=>{
  const request=new Request('http://local.test',{headers:{'X-Turnstile-Token':'synthetic'}});
  for(const result of [{success:false},{success:true,hostname:'wrong',action:'contact_intake'},{success:true,hostname:'website.test',action:'other'}]) {
    const verify=createTurnstileVerifier({secret:'test-only',allowedHostnames:['website.test'],fetchImpl:async()=>Response.json(result)});assert.equal(await verify(request),false);
  }
  const verify=createTurnstileVerifier({secret:'test-only',allowedHostnames:['website.test'],fetchImpl:async()=>Response.json({success:true,hostname:'website.test',action:'contact_intake'})});
  assert.equal(await verify(request),true);assert.equal(await verify(new Request('http://local.test')),false);
});
test('disabled runtime exposes no credentials or tenant and routes POST to explicit 503',async()=>{
  assert.deepEqual(runtimeConfig({CONTACT_INTAKE_ENABLED:'false'}),{enabled:false});
  const runtime=createRuntime({fetchImpl:()=>assert.fail('network forbidden')});
  const server=createServer(nodeListener(runtime));server.listen(0,'127.0.0.1');await once(server,'listening');
  try {
    const url=`http://127.0.0.1:${server.address().port}`;
    assert.deepEqual(await (await fetch(`${url}/api/contact-intake/config`)).json(),{enabled:false});
    assert.equal((await fetch(`${url}/api/contact-intake`,{method:'POST',body:'{}'})).status,503);
    assert.equal((await fetch(`${url}/api/contact-intake`)).status,405);
    assert.equal((await fetch(`${url}/api/unrelated`)).status,404);
  } finally {await new Promise(resolve=>server.close(resolve));}
});

test('malformed enabled configuration fails closed without throwing',async()=>{
  const runtime=createRuntime({config:{enabled:true,crmOrigin:'https://crm.test',tenantSlug:'fixture',apiKey:'fixture',requestedService:'review',turnstileSiteKey:'fixture',turnstileSecret:'fixture',allowedOrigins:['not a URL']},fetchImpl:()=>assert.fail('network forbidden')});
  assert.deepEqual(await (await runtime(new Request('http://local.test/api/contact-intake/config'))).json(),{enabled:false});
});
test('provider outages, malformed and oversized responses fail closed without leaking secrets', async()=>{
  const request=new Request('http://local.test',{headers:{'X-Turnstile-Token':'synthetic'}});
  for(const fetchImpl of [async()=>{throw new Error('provider unavailable');},async()=>new Response('<html>bad</html>'),async()=>new Response('x'.repeat(9000)),async()=>Response.json(null)]) {
    const verify=createTurnstileVerifier({secret:'synthetic-only',allowedHostnames:['website.test'],fetchImpl});
    assert.equal(await verify(request),false);
  }
});
test('blank secret configuration cannot expose enabled intake or forward', async()=>{
  const config={enabled:true,crmOrigin:'https://crm.test',tenantSlug:'fixture',apiKey:'   ',requestedService:'inquiry',turnstileSiteKey:'fixture',turnstileSecret:'fixture',allowedOrigins:['https://website.test']};
  const runtime=createRuntime({config,fetchImpl:()=>assert.fail('network forbidden')});
  assert.deepEqual(await (await runtime(new Request('http://local.test/api/contact-intake/config'))).json(),{enabled:false});
});
test('rate limit and concurrent request cap protect verification and upstream work', async()=>{
  const config={enabled:true,crmOrigin:'https://crm.test',tenantSlug:'fixture',apiKey:'synthetic',requestedService:'inquiry',turnstileSiteKey:'fixture',turnstileSecret:'synthetic',allowedOrigins:['https://website.test']};
  let release; const blocked=new Promise(resolve=>{release=resolve;}); let calls=0;
  const runtime=createRuntime({config,limiter:()=>true,fetchImpl:async()=>{calls++;await blocked;return Response.json({success:false});}});
  const request=()=>new Request('https://website.test/api/contact-intake',{method:'POST',headers:{Origin:'https://website.test','Content-Type':'application/json','Idempotency-Key':'synthetic-attempt-0001','X-Turnstile-Token':'synthetic'},body:JSON.stringify({name:'Test',email:'test@example.test',subject:'Inquiry',message:'Synthetic',submittedAt:'2026-10-06T00:00:00Z',website:''})});
  const attempts=Array.from({length:8},()=>runtime(request(),{address:'synthetic'}));
  assert.equal((await runtime(request(),{address:'synthetic'})).status,429);
  release();await Promise.all(attempts);assert.equal(calls,8);
  const denied=createRuntime({config,limiter:()=>false,fetchImpl:()=>assert.fail('network forbidden')});
  assert.equal((await denied(request(),{address:'synthetic'})).status,429);
});
