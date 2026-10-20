import assert from 'node:assert/strict';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {inspectBundle} from './private-analysis.mjs';
const hash=data=>createHash('sha256').update(data).digest('hex');
export async function verifyPrivate() {
  const baseline=JSON.parse(await readFile('website/private-baseline/manifest.json','utf8'));
  const captured=JSON.parse(await readFile('website/private-baseline/functions.json','utf8'));
  assert.equal(captured.sha256,baseline.files.find(x=>x.path==='/assets/index-oYkhmNmm.js').sha256);
  const files=await readdir('dist-private/assets');
  const primary=files.filter(x=>/^private-.*\.js$/.test(x));assert.equal(primary.length,1);
  const candidate=inspectBundle(await readFile(`dist-private/assets/${primary[0]}`,'utf8'));
  assert.equal(candidate.firebaseConfigurationHash,captured.firebaseConfigurationHash,'Firebase public configuration differs from live');
  const components=[];
  for(const key of Object.keys(captured.functions)) {
    const a=captured.functions[key],b=candidate.functions[key];assert.equal(a.fingerprint,b.fingerprint,`${key} compiled behavior changed`);
    assert.equal(a.dependencies.length,b.dependencies.length);
    const changed=[];
    for(let i=0;i<a.dependencies.length;i++)if(a.dependencyFingerprints[i].hash!==b.dependencyFingerprints[i].hash)changed.push(i);
    // Only the publicly reachable login's marketing Layout is intentionally replaced.
    assert.deepEqual(changed,key==='login'?[4]:[],`Unexpected direct dependency change in ${key}`);
    components.push({name:key,fingerprint:b.fingerprint,directDependencies:b.dependencies.length,intentionalLayoutChange:key==='login'});
  }
  const preserved=[];
  for(const path of ['/assets/index-DxLjU7W-.css','/assets/html2canvas.esm-QH1iLAAe.js','/assets/purify.es-B9ZVCkUG.js','/favicon.png']) {
    const entry=baseline.files.find(x=>x.path===path);assert(entry);
    const data=await readFile('dist-private'+path);assert.equal(hash(data),entry.sha256,`Live asset changed: ${path}`);
    preserved.push({path,sha256:entry.sha256,bytes:data.length});
  }
  const record={baselineVersion:baseline.version,firebaseConfigurationHash:candidate.firebaseConfigurationHash,baselinePrimarySha256:captured.sha256,privatePrimary:{path:'/assets/'+primary[0],sha256:candidate.sha256},preserved,components,
    intentionalBoundary:['private-only routes','GA/Clarity/public marketing removed from bootstrap','login marketing chrome replaced','unsupported customer preview withheld','analytics SDK forcibly gated'],
    limit:'Captured entry functions and direct dependencies are compared; isolated synthetic tests do not establish production provider/backend behavior or whole-bundle byte equivalence.'};
  await writeFile('dist-private/private-boundary.json',JSON.stringify(record,null,2)+'\n');
  return record;
}
