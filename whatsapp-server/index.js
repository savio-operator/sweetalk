const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        // Use the Chrome that puppeteer downloads during npm install
        executablePath: puppeteer.executablePath(),
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
    },
});

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

client.initialize();

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
