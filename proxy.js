const http = require('http');
const https = require('https');
const net = require('net');
const url = require('url');

const PORT = 8888;

// Create a proxy server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);

  const targetUrl = url.parse(req.url);
  
  // Only log TeachAssist traffic
  if (targetUrl.hostname === 'ta.yrdsb.ca') {
    console.log('\n=== TeachAssist Request ===');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    
    req.on('end', () => {
      if (body) {
        console.log('Body:', body);
      }
    });
  }

  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.path,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = https.request(options, proxyRes => {
    if (targetUrl.hostname === 'ta.yrdsb.ca') {
      console.log('\n=== TeachAssist Response ===');
      console.log('Status:', proxyRes.statusCode);
      console.log('Headers:', JSON.stringify(proxyRes.headers, null, 2));
    }
    
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
});

// Handle HTTPS connections
server.on('connect', (req, clientSocket, head) => {
  const { port, hostname } = url.parse(`//${req.url}`, false, true);
  
  const serverSocket = net.connect(port || 443, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
}); 