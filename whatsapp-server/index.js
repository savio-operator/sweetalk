const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();

app.use(express.json());

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
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.on('auth_failure', (msg) => {
    console.error('Auth failure:', msg);
});

client.initialize();

app.get('/', (req, res) => res.status(200).send('ok'));

app.post('/send', async (req, res) => {
    const { to, message } = req.body;
    const authHeader = req.headers.authorization;

    if (authHeader !== `Bearer ${process.env.WA_SERVER_SECRET}`) {
        return res.status(401).send('Unauthorized');
    }

    try {
        await client.sendMessage(`${to}@c.us`, message);
        res.status(200).send('Message sent');
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(process.env.PORT || 3000);
