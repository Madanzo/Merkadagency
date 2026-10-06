import { afterEach, expect, it, vi } from 'vitest';
import { prepareContactAttempt, restoreContactAttempt, submitContactAttempt, CONTACT_ATTEMPT_KEY } from '@/lib/contactIntake';
const fields={name:'Synthetic Person',email:'person@example.test',subject:'Website',message:'Synthetic inquiry'};
afterEach(()=>{sessionStorage.clear();vi.unstubAllGlobals();});
it('fresh attempts include only supplied qualification values and omit blanks',()=>{
  const attempt=prepareContactAttempt({...fields,companyName:'Example Studio',currentStack:'Email',locale:'es-MX',referralBrand:'example'});
  expect(JSON.parse(attempt.body)).toMatchObject({companyName:'Example Studio',currentStack:'Email',locale:'es-MX',referralBrand:'example'});
  const absent=JSON.parse(prepareContactAttempt({...fields,companyName:' ',locale:''}).body);
  for(const key of ['companyName','currentStack','locale','referralBrand']) expect(absent).not.toHaveProperty(key);
});
it('old saved pending bytes and key remain unchanged after restore and retry',async()=>{
  const pending={key:'synthetic-old-pending-001',body:'{ "name":"Synthetic Person", "email":"person@example.test", "subject":"Website", "message":"Synthetic inquiry", "submittedAt":"2026-09-10T23:00:00.000Z", "website":"" }'};
  sessionStorage.setItem(CONTACT_ATTEMPT_KEY,JSON.stringify(pending));
  const restored=restoreContactAttempt()!;expect(restored).toEqual(pending);
  const send=vi.fn<typeof fetch>(async()=>Response.json({code:'persisted',submissionId:pending.key}));vi.stubGlobal('fetch',send);
  await submitContactAttempt(restored,'synthetic-token');
  expect(send.mock.calls[0][1]).toMatchObject({body:pending.body,headers:{'Idempotency-Key':pending.key}});
});
it('rejects invalid optional qualification values before creating an attempt',()=>{
  for(const patch of [{companyName:'x'.repeat(201)},{currentStack:'x'.repeat(601)},{locale:'en_US'},{referralBrand:'x'.repeat(61)}]) expect(()=>prepareContactAttempt({...fields,...patch})).toThrow();
});
it('carries supported timeline, budget and attribution without changing retries', () => {
  const body = JSON.parse(prepareContactAttempt({...fields, desiredTimeline:'1–3 months', estimatedBudget:'2500', attribution:{utmSource:'newsletter',landingPage:'https://merkadagency.com/'}}).body);
  expect(body).toMatchObject({desiredTimeline:'1–3 months',estimatedBudget:'2500',attribution:{utmSource:'newsletter'}});
});
