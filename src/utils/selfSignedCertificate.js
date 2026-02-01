import fs from 'fs';
import path from 'path';
import https from 'https';
import selfsigned from 'selfsigned';
import express from 'express'; // assuming you use express

const app = express();
const certDir = path.resolve('certs');

// Ensure certs folder exists
if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

// Generate self-signed certificate
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfsigned.generate(attrs, { days: 365 });

// Write cert and key to files
fs.writeFileSync(path.join(certDir, 'cert.pem'), pems.cert);
fs.writeFileSync(path.join(certDir, 'key.pem'), pems.private);

console.log('✅ Self-signed certificate generated in certs/ folder');

// Example route
app.get('/', (req, res) => res.send('HTTPS server is running!'));

// Start HTTPS server
https.createServer(
  {
    key: fs.readFileSync(path.join(certDir, 'key.pem')),
    cert: fs.readFileSync(path.join(certDir, 'cert.pem')),
  },
  app
).listen(443, () => {
  console.log('✅ HTTPS server running at https://localhost');
});
