// A tiny Wisp server. Deploy it (e.g. on Render) and paste  wss://<your-app>.onrender.com/wisp/  into Settings > Advanced > Wisp Config.
import http from 'node:http';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';

// Render has no outbound IPv6, so prefer IPv4 addresses or sites fail with "could not connect".
wisp.options.dns_result_order = 'ipv4first';
wisp.options.dns_ttl = 300;

// Keep the last 200 log lines so you can read them at /logs (no need to open the Render dashboard).
const LOG = [];
for (const k of ['log', 'info', 'warn', 'error']) {
  const orig = console[k].bind(console);
  console[k] = (...a) => { try { LOG.push(a.map(x => typeof x === 'string' ? x : String(x && x.stack || x)).join(' ')); if (LOG.length > 200) LOG.shift(); } catch {} orig(...a); };
}
process.on('uncaughtException', e => console.error('uncaught: ' + (e && e.stack || e)));
process.on('unhandledRejection', e => console.error('unhandled: ' + (e && e.stack || e)));

const port = process.env.PORT || 5001;
const httpServer = http.createServer((req, res) => {
  if (req.url === '/logs') { res.writeHead(200, { 'content-type': 'text/plain' }); res.end(LOG.join('\n') || '(no log lines yet)'); return; }
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('Wisp server is running.\n');
});

httpServer.on('upgrade', (req, socket, head) => {
  if (req.url && req.url.startsWith('/wisp')) wisp.routeRequest(req, socket, head);
  else socket.destroy();
});

httpServer.listen(port, '0.0.0.0', () => console.log('Wisp server listening on port ' + port));
