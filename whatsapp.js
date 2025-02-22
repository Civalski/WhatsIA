// src/whatsapp.js
import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { generateResponse } from './ai.js';

const client = new Client({
  puppeteer: { headless: true }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('QR Code gerado. Escaneie com seu WhatsApp!');
});

client.on('ready', () => {
  console.log('Cliente do WhatsApp está pronto!');
});

client.on('message', async (message) => {
  console.log(`Mensagem de ${message.from}: ${message.body}`);
  const resposta = await generateResponse(message.body);
  client.sendMessage(message.from, resposta);
});

client.initialize();

export default client;
