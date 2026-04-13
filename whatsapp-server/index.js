const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const app = express();

app.use(express.json());

let latestQR = null;
let isReady = false;

// PUPPETEER_EXECUTABLE_PATH is set to /usr/bin/chromium in the Dockerfile
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote',
        ],
    },
});

client.on('qr', (qr) => {
    latestQR = qr;
    isReady = false;
    console.log('QR RECEIVED — open /qr to scan');
});

client.on('ready', () => {
    latestQR = null;
    isReady = true;
    console.log('WhatsApp Client is ready!');
});

client.on('auth_failure', (msg) => {
    isReady = false;
    console.error('Auth failure:', msg);
});

client.on('disconnected', () => {
    isReady = false;
    console.log('Client disconnected');
});

client.initialize();

// Health check
app.get('/', (req, res) => res.status(200).send('ok'));

// QR scan page — open in browser to scan with WhatsApp
app.get('/qr', async (req, res) => {
    if (isReady) {
        return res.send(`
            <html><body style="font-family:sans-serif;text-align:center;padding:60px;background:#0d0d0d;color:#f8f2f2">
                <h2 style="color:#2ba8b2">✓ WhatsApp is connected</h2>
                <p>No QR needed — the client is already authenticated.</p>
            </body></html>
        `);
    }
    if (!latestQR) {
        return res.send(`
            <html><head><meta http-equiv="refresh" content="3"></head>
            <body style="font-family:sans-serif;text-align:center;padding:60px;background:#0d0d0d;color:#f8f2f2">
                <h2 style="color:#ba1c0a">Waiting for QR code...</h2>
                <p>The WhatsApp client is still initialising. This page auto-refreshes every 3 seconds.</p>
            </body></html>
        `);
    }
    try {
        const qrDataUrl = await qrcode.toDataURL(latestQR, { width: 320, margin: 2 });
        res.send(`
            <html><head><meta http-equiv="refresh" content="30"></head>
            <body style="font-family:sans-serif;text-align:center;padding:60px;background:#0d0d0d;color:#f8f2f2">
                <h2 style="color:#ba1c0a;font-size:1.4rem;margin-bottom:6px">Scan with WhatsApp</h2>
                <p style="color:#74c0c6;font-size:0.85rem;margin-bottom:24px">
                    Open WhatsApp → Linked Devices → Link a Device → point camera at this QR
                </p>
                <img src="${qrDataUrl}" style="border-radius:12px;border:3px solid #ba1c0a" />
                <p style="color:#f8f2f2;opacity:0.3;font-size:0.75rem;margin-top:20px">
                    QR expires in ~60s — page auto-refreshes every 30s
                </p>
            </body></html>
        `);
    } catch (err) {
        res.status(500).send('Failed to generate QR image: ' + err.message);
    }
});

app.post('/send', async (req, res) => {
    const { to, message } = req.body;
    const authHeader = req.headers.authorization;

    if (authHeader !== `Bearer ${process.env.WA_SERVER_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    if (!isReady) {
        return res.status(503).send('WhatsApp client not ready. Scan QR at /qr first.');
    }

    try {
        await client.sendMessage(`${to}@c.us`, message);
        res.status(200).send('Message sent');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(process.env.PORT || 3000);
