// Review artifact only unless --candidate is explicitly selected. No deployment.
// Existing informational release workflow refuses both variants.
import{readFile,writeFile,cp,rm}from'node:fs/promises';import{execFileSync}from'node:child_process';import{build}from'vite';import{createHash}from'node:crypto';
import{inquiryForm,inquiryStyles}from'../../website/inquiry/form.mjs';import{intakePrivacy}from'../../website/inquiry/privacy.mjs';import{pages}from'../../website/content.mjs';
const candidate=process.argv.includes('--candidate'),dir=candidate?'dist-intake-candidate':'dist-intake-review';
execFileSync('node',['scripts/seo/build.mjs','--preview'],{stdio:'inherit'});
await rm(dir,{recursive:true,force:true});await cp('dist-site-preview',dir,{recursive:true});
await build({configFile:false,define:{__INTAKE_LAB__:'false'},build:{outDir:'dist-intake-client',emptyOutDir:true,lib:{entry:'website/inquiry/client.ts',formats:['es'],fileName:()=> 'inquiry.js'},minify:true}});
await cp('dist-intake-client/inquiry.js',dir+'/inquiry.js');
let contact=await readFile(dir+'/contact.html','utf8');contact=contact.replace('</head>',`<style>${inquiryStyles}</style></head>`).replace('<h2>Start with a short project summary</h2>',inquiryForm+'<h2>Start with a short project summary</h2>').replace('Nothing is submitted by this website.','Email drafts are sent only from your email app.').replace('</body>','<script type="module" src="/inquiry.js"></script></body>');
await writeFile(dir+'/contact.html',contact);
const original=pages.find(p=>p.path==='/legal/privacy');let privacy=await readFile(dir+'/legal/privacy.html','utf8');privacy=privacy.replace(original.body,intakePrivacy.body).replaceAll(original.description,intakePrivacy.description);await writeFile(dir+'/legal/privacy.html',privacy);
if(candidate){for(const p of pages){const path=dir+(p.path==='/'?'/index':p.path)+'.html';await writeFile(path,(await readFile(path,'utf8')).replace('name="robots" content="noindex,nofollow"','name="robots" content="index,follow"'))}await cp('dist-site/robots.txt',dir+'/robots.txt');}
const manifest=JSON.parse(await readFile(dir+'/website-release.json','utf8'));Object.assign(manifest,{preview:!candidate,intake:'runtime-gated',analytics:false,intakeClient:'production',hostingConfigSha256:createHash('sha256').update(await readFile('firebase.intake.proposal.json')).digest('hex')});await writeFile(dir+'/website-release.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`${dir}: real-provider client prepared, backend-gated; no activation/deployment performed.`);
