// Explicit demo emulator only. No live credentials, database or network target.
import{test}from'node:test';import assert from'node:assert/strict';import{randomUUID}from'node:crypto';import{initializeApp,deleteApp}from'firebase-admin/app';import{getFirestore}from'firebase-admin/firestore';import{createDistributedLimiter}from'./distributed-abuse.mjs';
if(process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8685')throw Error('Requires explicit loopback demo emulator');
const app=initializeApp({projectId:'demo-merkad-intake'},'abuse-'+randomUUID()),db=getFirestore(app);let time=1000;const path='websiteIntakeAbuse/budget-'+randomUUID();
test('two independently created limiters share one atomic budget and window',async()=>{try{
 const a=createDistributedLimiter({db,documentPath:path,limit:3,now:()=>time}),b=createDistributedLimiter({db,documentPath:path,limit:3,now:()=>time});
 const results=await Promise.all(Array.from({length:12},(_,i)=>(i%2?a:b)()));assert.equal(results.filter(Boolean).length,3);assert.equal((await db.doc(path).get()).data().count,3);
 time+=60_001;assert.equal(await b(),true);assert.equal((await db.doc(path).get()).data().count,1);
 await db.doc(path).set({count:'corrupt',until:time+60_000});assert.equal(await a(),false);
}finally{await db.doc(path).delete();await deleteApp(app)}});
