const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const handler = require('./handler');
const {
  cacheMessage,
  handleAntiViewOnce,
  handleMessageUpdate
} = require('./utils/messageProtection');

const sessionPath = path.join(__dirname, 'session');
const reconnectDelayMs = 5000;
let reconnectTimer = null;
let reconnectInProgress = false;
let connectionGeneration = 0;

function getDisconnectStatus(error) {
  return error?.output?.statusCode || error?.statusCode || error?.data?.statusCode;
}

function getErrorText(error) {
  return [error?.message, error?.output?.payload?.message, error?.data?.message]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isCorruptSession(error, status) {
  const errorText = getErrorText(error);
  return status === DisconnectReason.badSession ||
    errorText.includes('bad mac') ||
    errorText.includes('bad session') ||
    errorText.includes('session error');
}

function clearSession(reason) {
  try {
    if (fs.existsSync(sessionPath)) {
      fs.rmSync(sessionPath, { recursive: true, force: true });
      console.log(`🧹 WhatsApp session cleared (${reason}). A new QR scan is required.`);
    }
    fs.mkdirSync(sessionPath, { recursive: true });
  } catch (error) {
    console.error('❌ Could not clear WhatsApp session:', error.message);
  }
}

function scheduleReconnect(reason) {
  if (reconnectTimer || reconnectInProgress) return;

  console.log(`🔁 Reconnecting WhatsApp in ${reconnectDelayMs / 1000}s (${reason})...`);
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    startBot().catch(error => {
      console.error('Reconnect failed:', error.message);
      scheduleReconnect('retry after startup failure');
    });
  }, reconnectDelayMs);
}

async function startBot() {
  if (reconnectInProgress) return;
  reconnectInProgress = true;
  const currentGeneration = ++connectionGeneration;

  try {
    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      version,
      logger: pino({ level: process.env.BAILEYS_LOG_LEVEL || 'silent' }),
      browser: Browsers.macOS('Desktop'),
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      downloadHistory: false,
      markOnlineOnConnect: false,
      connectTimeoutMs: 60000,
      defaultQueryTimeoutMs: 60000,
      keepAliveIntervalMs: 25000
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (update) => {
      if (currentGeneration !== connectionGeneration) return;

      const { connection, lastDisconnect, qr } = update;
      if (qr) {
        console.log('📲 Scan the QR code to connect WhatsApp');
        qrcode.generate(qr, { small: true });
      }
      if (connection === 'open') {
        reconnectInProgress = false;
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
        reconnectInProgress = false;
        const disconnectError = lastDisconnect?.error;
        const reason = getDisconnectStatus(disconnectError);
        const errorText = getErrorText(disconnectError);
        const shouldClearSession = reason === DisconnectReason.loggedOut ||
          isCorruptSession(disconnectError, reason);
        const shouldReconnect = reason !== DisconnectReason.loggedOut;

        console.log(`📡 Connection closed due to ${reason || errorText || 'unknown reason'}. Reconnecting: ${shouldReconnect}`);

        if (shouldClearSession) {
          clearSession(reason === DisconnectReason.loggedOut ? 'logged out' : 'corrupted Signal session');
        }

        if (shouldReconnect) scheduleReconnect(errorText || String(reason || 'connection closed'));
      }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (currentGeneration !== connectionGeneration || type !== 'notify') return;

      for (const message of messages) {
        try {
          cacheMessage(message);
          await handleAntiViewOnce(sock, message);
          await handler.handleMessage(sock, message);
        } catch (error) {
          console.error('Message handling error:', error.message);
        }
      }
    });

    sock.ev.on('messages.update', async updates => {
      if (currentGeneration !== connectionGeneration) return;
      for (const update of updates) {
        try {
          await handleMessageUpdate(sock, update);
        } catch (error) {
          console.error('Message update handling error:', error.message);
        }
      }
    });
    reconnectInProgress = false;
  } catch (error) {
    reconnectInProgress = false;
    console.error('Bot startup error:', error);
    scheduleReconnect('startup error');
  }
}

startBot().catch(error => {
  console.error('Fatal bot startup error:', error);
  scheduleReconnect('fatal startup error');
});
