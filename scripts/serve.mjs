import http from 'node:http';import {readFile,stat} from 'node:fs/promises';import path from 'node:path';
const root=path.resolve('dist');
const argValue = (flag, fallback) => { const i = process.argv.indexOf(flag); return i >= 0 ? process.argv[i + 1] : fallback; };
const port=Number(argValue('--port', process.env.PORT || 4321));
const host=argValue('--host', '127.0.0.1');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff':'font/woff'};
http.createServer(async(req,res)=>{try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403);res.end();return}if((await stat(file)).isDirectory())file=path.join(file,'index.html');const data=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('404')}}).listen(port,host,()=>console.log(`Luz Celestia: http://localhost:${port}/ · Ctrl+C para cerrar`));
