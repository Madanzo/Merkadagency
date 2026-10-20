// Execute the captured live and emitted candidate function bodies with identical
// synthetic dependencies. No Firebase SDK, account, contract or network is used.
import React from 'react';
import * as JSX from 'react/jsx-runtime';
import {render,screen,fireEvent,waitFor,cleanup,act} from '@testing-library/react';
import {beforeAll,beforeEach,afterEach,describe,it,expect,vi} from 'vitest';
import {readFile,readdir} from 'node:fs/promises';
import {inspectBundle} from '../../scripts/seo/private-analysis.mjs';

let baseline,candidate;
const roles={
 emailAllowed:['allowedEmails'],
 signing:['params','search','React','doc','db','getDoc','updateDoc','Timestamp','getFunctions','callable','JSX','Icon','Card','CardContent','Icon','Icon','Badge','currency','Icon','Icon','SignaturePad','Icon','Button'],
 authHook:['React','onAuthChange','signIn','signOut','isEmailAllowed'],
 protectedRoute:['useAuth','JSX','Icon','Navigate'],
 login:['useAuth','navigate','React','JSX','Layout','Card','CardHeader','CardTitle','CardDescription','CardContent','Icon','Button','Icon'],
 signaturePad:['React','JSX'],
 dashboard:['useAuth','React','getLeads','getStats','updateLead','toast','deleteLead','convert','JSX','AdminLayout','StatCard','Card','CardHeader','CardTitle','CardContent','Icon','Icon','Icon','Icon','Icon','Icon','Button','statusColumns','Menu','formatDate','Icon','People','Settings','Inbox'],
};
const Box=({children})=><div>{children}</div>;
const Icon=()=> <span aria-hidden="true"/>;
const Button=({children,onClick,disabled,type})=><button type={type||'button'} onClick={onClick} disabled={disabled}>{children}</button>;
const id='synthetic-contract',client='synthetic-client',token=btoa(`${id}:${client}:fixture`);
const fixture=()=>({contractNumber:'SYNTHETIC-ONLY',publicToken:token,status:'sent',tokenExpiry:{toDate:()=>new Date('2099-01-01')},projectInfo:{clientName:'Synthetic Person',clientBusiness:'Fixture Only'},services:[{label:'Synthetic service',price:123}],monthlyServices:[],finalOneTimeTotal:123,finalMonthlyTotal:0,paymentTerms:'Synthetic terms only',legalClauses:{'Results Disclaimer':'Fixture clause; no legal agreement or external effect.'}});
function environment(overrides={}) {
 const e={auth:{user:null,loading:false,isAllowed:false},contract:fixture(),exists:true,token,reads:[],writes:[],calls:[],navigation:[],signIns:0,signOuts:0,...overrides};
 const values={allowedEmails:['owner@fixture.invalid'],React,JSX,Icon,Box,Card:Box,CardContent:Box,CardHeader:Box,CardTitle:Box,CardDescription:Box,Badge:Box,Layout:Box,Button,
  useAuth:()=>({...e.auth,signIn:async()=>e.signIns++,signOut:async()=>e.signOuts++}),
  navigate:()=> (to,options)=>e.navigation.push({to,options}),
  Navigate:({to,replace})=><div data-testid="redirect">{to}:{String(replace)}</div>,
  params:()=>({contractId:id}),search:()=>[new URLSearchParams(e.token?{token:e.token}:{})],db:{synthetic:true},
  doc:(db,path,record)=>{if(!db.synthetic)throw Error('Real db prohibited');return {path:`${path}/${record}`}},
  getDoc:async ref=>{e.reads.push(ref);if(e.readError)throw Error('Synthetic read failure');return {exists:()=>e.exists,data:()=>e.contract}},
  updateDoc:async(ref,data)=>{e.writes.push({ref,data});if(e.writeError)throw Error('Synthetic write failure')},
  Timestamp:{now:()=>({seconds:123,nanoseconds:0})},getFunctions:()=>({synthetic:true}),
  callable:(functions,name)=>{if(!functions.synthetic)throw Error('Real functions prohibited');return async data=>{e.calls.push({name,data});if(e.callError)throw Error('Synthetic backend failure')}},
  currency:n=>`$${n}`,onAuthChange:cb=>{queueMicrotask(()=>cb(e.auth.user));return ()=>e.calls.push({unsubscribe:true})},
  signIn:async()=>{e.signIns++},signOut:async()=>{e.signOuts++},isEmailAllowed:email=>email==='owner@fixture.invalid',
  getLeads:async()=>[{id:'fixture-lead',name:'Synthetic Lead',email:'lead@fixture.invalid',status:'new',createdAt:new Date(),source:'Fixture'}],
  getStats:async()=>({new:1,contacted:0,qualified:0,'closed-won':0,'closed-lost':0}),
  updateLead:async()=>{throw Error('Unexpected fixture lead mutation')},deleteLead:async()=>{throw Error('Deletion prohibited')},convert:async()=>{throw Error('Conversion prohibited')},
  toast:{loading:()=>0,success:()=>{},error:()=>{}},formatDate:()=> 'Fixture date',
  AdminLayout:({children,onTabChange})=><div>{['dashboard','leads','people','settings','inbox'].map(tab=><button key={tab} onClick={()=>onTabChange(tab)}>{tab}</button>)}{children}</div>,
  StatCard:({label,value})=><div>{label}: {value}</div>,statusColumns:[{status:'new',label:'New',color:''}],
  Menu:Box,People:()=> <div>Fixture People boundary</div>,Settings:()=> <div>Fixture Settings boundary</div>,Inbox:()=> <div>Fixture Inbox boundary</div>,
 };
 e.values=values;return e;
}
function compile(bundle,key,e) {
 const entry=bundle.functions[key];expect(entry.dependencies.length).toBe(roles[key].length);
 return new Function(...entry.dependencies,`return (${entry.code});`)(...roles[key].map(role=>{if(role==='SignaturePad')return compile(bundle,'signaturePad',e);if(role==='isEmailAllowed')return compile(bundle,'emailAllowed',e);if(!(role in e.values))throw Error('Unknown fixture binding '+role);return e.values[role]}));
}
beforeAll(async()=>{
 baseline=JSON.parse(await readFile('website/private-baseline/functions.json','utf8'));
 const file=(await readdir('dist-private/assets')).find(x=>/^private-.*\.js$/.test(x));candidate=inspectBundle(await readFile(`dist-private/assets/${file}`,'utf8'));
 for(const key of Object.keys(roles))expect(candidate.functions[key].fingerprint,key).toBe(baseline.functions[key].fingerprint);
});
beforeEach(()=>{
 vi.stubGlobal('fetch',vi.fn(async url=>{if(url!=='https://api.ipify.org?format=json')throw Error('Network prohibited');return {json:async()=>({ip:'192.0.2.1'})}}));
 vi.spyOn(console,'error').mockImplementation(()=>{});vi.spyOn(console,'warn').mockImplementation(()=>{});
 vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({beginPath(){},moveTo(){},lineTo(){},stroke(){},clearRect(){}});
 vi.spyOn(HTMLCanvasElement.prototype,'toDataURL').mockReturnValue('data:image/png;base64,U1lOVEhFVElD');
});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()});
for(const variant of ['live','candidate'])describe(variant+' captured private functions',()=>{
 const getBundle=()=>variant==='live'?baseline:candidate;
 it('retains the actual case-insensitive allowlist helper with synthetic addresses',()=>{const e=environment(),allowed=compile(getBundle(),'emailAllowed',e);expect(allowed(undefined)).toBe(false);expect(allowed('OWNER@fixture.invalid')).toBe(true);expect(allowed('denied@fixture.invalid')).toBe(false)});
 it('does not render protected children while auth is loading, signed out or denied',()=>{
  for(const auth of [{user:null,loading:true,isAllowed:false},{user:null,loading:false,isAllowed:false},{user:{email:'denied@fixture.invalid'},loading:false,isAllowed:false}]){
   const e=environment({auth}),C=compile(getBundle(),'protectedRoute',e);render(<C><div>Private fixture content</div></C>);expect(screen.queryByText('Private fixture content')).toBeNull();
   if(!auth.loading&&!auth.user)expect(screen.getByTestId('redirect')).toHaveTextContent('/admin/login:true');
   if(auth.user){expect(screen.getByText('Access Denied')).toBeVisible();fireEvent.click(screen.getByRole('button',{name:'Sign Out'}));expect(e.signOuts).toBe(1)}cleanup();
  }
 });
 it('renders allowed children and login uses the synthetic auth boundary',async()=>{
  const e=environment(),Login=compile(getBundle(),'login',e);render(<Login/>);fireEvent.click(screen.getByRole('button',{name:'Sign in with Google'}));expect(e.signIns).toBe(1);cleanup();
  e.auth={user:{email:'owner@fixture.invalid'},loading:false,isAllowed:true};const Guard=compile(getBundle(),'protectedRoute',e);render(<Guard><div>Private fixture content</div></Guard>);expect(screen.getByText('Private fixture content')).toBeVisible();cleanup();render(<Login/>);await waitFor(()=>expect(e.navigation).toContainEqual({to:'/admin',options:{replace:true}}));
 });
 it('auth hook resolves through synthetic listener and cleans up',async()=>{
  const e=environment({auth:{user:{email:'owner@fixture.invalid'}}});const hook=compile(getBundle(),'authHook',e);
  function Probe(){const a=hook();return <div>{a.loading?'loading':a.isAllowed?'allowed':'denied'}<button onClick={a.signIn}>sign in</button><button onClick={a.signOut}>sign out</button></div>}
  const view=render(<Probe/>);await screen.findByText('allowed');fireEvent.click(screen.getByRole('button',{name:'sign in'}));fireEvent.click(screen.getByRole('button',{name:'sign out'}));expect(e.signIns).toBe(1);expect(e.signOuts).toBe(1);view.unmount();expect(e.calls).toContainEqual({unsubscribe:true});
 });
 for(const [name,changes,message] of [
  ['missing token',{token:''},'Invalid contract link. Please check the URL.'],
  ['wrong contract token',{token:btoa('other:synthetic-client:fixture')},'Invalid or expired link.'],
  ['malformed token',{token:'%%%bad'},'Failed to load contract. Please try again.'],
  ['missing document',{exists:false},'Contract not found.'],
  ['read failure',{readError:true},'Failed to load contract. Please try again.'],
  ['token mismatch',{contract:{...fixture(),publicToken:'different'}},'Invalid access token.'],
  ['expired token',{contract:{...fixture(),tokenExpiry:{toDate:()=>new Date('2000-01-01')}}},'This contract link has expired. Please contact MerkadAgency for a new link.'],
 ])it('rejects '+name+' without a write or backend call',async()=>{
  const e=environment(changes),C=compile(getBundle(),'signing',e);render(<C/>);await screen.findByText(message);expect(e.writes).toEqual([]);expect(e.calls).toEqual([]);expect(fetch).not.toHaveBeenCalled();
 });
 it('shows the signed fixture without re-signing or backend calls',async()=>{
  const e=environment({contract:{...fixture(),status:'signed'}}),C=compile(getBundle(),'signing',e);render(<C/>);await screen.findByText(/Contract Signed!/);expect(e.writes).toEqual([]);expect(e.calls).toEqual([]);
 });
 for(const mode of ['success','write failure','backend failure'])it('retains signing guards and '+mode+' behavior using local stubs only',async()=>{
  const e=environment({writeError:mode==='write failure',callError:mode==='backend failure'}),C=compile(getBundle(),'signing',e);const view=render(<C/>);await screen.findByText('Service Agreement');expect(screen.queryByRole('button',{name:'Sign Contract'})).toBeNull();
  fireEvent.scroll(view.container.querySelector('[style*="max-height"]'));const button=await screen.findByRole('button',{name:'Sign Contract'});expect(button).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox'));expect(button).toBeDisabled();const canvas=view.container.querySelector('canvas');
  fireEvent.mouseDown(canvas,{clientX:10,clientY:10});fireEvent.mouseMove(canvas,{clientX:20,clientY:20});fireEvent.mouseUp(canvas);
  await waitFor(()=>expect(button).toBeEnabled());fireEvent.click(screen.getByRole('button',{name:'Clear signature'}));expect(button).toBeDisabled();
  fireEvent.mouseDown(canvas,{clientX:10,clientY:10});fireEvent.mouseMove(canvas,{clientX:20,clientY:20});fireEvent.mouseUp(canvas);await waitFor(()=>expect(button).toBeEnabled());fireEvent.click(button);
  if(mode==='write failure')await screen.findByText('Failed to sign contract. Please try again.');else await screen.findByText(/Contract Signed!/);
  expect(e.reads).toEqual([{path:`clients/${client}/contracts/${id}`}]);expect(e.writes).toHaveLength(1);expect(e.writes[0].ref.path).toBe(`clients/${client}/contracts/${id}`);expect(e.writes[0].data.status).toBe('signed');expect(e.writes[0].data.signatureData.clientSignature).toBe('data:image/png;base64,U1lOVEhFVElD');
  expect(e.calls).toEqual(mode==='write failure'?[]:[{name:'onContractSigned',data:{clientId:client,contractId:id}}]);
 });
 it('loads a synthetic dashboard and retains non-destructive tab handoffs',async()=>{
  const e=environment({auth:{user:{email:'owner@fixture.invalid'},loading:false,isAllowed:true}}),C=compile(getBundle(),'dashboard',e);render(<C/>);await screen.findByText('Total Leads: 1');expect(screen.getByText('Synthetic Lead')).toBeVisible();
  for(const tab of ['people','settings','inbox']){fireEvent.click(screen.getByRole('button',{name:tab,exact:true}));await screen.findByText(`Fixture ${tab[0].toUpperCase()+tab.slice(1)} boundary`)}expect(e.writes).toEqual([]);
 });
});
