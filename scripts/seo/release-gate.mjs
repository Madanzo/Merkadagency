import assert from 'node:assert/strict';

export const workflowPath = '.github/workflows/seo-review.yml';
export const requiredSteps = [
  'Run npm ci', 'Run npm test', 'Run npx tsc -p tsconfig.app.json --noEmit',
  'Run npx tsc -p website/tsconfig.private.json --noEmit',
  'Run npx eslint website/private.tsx website/PrivateLayout.tsx',
  'Run npm run build:seo', 'Run node --test scripts/seo/acceptance.test.mjs scripts/seo/tests/*.test.mjs',
  'Run npm run test:private',
];
export function selectMainRun(runs, sha) {
  const matching=runs.filter(r=>r.head_sha===sha && r.head_branch==='main' && r.event==='push' && r.path===workflowPath);
  assert(matching.length,'No independent main-push check for approved SHA');
  const latest=matching.sort((a,b)=>b.id-a.id)[0];
  assert.equal(latest.status,'completed','Latest exact-main run is not completed');
  assert.equal(latest.conclusion,'success','Latest exact-main run did not succeed');
  return latest;
}
export function checkJobs(jobs,run) {
  const matches=jobs.filter(j=>j.name==='static-site');assert.equal(matches.length,1,'Expected one static-site job');
  const job=matches[0];assert.equal(job.conclusion,'success');assert.equal(job.run_id,run.id);assert.equal(job.head_sha,run.head_sha);
  if(job.run_attempt!==undefined)assert.equal(job.run_attempt,run.run_attempt,'Job attempt differs from validated run');
  for(const name of requiredSteps) {
    const steps=job.steps.filter(s=>s.name===name);assert.equal(steps.length,1,`Missing or duplicate required step: ${name}`);
    assert.equal(steps[0].conclusion,'success',`Required step was not successful: ${name}`);
  }
  return job;
}
export async function readMainChecks({repository,sha,token,fetchImpl=fetch}) {
  assert.equal(repository,'Madanzo/Merkadagency');assert.match(sha,/^[a-f0-9]{40}$/);assert(token,'Missing read-only Actions token');
  async function get(path) {
    const response=await fetchImpl(`https://api.github.com/repos/${repository}/${path}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},redirect:'error'});
    assert(response.ok,`GitHub check lookup failed (${response.status})`);return response.json();
  }
  const list=await get(`actions/workflows/seo-review.yml/runs?event=push&branch=main&head_sha=${sha}&per_page=100`);
  const run=selectMainRun(list.workflow_runs,sha);
  const jobs=await get(`actions/runs/${run.id}/jobs?filter=latest&per_page=100`);
  assert.equal(jobs.total_count,jobs.jobs.length,'Incomplete job listing');const job=checkJobs(jobs.jobs,run);
  const refreshed=await get(`actions/runs/${run.id}`);
  assert.equal(refreshed.run_attempt,run.run_attempt,'Check attempt changed during gate');
  assert.equal(selectMainRun([refreshed],sha).id,run.id);
  const finalList=await get(`actions/workflows/seo-review.yml/runs?event=push&branch=main&head_sha=${sha}&per_page=100`);
  const latest=selectMainRun(finalList.workflow_runs,sha);
  assert.equal(latest.id,run.id,'A newer main check appeared during gate');
  assert.equal(latest.run_attempt,run.run_attempt,'Check attempt changed during final lookup');
  return {workflow:workflowPath,event:'push',branch:'main',sha,run:run.id,attempt:run.run_attempt,job:job.id,conclusion:'success'};
}
export async function finalPublicationGate({sha,expectedMain,readChecks,readRemoteMain,deploy}) {
  assert.match(expectedMain,/^[a-f0-9]{40}$/);
  const checks=await readChecks(sha);
  // Intentionally the last remote operation before invoking the publication command.
  const actualMain=await readRemoteMain();
  assert.equal(actualMain,expectedMain,'Main advanced: publication aborted before deploy');
  return deploy({checks,actualMain,checkedAt:new Date().toISOString()});
}
