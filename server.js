// A tiny Wisp server. Deploy it (e.g. on Render) and paste  wss://<your-app>.onrender.com/wisp/  into Settings > Advanced > Wisp Config.
import http from 'node:http';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';

// Render has no outbound IPv6, so prefer IPv4 addresses or sites fail with "could not connect".
wisp.options.dns_result_order = 'ipv4first';
wisp.options.dns_ttl = 300;

const port = process.env.PORT || 5001;
const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('Wisp server is running.\n');
});

httpServer.on('upgrade', (req, socket, head) => {
  if (req.url && req.url.startsWith('/wisp')) wisp.routeRequest(req, socket, head);
  else socket.destroy();
});

httpServer.listen(port, '0.0.0.0', () => console.log('Wisp server listening on port ' + port));
