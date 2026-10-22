import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {pages} from '../../../website/content.mjs';
import {header,pageLayout} from '../../../website/layout.mjs';

test('Visual reflow retains every existing body byte in source order',()=>{
 for(const page of pages){
  const html=pageLayout(page);
  const retained=[...html.matchAll(/<!--copy:start-->([\s\S]*?)<!--copy:end-->/g)].map(m=>m[1]).join('');
  assert.equal(retained,page.body);
  const navigation=header(page.path);
  for(const match of navigation.matchAll(/href="(\/[^"#]*)"/g))assert(pages.some(p=>p.path===match[1]));
  assert(!/CRM|AI assistance|<script|<form|<input/.test(html+navigation));
 }
});

test('Release verification rejects omitted or duplicated source copy after reflow',async()=>{
 for(const mutation of ['omit','duplicate']){
  const temp=await mkdtemp(join(tmpdir(),'merkad-copy-rejection-'));
  try{
   await cp('dist-site',temp,{recursive:true});
   const file=join(temp,'services/website-development.html');
   const original=await readFile(file,'utf8');
   const changed=original.replace(/<!--copy:start-->([\s\S]*?)<!--copy:end-->/,(_all,body)=>`<!--copy:start-->${mutation==='omit'?'':body+body}<!--copy:end-->`);
   await writeFile(file,changed);
   assert.throws(()=>execFileSync('node',['scripts/seo/verify.mjs',temp],{stdio:'pipe'}),error=>error.stderr.toString().includes('Every source body byte must be retained'));
  }finally{await rm(temp,{recursive:true,force:true});}
 }
});
