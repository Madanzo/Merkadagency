import test from 'node:test';
import assert from 'node:assert/strict';
import {selectMainRun,checkJobs,readMainChecks,requiredSteps,finalPublicationGate,workflowPath} from '../release-gate.mjs';
const sha='a'.repeat(40),other='b'.repeat(40);
const run={id:11,run_attempt:2,head_sha:sha,head_branch:'main',event:'push',path:workflowPath,status:'completed',conclusion:'success'};
const job={id:22,run_id:11,head_sha:sha,name:'static-site',conclusion:'success',run_attempt:2,steps:requiredSteps.map(name=>({name,conclusion:'success'}))};
test('Only actual-main push checks can satisfy the publication gate',()=>{
 for(const replacement of [{event:'pull_request'},{head_sha:other},{head_branch:'codex/seo-informational-oct20'},{path:'.github/workflows/other.yml'}])assert.throws(()=>selectMainRun([{...run,...replacement}],sha));
 assert.equal(selectMainRun([run],sha).id,11);
});
test('An older green run cannot hide a newer pending or failed run',()=>{
 for(const replacement of [{status:'in_progress',conclusion:null},{conclusion:'failure'},{conclusion:'cancelled'},{conclusion:'skipped'}])assert.throws(()=>selectMainRun([run,{...run,id:12,...replacement}],sha));
});
test('Every required job step must succeed on the validated attempt',()=>{
 assert.equal(checkJobs([job],run).id,22);
 for(const conclusion of ['skipped','failure','cancelled',null])assert.throws(()=>checkJobs([{...job,steps:[{...job.steps[0],conclusion},...job.steps.slice(1)]}],run));
 assert.throws(()=>checkJobs([{...job,run_attempt:1}],run));assert.throws(()=>checkJobs([{...job,steps:job.steps.slice(1)}],run));
});
test('The network gate rechecks the run attempt and rejects partial listings',async()=>{
 function mock(response){let calls=0;return async()=>({ok:true,status:200,json:async()=>response[calls++]});}
 const params={repository:'Madanzo/Merkadagency',sha,token:'synthetic-read-only-token'};
 const jobs={total_count:1,jobs:[job]};
 assert.equal((await readMainChecks({...params,fetchImpl:mock([{workflow_runs:[run]},jobs,run,{workflow_runs:[run]}])})).attempt,2);
 await assert.rejects(()=>readMainChecks({...params,fetchImpl:mock([{workflow_runs:[run]},jobs,{...run,run_attempt:3}])}));
 await assert.rejects(()=>readMainChecks({...params,fetchImpl:mock([{workflow_runs:[run]},{total_count:2,jobs:[job]}])}));
 await assert.rejects(()=>readMainChecks({...params,fetchImpl:mock([{workflow_runs:[run]},jobs,run,{workflow_runs:[run,{...run,id:12,status:'in_progress',conclusion:null}]}])}));
});
test('Main advancement aborts before the deployment callback',async()=>{
 const order=[];let deployed=false;
 await assert.rejects(()=>finalPublicationGate({sha,expectedMain:sha,readChecks:async()=>{order.push('checks');return {run:11}},readRemoteMain:async()=>{order.push('fresh-main');return other},deploy:async()=>{deployed=true}}));
 assert.equal(deployed,false);assert.deepEqual(order,['checks','fresh-main']);
});
test('Successful final recheck invokes only the injected synthetic deployment',async()=>{
 const order=[];const record=await finalPublicationGate({sha,expectedMain:sha,readChecks:async()=>{order.push('checks');return {run:11}},readRemoteMain:async()=>{order.push('fresh-main');return sha},deploy:async r=>{order.push('deploy');return r}});
 assert.deepEqual(order,['checks','fresh-main','deploy']);assert.equal(record.actualMain,sha);
});
