import { parse } from 'acorn';
import { analyze } from 'eslint-scope';
import { createHash } from 'node:crypto';

export const markers = {
  signing: 'Unable to Load Contract', authHook: 'Sign in failed:',
  protectedRoute: 'Access Denied', login: 'Admin Login',
  signaturePad: 'Clear signature', dashboard: 'Total Leads',
};
export function inspectBundle(source) {
  const ast = parse(source, {ecmaVersion:'latest',sourceType:'module',ranges:true});
  const manager = analyze(ast,{ecmaVersion:2022,sourceType:'module'});
  const bindings = new Map();
  for (const scope of manager.scopes) for (const variable of scope.variables) {
    for (const id of variable.identifiers) bindings.set(id,variable);
    for (const ref of variable.references) bindings.set(ref.identifier,variable);
  }
  const declarations = new Map();
  for (const statement of ast.body) {
    if (statement.type==='FunctionDeclaration') declarations.set(statement.id.name,statement);
    if (statement.type==='VariableDeclaration') for(const d of statement.declarations) if(d.id.type==='Identifier') declarations.set(d.id.name,d);
  }
  function fingerprint(root) {
    const names = new Map();
    function normalize(node,parent,key) {
      if(node===null || typeof node!=='object') return node;
      if(Array.isArray(node))return node.map(x=>normalize(x,parent,key));
      const result={};
      for(const k of Object.keys(node)) {
        if(['start','end','range','raw'].includes(k))continue;
        if(node.type==='Identifier' && k==='name') {
          const property=(parent?.type==='MemberExpression'&&key==='property'&&!parent.computed)||(parent?.type==='Property'&&key==='key'&&!parent.computed);
          const variable=bindings.get(node);
          if(property || !variable)result[k]=node[k];
          else {if(!names.has(variable))names.set(variable,`binding${names.size}`);result[k]=names.get(variable);}
        } else result[k]=normalize(node[k],node,k);
      }
      return result;
    }
    return createHash('sha256').update(JSON.stringify(normalize(root))).digest('hex');
  }
  const functions={};
  function capture(key,node) {
    const scope=manager.acquire(node);
    const dependencies=[...new Set(scope.through.filter(r=>r.resolved).map(r=>r.identifier.name))];
    functions[key]={code:source.slice(node.start,node.end),fingerprint:fingerprint(node),dependencies,
      dependencyFingerprints:dependencies.map(name=>({name,hash:declarations.has(name)?fingerprint(declarations.get(name)):null}))};
  }
  for(const [key,marker] of Object.entries(markers)) {
    const matches=ast.body.filter(n=>n.type==='FunctionDeclaration'&&source.slice(n.start,n.end).includes(marker));
    if(matches.length!==1)throw new Error(`Expected exactly one ${key} function, found ${matches.length}`);
    capture(key,matches[0]);
  }
  capture('emailAllowed',declarations.get(functions.authHook.dependencies[4]));
  const configKeys=['apiKey','authDomain','projectId','storageBucket','messagingSenderId','appId','measurementId'];
  const configs=[...declarations.values()].filter(n=>n.type==='VariableDeclarator'&&n.init?.type==='ObjectExpression'&&configKeys.every(k=>n.init.properties.some(p=>p.key?.name===k && p.value.type==='Literal')));
  if(configs.length!==1)throw new Error('Expected exactly one literal Firebase public configuration');
  const configObject=Object.fromEntries(configKeys.map(k=>[k,configs[0].init.properties.find(p=>p.key.name===k).value.value]));
  const firebaseConfigurationHash=createHash('sha256').update(JSON.stringify(configObject)).digest('hex');
  const cache=new Map();
  function getBinding(name) {
    if(cache.has(name))return cache.get(name);
    const node=declarations.get(name);if(!node)return null;
    const deps=[];
    function visit(n) {
      if(!n || typeof n!=='object')return;
      if(n.type==='Identifier') {
        const variable=bindings.get(n);
        if(variable?.scope.type==='module' && variable.name!==name && declarations.has(variable.name) && !deps.includes(variable.name)) deps.push(variable.name);
      }
      for(const [key,value] of Object.entries(n))if(!['start','end','range'].includes(key)&&value&&typeof value==='object')Array.isArray(value)?value.forEach(visit):visit(value);
    }
    visit(node);
    const result={hash:fingerprint(node),dependencies:deps,code:source.slice(node.start,node.end)};cache.set(name,result);return result;
  }
  return {sha256:createHash('sha256').update(source).digest('hex'),firebaseConfigurationHash,functions,getBinding};
}
