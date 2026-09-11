const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const database = require('../database');
const config = require('../config');

const MAX_CACHED_MESSAGES = 500;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const messageCache = new Map();
const handledViewOnce = new Set();
const handledDeletes = new Set();

function getMessageCacheKey(key) {
  return key?.remoteJid && key?.id ? `${key.remoteJid}:${key.id}` : null;
}

function normalizeNumber(jid = '') {
  return String(jid).split('@')[0].split(':')[0].replace(/\D/g, '');
}

function getProtectionSettings(remoteJid) {
  if (remoteJid?.endsWith('@g.us')) return database.getGroupSettings(remoteJid);
  return config.defaultGroupSettings;
}

function pruneCache() {
  const cutoff = Date.now() - CACHE_TTL_MS;
  for (const [key, entry] of messageCache) {
    if (entry.cachedAt < cutoff) messageCache.delete(key);
  }

  while (messageCache.size > MAX_CACHED_MESSAGES) {
    messageCache.delete(messageCache.keys().next().value);
  }
}

function cacheMessage(message) {
  if (!message?.message || message.message.protocolMessage) return;
  const cacheKey = getMessageCacheKey(message.key);
  if (!cacheKey) return;

  messageCache.set(cacheKey, { message, cachedAt: Date.now() });
  if (messageCache.size % 25 === 0) pruneCache();
}

function getCachedMessage(key) {
  const cacheKey = getMessageCacheKey(key);
  const entry = cacheKey ? messageCache.get(cacheKey) : null;
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    messageCache.delete(cacheKey);
    return null;
  }
  return entry.message;
}

function findMessageContainer(message) {
  const body = message?.message || message || {};
  return [
    body,
    body.ephemeralMessage?.message,
    body.viewOnceMessage?.message,
    body.viewOnceMessageV2?.message,
    body.viewOnceMessageV2Extension?.message,
    body.ephemeralMessage?.message?.viewOnceMessage?.message,
    body.ephemeralMessage?.message?.viewOnceMessageV2?.message,
    body.ephemeralMessage?.message?.viewOnceMessageV2Extension?.message
  ].filter(Boolean);
}

function extractMedia(message, viewOnceOnly = false) {
  let foundViewOnce = false;
  let current = message?.message || message;

  for (let depth = 0; current && typeof current === 'object' && depth < 8; depth++) {
    const mediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage']
      .find(type => current[type]);

    if (mediaType) {
      const media = current[mediaType];
      const isViewOnce = foundViewOnce || media.viewOnce === true;
      if (!viewOnceOnly || isViewOnce) {
        return {
          media,
          mediaType: mediaType.replace('Message', ''),
          isViewOnce
        };
      }
      return null;
    }

    const wrapperType = [
      'viewOnceMessageV2',
      'viewOnceMessageV2Extension',
      'viewOnceMessage',
      'ephemeralMessage'
    ].find(type => current[type]?.message);

    if (!wrapperType) return null;
    if (wrapperType.startsWith('viewOnce')) foundViewOnce = true;
    current = current[wrapperType].message;
  }

  return null;
}

function getQuotedContext(message) {
  const body = message?.message || {};
  const candidates = [
    body.extendedTextMessage,
    body.imageMessage,
    body.videoMessage,
    body.audioMessage,
    body.documentMessage,
    body.buttonsResponseMessage,
    body.listResponseMessage,
    body.templateButtonReplyMessage
  ];
  return candidates.find(candidate => candidate?.contextInfo?.quotedMessage)?.contextInfo || null;
}

async function downloadMedia(media, mediaType) {
  const stream = await downloadContentFromMessage(media, mediaType);
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  if (!buffer.length) throw new Error('media was empty');
  return buffer;
}

function getMediaCaption(media) {
  return media?.caption?.trim() || '';
}

async function sendMedia(sock, remoteJid, extracted, buffer, options = {}) {
  const { media, mediaType } = extracted;
  const caption = options.caption ?? getMediaCaption(media);
  const payload = {
    ...(mediaType === 'image' ? { image: buffer } : {}),
    ...(mediaType === 'video' ? { video: buffer } : {}),
    ...(mediaType === 'audio' ? { audio: buffer } : {}),
    ...(mediaType === 'document' ? { document: buffer, fileName: media.fileName || 'document' } : {}),
    ...(mediaType === 'sticker' ? { sticker: buffer } : {}),
    ...(mediaType !== 'audio' && mediaType !== 'sticker' && caption ? { caption } : {}),
    ...(mediaType === 'audio' ? {
      ptt: media.ptt === true,
      mimetype: media.mimetype || 'audio/ogg; codecs=opus'
    } : {}),
    ...(media.mimetype && mediaType !== 'audio' ? { mimetype: media.mimetype } : {}),
    ...(options.viewOnce ? { viewOnce: true } : {})
  };

  return sock.sendMessage(remoteJid, payload, options.sendOptions);
}

