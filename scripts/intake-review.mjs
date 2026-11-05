// Local production-client review, always OFF. No upstream/API forwarding.
import{createServer}from'node:http';import{readFile}from'node:fs/promises';import{resolve}from'node:path';
const root=resolve('dist-intake-review');
createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost:8103');res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex,nofollow');res.setHeader('X-Content-Type-Options','nosniff');
 if(u.pathname==='/api/contact-intake/config'&&req.method==='GET'){res.setHeader('Content-Type','application/json');res.end('{"enabled":false}');return}
 if(u.pathname==='/api/contact-intake'){res.writeHead(req.method==='POST'?503:405,{'Content-Type':'application/json'});res.end('{"code":"not_configured"}');return}
 if(req.method!=='GET'||/^\/(?:assets\/|private-app|private-boundary|admin|sign(?:\/|$))/.test(u.pathname)){res.writeHead(404);res.end('Outside this review');return}
 const path=u.pathname==='/'?'/index.html':u.pathname,file=resolve(root,'.'+path);if(!file.startsWith(root+'/'))throw Error('path');let data;try{data=await readFile(file)}catch{data=await readFile(file+'.html')};res.setHeader('Content-Type',path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':path.endsWith('.png')?'image/png':path.endsWith('.webp')?'image/webp':path.endsWith('.json')?'application/json':'text/html; charset=utf-8');res.end(data);
 }catch{res.writeHead(404);res.end('Unavailable')}}).listen(8103,'127.0.0.1',()=>console.log('Production-client review http://localhost:8103/contact — backend always OFF, no forwarding.'));
