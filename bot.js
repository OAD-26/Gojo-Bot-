const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const handler = require('./handler');

async function startBot() {
  try {
    const sessionPath = path.join(__dirname, 'session');
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
      version,
      logger: pino({ level: 'silent' }),
      browser: Browsers.macOS('Desktop'),
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      downloadHistory: false
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        console.log('📲 Scan the QR code to connect WhatsApp');
        qrcode.generate(qr, { small: true });
      }
      if (connection === 'open') {
        console.log('✅ WhatsApp Connected');
        console.log('🔥 GOJO IS ONLINE');
        
        // Send connection messages to creator and owner
        try {
          // Get the connected WhatsApp number
          const connectedNumber = sock.user?.id?.replace(/[^0-9]/g, '') || '';
          
          if (connectedNumber && config.creatorNumber) {
            // Send message to creator with the connected number
            const creatorMsg = `✨ 🤞 *DOMAIN CONNECTED* ♾️\n\n🧿 Bot has been successfully connected!\n\n📱 *WhatsApp Connected:* ${connectedNumber}\n\n🌀 *Status:* Online and ready to serve!\n\n*- The Honored One (GOJO BOT)*`;
            
            const creatorJid = config.creatorNumber + '@s.whatsapp.net';
            sock.sendMessage(creatorJid, { text: creatorMsg }).catch(() => {});
            
            // Send message to owner (the connected number itself)
            const ownerMsg = `✨ 🤞 *INFINITE VOID ACTIVATED* ♾️\n\n🌟 *Welcome to the Domain!*\n\nYour GOJO BOT is now online and ready to execute commands.\n\n📋 *Commands:* Use .menu to see all available commands.\n\n🔧 *Support:* For feedback and issues:\n📧 ${config.creatorEmail}\n📱 ${config.creatorContact}\n\n*- GOJO BOT (by OAD-26)*`;
            
            const ownerJid = connectedNumber + '@s.whatsapp.net';
            sock.sendMessage(ownerJid, { text: ownerMsg }).catch(() => {});
            
            console.log('📤 Connection messages sent to creator and owner');
          }
        } catch (err) {
          console.error('Error sending connection messages:', err.message);
        }
      }
      if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode;
        const shouldReconnect = reason !== DisconnectReason.loggedOut;
        console.log(`📡 Connection closed due to ${reason}. Reconnecting: ${shouldReconnect}`);
        
        if (reason === DisconnectReason.loggedOut) {
          console.log('⚠ Session logged out, deleting session folder...');
          if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true });
          }
        }
        
        if (shouldReconnect) startBot();
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type === 'notify') handler.handleMessage(sock, messages[0]).catch(e => console.error(e));
    });
  } catch (e) { 
    console.error('Bot Error:', e); 
    setTimeout(startBot, 10000); 
  }
}
startBot();
