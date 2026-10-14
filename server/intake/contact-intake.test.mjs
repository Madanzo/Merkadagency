import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createContactIntake } from './contact-intake.mjs';
const config = { enabled: true, crmOrigin: 'https://crm.example.test', tenantSlug: 'test_tenant', apiKey: 'local-test-only', requestedService: 'test-consultation', allowedOrigins: ['https://website.example.test'] };
const fields = { name: 'Test Person', email: 'person@example.test', subject: 'Website', message: 'Please review the intake.', submittedAt: '2026-09-10T23:00:00.000Z', website: '' };
const key = 'local-test-submission-001';
const request = (body = fields, headers = {}, method = 'POST') => new Request('https://website.example.test/api/contact-intake', { method, headers: { Origin: config.allowedOrigins[0], 'Content-Type': 'application/json', 'Idempotency-Key': key, ...headers }, ...(method === 'POST' ? { body: JSON.stringify(body) } : {}) });
const receipt = (code = 'created') => ({ ok: true, code, data: { leadId: 'lead', contactId: 'contact', opportunityId: 'deal' } });
const options = (fetchImpl) => ({ config, verifyAbuse: async () => true, fetchImpl });
test('disabled or incomplete configuration never forwards', async () => {
  for (const patch of [{ enabled: false }, { apiKey: '' }, { tenantSlug: '' }, { crmOrigin: 'http://crm.example.test' }]) {
    const handler = createContactIntake({ ...options(() => assert.fail('must not forward')), config: { ...config, ...patch } });
    assert.equal((await handler(request())).status, 503);
  }
  assert.equal((await createContactIntake({ config })(request())).status, 503);
});
test('rejects bad method, origin, key, media, fields and honeypot without forwarding', async () => {
  const handler = createContactIntake(options(() => assert.fail('must not forward')));
  for (const [req, status] of [[request(fields, {}, 'GET'),405], [request(fields,{Origin:'https://wrong.test'}),403], [request(fields,{'Idempotency-Key':'bad'}),400], [request(fields,{'Content-Type':'text/plain'}),415], [request({...fields,email:'bad'}),422], [request({...fields,tenantSlug:'other'}),422], [request({...fields,website:'bot'}),422], [request({...fields,message:' '.repeat(20)}),422], [request({...fields,message:'x'.repeat(17000)}),413]]) assert.equal((await handler(req)).status,status);
});
test('abuse verification is required and cannot be supplied in browser JSON', async () => {
  const handler = createContactIntake({ ...options(() => assert.fail('must not forward')), verifyAbuse: async () => false });
  assert.equal((await handler(request())).status,429);
  assert.equal((await handler(request({...fields,turnstileVerified:true}))).status,422);
});
test('lost response retry sends identical bytes and key, accepts existing CRM receipt', async () => {
  const calls = [];
  const handler = createContactIntake(options(async (url, init) => {
    calls.push({url,...init});
    if(calls.length === 1) throw new Error('response lost after commit');
    return Response.json(receipt('duplicate_ignored'));
  }));
  assert.equal((await handler(request())).status,502);
  const result = await handler(request());
  assert.deepEqual(await result.json(),{code:'persisted',submissionId:key});
  assert.equal(calls[0].body,calls[1].body);
  assert.equal(calls[0].headers['Idempotency-Key'],key);
  assert.equal(calls[0].url,'https://crm.example.test/api/v1/tenants/test_tenant/leads/intake');
  // Baseline 2df43f2 upstream representation for legacy pending requests.
  assert.equal(calls[0].body,JSON.stringify({fullName:fields.name,email:fields.email,
    message:`Subject: ${fields.subject}\n\n${fields.message}`,requestedService:config.requestedService,
    preferredContactMethod:'email',sourceSystem:'merkadagency_contact_v1',externalDocId:key,
    submittedAt:fields.submittedAt,marketingConsent:false,smsConsent:false,website:'',turnstileVerified:true}));
  const body=JSON.parse(calls[0].body);
  assert.equal(body.message,`Subject: ${fields.subject}\n\n${fields.message}`);
  assert.equal(body.marketingConsent,false); assert.equal(body.smsConsent,false);
  assert.equal(calls[0].redirect,'error');
});
test('confirms created receipt but never accepts an HTTP-only or partial success', async () => {
  const handler=createContactIntake(options(async()=>Response.json(receipt(),{status:201})));
  assert.equal((await handler(request())).status,200);
  for(const body of [{}, {...receipt(),ok:false},receipt('rejected_spam'),{...receipt(),data:{leadId:'only'}}]) {
    const bad=createContactIntake(options(async()=>Response.json(body,{status:201})));
    assert.equal((await bad(request())).status,502);
  }
  assert.equal((await createContactIntake(options(async()=>Response.json({},{status:409})))(request())).status,409);
});
test('qualification mapping preserves supplied values, omits absent values and rejects envelope claims', async()=>{
  const calls=[];
  const handler=createContactIntake(options(async(_url,init)=>{calls.push(JSON.parse(init.body));return Response.json(receipt());}));
  const qualification={companyName:'Example Studio',currentStack:'Email',locale:'es-MX',referralBrand:'example'};
  assert.equal((await handler(request({...fields,...qualification}))).status,200);
  for(const [key,value] of Object.entries(qualification)) assert.equal(calls[0][key],value);
  assert.equal((await handler(request(fields))).status,200);
  for(const key of Object.keys(qualification)) assert.equal(Object.hasOwn(calls[1],key),false);
  for(const patch of [{locale:'en_US'},{currentStack:'x'.repeat(601)},{companyName:123},{notificationOwner:'crm'}]) assert.equal((await handler(request({...fields,...patch}))).status,422);
  assert.equal(calls.length,2);
});
test('forwards supported attribution and context but rejects routing/consent injection', async()=>{
  const calls=[];
  const handler=createContactIntake(options(async(_url,init)=>{calls.push(JSON.parse(init.body));return Response.json(receipt());}));
  const attribution={landingPage:'https://website.example.test/',pageUrl:'https://website.example.test/contact',referrer:'https://canvas.example.test',utmSource:'canvas',utmCampaign:'fall_2026'};
  assert.equal((await handler(request({...fields,attribution,desiredTimeline:'1–3 months',estimatedBudget:'2500'}))).status,200);
  assert.deepEqual(calls[0].attribution,attribution);
  assert.equal(calls[0].estimatedBudget,'2500');
  assert.equal(calls[0].desiredTimeline,'1–3 months');
  assert.equal(calls[0].marketingConsent,false);
  for(const patch of [{attribution:{tenant:'other'}},{attribution:{referrer:'https://example.test/?email=private'}},{attribution:{utmSource:'person@example.test'}},{notificationOwner:'none'},{marketingConsent:true},{estimatedBudget:2500}]) {
    assert.equal((await handler(request({...fields,...patch}))).status,422);
  }
  assert.equal(calls.length,1);
});
test('oversized upstream receipts never become a successful inquiry', async()=>{
  const handler=createContactIntake(options(async()=>new Response('x'.repeat(17000))));
  assert.equal((await handler(request())).status,502);
});
