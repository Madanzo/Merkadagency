import{test}from'node:test';import assert from'node:assert/strict';import{createDistributedLimiter}from'./distributed-abuse.mjs';import{createRuntime}from'./runtime.mjs';
test('shared budget errors and timeouts fail closed',async()=>{
 for(const runTransaction of [async()=>{throw Error('unavailable')},()=>new Promise(()=>{})]){const admit=createDistributedLimiter({db:{doc:()=>({}),runTransaction},limit:2,timeoutMs:5});assert.equal(await admit(),false)}
});
test('enabling config without a shared budget remains closed',async()=>{
 const config={enabled:true,crmOrigin:'https://crm.test',tenantSlug:'fixture',apiKey:'test',requestedService:'inquiry',turnstileSiteKey:'test',turnstileSecret:'test',allowedOrigins:['https://website.test']};
 const runtime=createRuntime({config,fetchImpl:()=>assert.fail('network forbidden')});assert.deepEqual(await(await runtime(new Request('https://website.test/api/contact-intake/config'))).json(),{enabled:false});
});
test('exhausted shared budget rejects before provider or CRM calls',async()=>{
 const config={enabled:true,crmOrigin:'https://crm.test',tenantSlug:'fixture',apiKey:'test',requestedService:'inquiry',turnstileSiteKey:'test',turnstileSecret:'test',allowedOrigins:['https://website.test']};
 const runtime=createRuntime({config,distributedLimiter:async()=>false,limiter:()=>true,fetchImpl:()=>assert.fail('network forbidden')});const result=await runtime(new Request('https://website.test/api/contact-intake',{method:'POST'}),{address:'fixture'});assert.equal(result.status,503);assert.deepEqual(await result.json(),{code:'temporarily_unavailable'});
});
