// Only the authorized workflow dispatch may execute this entry point. Tests import
// release-gate.mjs and inject a no-op deployment; they never execute this file.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,readdir,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {readMainChecks,finalPublicationGate} from './release-gate.mjs';
assert.equal(process.env.GITHUB_ACTIONS,'true');
assert.equal(process.env.GITHUB_EVENT_NAME,'workflow_dispatch');
assert.equal(process.env.GITHUB_REF,'refs/heads/main');
const sha=process.env.APPROVED_SHA, expectedMain=process.env.EXPECTED_MAIN_SHA, mode=process.env.RELEASE_MODE;
assert.match(sha,/^[a-f0-9]{40}$/);assert(['candidate','compatible-fallback'].includes(mode));
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
assert.equal(git('rev-parse','HEAD'),sha);assert.equal(git('status','--porcelain','--untracked-files=all'),'');
if(mode==='candidate')assert.equal(sha,expectedMain);
const expectedHashes=(await readFile('dist-site.sha256','utf8')).trim().split('\n');
for(const line of expectedHashes){const match=/^([a-f0-9]{64})  ([^\n]+)$/.exec(line);assert(match);assert(!match[2].includes('..')&&!match[2].startsWith('/'));assert.equal(createHash('sha256').update(await readFile('dist-site/'+match[2])).digest('hex'),match[1],'Artifact changed after its build');}
const expectedPaths=expectedHashes.map(line=>line.slice(66)).sort();
async function listFiles(path=''){const result=[];for(const name of await readdir('dist-site/'+path)){const key=path+name,st=await lstat('dist-site/'+key);assert(!st.isSymbolicLink(),'Artifact symlink prohibited');if(st.isDirectory())result.push(...await listFiles(key+'/'));else result.push(key);}return result;}
assert.deepEqual((await listFiles()).sort(),expectedPaths,'Artifact file inventory changed after build');
execFileSync('node',['scripts/seo/verify.mjs'],{stdio:'inherit'});
const artifact=JSON.parse(await readFile('dist-site/website-release.json','utf8'));
assert.equal(artifact.source,sha);assert.equal(artifact.fallback,mode==='compatible-fallback');
const configSha256=createHash('sha256').update(await readFile('firebase.seo.json')).digest('hex');
await finalPublicationGate({sha,expectedMain,
  readChecks:()=>readMainChecks({repository:process.env.GITHUB_REPOSITORY,sha,token:process.env.GITHUB_TOKEN}),
  readRemoteMain:async()=>{
    const lines=git('ls-remote','--exit-code','origin','refs/heads/main').split('\n');assert.equal(lines.length,1);
    const [remote,ref]=lines[0].split(/\s+/);assert.equal(ref,'refs/heads/main');return remote;
  },
  deploy:async record=>{
    await writeFile('/tmp/merkad-publication-gate.json',JSON.stringify({...record,source:sha,mode,configSha256,artifact},null,2)+'\n');
    console.log(`Independent main check run ${record.checks.run}, job ${record.checks.job}, attempt ${record.checks.attempt}; refreshed main ${record.actualMain}.`);
    execFileSync('/tmp/merkad-hosting-cli/node_modules/.bin/firebase',['deploy','--only','hosting','--config','firebase.seo.json','--project','merkadagency-dd2aa','--non-interactive'],{stdio:'inherit'});
  },
});
