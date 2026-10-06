// Executes imported canonical CRM transaction code against the real local Firestore
// emulator. This test contains no alternative CRM persistence implementation.
import { afterAll, beforeAll, expect, it } from 'vitest';
import { createServer, type Server } from 'node:http';
import { createRequire } from 'node:module';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { executeIntake, IdempotencyConflictError, type ResolvedTenant } from '@/lib/leads/server/intake';
import { validateIntake } from '@/lib/leads/validate';
import { successBody } from '@/lib/leads/http';
import { DEFAULT_WEBSITE_LEADS_CONFIG } from '@/lib/leads/config';
import { communicationsOutboxPath, communicationsPolicyPath } from '@/lib/comms/enrollment';
import { parseIntakeEnvelope, parseStoredCommunicationsPolicy } from '@/lib/comms/intake-envelope';
import { createRuntime, nodeListener } from './runtime.mjs';
import { createLimiter } from './abuse.mjs';

if (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8685') throw new Error('Local emulator required');
const requireCRM = createRequire(`${process.env.CRM_SOURCE_DIR}/package.json`);
const { initializeApp, deleteApp } = requireCRM('firebase-admin/app');
const { getFirestore } = requireCRM('firebase-admin/firestore');
const app = initializeApp({projectId:'demo-merkad-intake'},'website-integration');
const db = getFirestore(app);
const tenant: ResolvedTenant = {
  id: `fixture_${randomUUID()}`, slug:'fixture_merkadagency', displayName:'Synthetic website integration',
  config: {...DEFAULT_WEBSITE_LEADS_CONFIG,enabled:true,matchKeysBackfilledAt:'2026-09-10',
    defaultServiceKey:'systems_review',services:[{key:'systems_review',label:'Systems review'}],
    defaultStageKey:'synthetic_new',defaultOwnerUid:'synthetic-owner',notificationRecipients:[],salesEmail:'',replyToEmail:''}, stages:[{key:'synthetic_new',label:'Synthetic new inquiry'}],
};
const servers: Server[]=[];
let edgeUrl='';let crmUrl='';let dropNext=false;let abortNext=false;
const forwarded: Array<{key:string,body:string}>=[];
async function listen(server: Server) { servers.push(server);server.listen(0,'127.0.0.1');await once(server,'listening');return `http://127.0.0.1:${(server.address() as {port:number}).port}`; }
async function counts() { const result: Record<string,number>={};for(const name of ['leads','contacts','deals','auditEvents','idempotency']) result[name]=(await db.collection(`tenants/${tenant.id}/${name}`).get()).size;return result; }
const fields={name:'Synthetic Person',email:'synthetic@example.test',subject:'Systems review',message:'Local integration fixture only',submittedAt:'2026-09-10T23:00:00.000Z',website:''};
const post=(key:string,body: typeof fields & Record<string,unknown>=fields)=>fetch(`${edgeUrl}/api/contact-intake`,{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://website.example.test','Idempotency-Key':key,'X-Turnstile-Token':randomUUID()},body:JSON.stringify(body)});
beforeAll(async()=>{
  // Enabled local fixture, not MerkadAgency production configuration.
  const policy = {enabled:true,readinessApproved:true,notificationOwner:'crm',policyVersion:1,
    transitionId:'synthetic_transition',cutoverAt:'2026-09-01T00:00:00.000Z',ownedPurposes:['lead_received']};
  expect(parseStoredCommunicationsPolicy(policy)).not.toBeNull();
  await db.doc(`${communicationsPolicyPath(tenant.id)}/canvasCommunications`).set(policy);
  crmUrl=await listen(createServer(async(req,res)=>{
    const chunks=[];for await(const chunk of req)chunks.push(chunk);const rawBody=Buffer.concat(chunks).toString();
    const key=String(req.headers['idempotency-key']);forwarded.push({key,body:rawBody});
    expect(req.url).toBe('/api/v1/tenants/fixture_merkadagency/leads/intake');
    const raw=JSON.parse(rawBody);const validation=validateIntake(raw);
    if(!validation.ok){res.writeHead(422);res.end(JSON.stringify(validation));return;}
    try {
      const executorDb=abortNext ? new Proxy(db,{get(target,prop){if(prop==='runTransaction')return async (callback: (tx: unknown) => Promise<unknown>)=>target.runTransaction(async(tx:unknown)=>{await callback(tx);throw new Error('synthetic transaction abort');});const value=target[prop];return typeof value==='function'?value.bind(target):value;}}):db;
      abortNext=false;
      const result=await executeIntake({db:executorDb,tenant,lead:validation.value,raw,rawBody,idempotencyKey:key,apiKeyId:'synthetic-key-id',spamRisk:'clean',spamSignals:[],isTest:false,resolveCommunicationsPolicyFromStore:true,communicationsEnvelope:parseIntakeEnvelope(raw),now:new Date(),correlationId:'synthetic-local'});
      // Read documents after the transaction resolves, before returning ANY receipt.
      expect((await db.doc(`tenants/${tenant.id}/leads/${result.data.leadId}`).get()).exists).toBe(true);
      expect((await db.doc(`tenants/${tenant.id}/contacts/${result.data.contactId}`).get()).exists).toBe(true);
      expect((await db.doc(`tenants/${tenant.id}/deals/${result.data.opportunityId}`).get()).exists).toBe(true);
      if(dropNext){dropNext=false;res.destroy();return;}
      const code=result.duplicate?'duplicate_ignored':'created';res.writeHead(result.duplicate?200:201,{'Content-Type':'application/json'});res.end(JSON.stringify(successBody(code,'Local fixture',result.data)));
    }catch(error){res.writeHead(error instanceof IdempotencyConflictError?409:500,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,code:error instanceof IdempotencyConflictError?'idempotency_conflict':'internal_error'}));}
  }));
  const transport=async(url:string,init: RequestInit)=>{
    if(url==='https://challenges.cloudflare.com/turnstile/v0/siteverify')return Response.json({success:true,hostname:'website.example.test',action:'contact_intake'});
    if(!url.startsWith('https://crm.example.test/api/v1/tenants/fixture_merkadagency/'))throw new Error('Unexpected outbound request blocked');
    return fetch(url.replace('https://crm.example.test',crmUrl),init);
  };
  edgeUrl=await listen(createServer(nodeListener(createRuntime({config:{enabled:true,crmOrigin:'https://crm.example.test',tenantSlug:tenant.slug,apiKey:'synthetic-test-only',requestedService:'systems_review',allowedOrigins:['https://website.example.test'],turnstileSecret:'synthetic-verifier-only',turnstileSiteKey:'synthetic-site-key'},fetchImpl:transport,limiter:createLimiter({limit:100})}))));
});
afterAll(async()=>{for(const server of servers)await new Promise<void>(resolve=>server.close(()=>resolve()));await deleteApp(app);});

it('mounted route returns success only after canonical committed submission',async()=>{
  const before=await counts();const response=await post(randomUUID());expect(response.status).toBe(200);expect((await response.json()).code).toBe('persisted');
  const after=await counts();expect(after.leads).toBe(before.leads+1);expect(after.contacts).toBe(before.contacts+1);expect(after.deals).toBe(before.deals+1);expect(after.idempotency).toBe(before.idempotency+1);
});
it('response loss after commit retries unchanged key/body without a second lead or opportunity',async()=>{
  const key=randomUUID();dropNext=true;expect((await post(key)).status).toBe(502);const committed=await counts();
  const retry=await post(key);expect(retry.status).toBe(200);expect(await retry.json()).toEqual({code:'persisted',submissionId:key});expect(await counts()).toEqual(committed);
  const attempts=forwarded.filter(row=>row.key===key);expect(attempts).toHaveLength(2);expect(attempts[0].body).toBe(attempts[1].body);
});
it('changed payload under the same key conflicts and cannot change committed records',async()=>{
  const key=randomUUID();expect((await post(key)).status).toBe(200);const committed=await counts();
  expect((await post(key,{...fields,message:'Changed payload'})).status).toBe(409);expect(await counts()).toEqual(committed);
});
it('concurrent identical requests commit one lead and one opportunity',async()=>{
  const before=await counts();const key=randomUUID();const replies=await Promise.all([post(key),post(key),post(key),post(key)]);
  expect(replies.map(r=>r.status)).toEqual([200,200,200,200]);const after=await counts();expect(after.leads).toBe(before.leads+1);expect(after.deals).toBe(before.deals+1);expect(after.idempotency).toBe(before.idempotency+1);
});
it('transaction abort creates no partial records and never returns success',async()=>{
  const before=await counts();abortNext=true;expect((await post(randomUUID())).status).toBe(502);expect(await counts()).toEqual(before);
});

it('concurrent conflicting payloads commit one winner and reject the changed request',async()=>{
  const before=await counts();const key=randomUUID();
  const responses=await Promise.all([post(key),post(key,{...fields,message:'Concurrent changed payload'})]);
  expect(responses.map(r=>r.status).sort()).toEqual([200,409]);
  const after=await counts();expect(after.leads).toBe(before.leads+1);expect(after.deals).toBe(before.deals+1);expect(after.idempotency).toBe(before.idempotency+1);
});

it('qualification fields commit with enabled synthetic policy and zero notification enrollment',async()=>{
  const key=randomUUID();
  const qualification={companyName:'Synthetic Studio',currentStack:'Email and spreadsheet',locale:'es-mx',referralBrand:'synthetic-referrer'};
  dropNext=true;
  expect((await post(key,{...fields,...qualification})).status).toBe(502);
  const committed=await counts();
  expect((await post(key,{...fields,...qualification})).status).toBe(200);
  expect(await counts()).toEqual(committed);
  const attempts=forwarded.filter(row=>row.key===key);
  expect(attempts[0].body).toBe(attempts[1].body);
  const wire=JSON.parse(forwarded.find(row=>row.key===key)!.body);
  for(const field of ['notificationOwner','policyVersion','transitionId','capturedAt','testSuppressed']) expect(wire).not.toHaveProperty(field);
  const lead=(await db.collection(`tenants/${tenant.id}/leads`).where('externalDocId','==',key).get()).docs[0].data();
  expect(lead).toMatchObject({...qualification,locale:'es-MX',receiptEnrollment:{state:'not_enrolled',reason:'transition_id_mismatch'}});
  expect((await db.collection(communicationsOutboxPath(tenant.id)).get()).size).toBe(0);
  expect((await db.collection(`tenants/${tenant.id}/companies`).get()).size).toBe(0);
});
