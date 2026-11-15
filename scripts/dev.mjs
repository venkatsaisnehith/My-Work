import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { build } from './build.mjs';
const root = resolve('dist');
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css', '.js':'text/javascript', '.xml':'application/xml', '.json':'application/json', '.svg':'image/svg+xml' };
await build();
createServer(async (req,res) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if (path !== root && !path.startsWith(root+sep)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = resolve(path,'index.html');
    res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' });
    res.end(await readFile(path));
  } catch { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Page not found'); }
}).listen(4321, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4321'));