async function handleAntiViewOnce(sock, message) {
  const remoteJid = message?.key?.remoteJid;
  if (!remoteJid?.endsWith('@g.us') || message.key.fromMe) return;

  const settings = getProtectionSettings(remoteJid);
  if (settings.antiviewonce !== true) return;

  const messageId = getMessageCacheKey(message.key);
  if (!messageId || handledViewOnce.has(messageId)) return;

  const extracted = extractMedia(message, true);
  if (!extracted) return;
  handledViewOnce.add(messageId);

  try {
    const buffer = await downloadMedia(extracted.media, extracted.mediaType);
    const sender = message.key.participant || 'unknown';
    const senderLabel = sender.split('@')[0].split(':')[0];
    const typeLabel = extracted.mediaType === 'audio' && extracted.media.ptt
      ? 'voice note'
      : extracted.mediaType;

    await sock.sendMessage(remoteJid, {
      text: `🛡️ *ANTI-VIEW-ONCE*\n\nRecovered ${typeLabel} from @${senderLabel}.`,
      mentions: sender !== 'unknown' ? [sender] : []
    });
    await sendMedia(sock, remoteJid, extracted, buffer);
    console.log(`🛡️ Anti-view-once recovered ${typeLabel} in ${remoteJid}`);
  } catch (error) {
    console.error('Anti-view-once recovery failed:', error.message);
  }
}

function getMessageText(message) {
  const body = message?.message || {};
  return body.conversation ||
    body.extendedTextMessage?.text ||
    body.imageMessage?.caption ||
    body.videoMessage?.caption ||
    body.documentMessage?.caption ||
    null;
}

async function restoreDeletedMessage(sock, original, remoteJid) {
  const extracted = extractMedia(original);
  if (extracted) {
    const buffer = await downloadMedia(extracted.media, extracted.mediaType);
    const typeLabel = extracted.mediaType === 'audio' && extracted.media.ptt
      ? 'voice note'
      : extracted.mediaType;
    await sock.sendMessage(remoteJid, { text: `🛡️ *ANTI-DELETE*\n\nRecovered deleted ${typeLabel}.` });
    return sendMedia(sock, remoteJid, extracted, buffer);
  }

  const text = getMessageText(original);
  if (text) {
    return sock.sendMessage(remoteJid, {
      text: `🛡️ *ANTI-DELETE*\n\nRecovered deleted message:\n\n${text}`
    });
  }

  return sock.sendMessage(remoteJid, {
    text: '🛡️ *ANTI-DELETE*\n\nA deleted message was detected, but its content type cannot be restored.'
  });
}

async function handleMessageUpdate(sock, event) {
  const protocolMessage = event?.update?.message?.protocolMessage ||
    event?.update?.message?.protocolMessageV2 ||
    event?.message?.protocolMessage;
  const protocolType = protocolMessage?.type;
  const isRevoke = protocolType === 0 || String(protocolType).toUpperCase() === 'REVOKE';
  if (!isRevoke) return;

  const deletedKey = protocolMessage.key || event.key;
  const remoteJid = deletedKey?.remoteJid || event.key?.remoteJid;
  if (!remoteJid) return;

  const settings = getProtectionSettings(remoteJid);
  if (settings.antidelete !== true) return;

  const updateId = getMessageCacheKey(deletedKey);
  if (!updateId || handledDeletes.has(updateId)) return;
  handledDeletes.add(updateId);

  const original = getCachedMessage(deletedKey);
  if (!original) {
    await sock.sendMessage(remoteJid, {
      text: '🛡️ *ANTI-DELETE*\n\nA deleted message was detected, but it was not available in the bot cache.'
    }).catch(error => console.error('Anti-delete notice failed:', error.message));
    return;
  }

  try {
    await restoreDeletedMessage(sock, original, remoteJid);
    console.log(`🛡️ Anti-delete restored ${updateId}`);
  } catch (error) {
    console.error('Anti-delete recovery failed:', error.message);
    await sock.sendMessage(remoteJid, {
      text: '🛡️ *ANTI-DELETE*\n\nThe deleted message was detected, but its media could not be recovered.'
    }).catch(() => {});
  }
}

module.exports = {
  cacheMessage,
  extractMedia,
  getQuotedContext,
  downloadMedia,
  sendMedia,
  handleAntiViewOnce,
  handleMessageUpdate,
  normalizeNumber,
  findMessageContainer
};