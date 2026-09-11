const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const config = require('../../config');

const VIEW_ONCE_WRAPPERS = [
  'viewOnceMessageV2',
  'viewOnceMessageV2Extension',
  'viewOnceMessage',
  'ephemeralMessage'
];

function unwrapViewOnceMessage(message) {
  let current = message;
  let foundViewOnce = false;

  while (current && typeof current === 'object') {
    const mediaType = ['imageMessage', 'videoMessage', 'audioMessage']
      .find(type => current[type]);

    if (mediaType) {
      const media = current[mediaType];
      if (foundViewOnce || media.viewOnce === true) {
        return {
          media,
          mediaType: mediaType.replace('Message', ''),
          label: mediaType.replace('Message', '')
        };
      }
      return null;
    }

    const wrapperType = VIEW_ONCE_WRAPPERS.find(type => current[type]?.message);
    if (!wrapperType) return null;

    if (wrapperType.startsWith('viewOnce')) foundViewOnce = true;
    current = current[wrapperType].message;
  }

  return null;
}

function getReplyContextInfo(message) {
  const messageBody = message?.message || {};
  const possibleMessages = [
    messageBody.extendedTextMessage,
    messageBody.imageMessage,
    messageBody.videoMessage,
    messageBody.audioMessage,
    messageBody.buttonsResponseMessage,
    messageBody.listResponseMessage,
    messageBody.templateButtonReplyMessage
  ];

  return possibleMessages.find(candidate => candidate?.contextInfo?.quotedMessage)?.contextInfo || {};
}

function getBotPrivateJid(sock) {
  const connectedId = sock.user?.id || sock.user?.jid || '';
  const phoneNumber = connectedId.split('@')[0].split(':')[0].replace(/\D/g, '');
  return phoneNumber ? `${phoneNumber}@s.whatsapp.net` : null;
}

function formatTimestamp() {
  try {
    return new Intl.DateTimeFormat('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: config.timezone || 'Africa/Lagos'
    }).format(new Date());
  } catch {
    return new Date().toISOString();
  }
}

async function getSourceChatName(sock, from, isGroup) {
  if (!isGroup) return 'Private chat';

  try {
    const metadata = await sock.groupMetadata(from);
    return metadata.subject || 'WhatsApp group';
  } catch {
    return 'WhatsApp group';
  }
}

module.exports = {
  name: 'vv',
  aliases: ['viewonce', 'retrieve', 'retrive'],
  category: 'general',
  description: 'Send replied view-once images, videos, or voice notes to the bot private chat with source details',
  usage: '.vv (reply to a view-once image, video, or voice note)',
  permission: 'Everyone',
  location: 'Group & Private Chat',
  cooldown: 5,

  async execute(sock, msg, args, { from, sender, isGroup, reply, quoted }) {
    try {
      if (!quoted) {
        return reply('⚠️ Please reply to a view-once image, video, or voice note.');
      }

      const extracted = unwrapViewOnceMessage(quoted);
      if (!extracted) {
        return reply('⚠️ The replied message is not a supported view-once image, video, or voice note.');
      }

      const { media, mediaType } = extracted;
      const privateJid = getBotPrivateJid(sock);
      if (!privateJid) {
        return reply('❌ I could not identify my private WhatsApp chat. Please reconnect the bot and try again.');
      }

      const replyContext = getReplyContextInfo(msg);
      const sourceSender = replyContext.participant || sender || 'Unknown sender';
      const sourceChatName = await getSourceChatName(sock, from, isGroup);
      const sourceType = mediaType === 'audio' && media.ptt !== false
        ? 'Voice note'
        : mediaType.charAt(0).toUpperCase() + mediaType.slice(1);
      const originalCaption = media.caption?.trim();

      const details = [
        '🛡️ *VIEW-ONCE MEDIA SHARED*',
        '',
        `📦 *Type:* ${sourceType}`,
        `💬 *Source chat:* ${sourceChatName}`,
        `🆔 *Chat ID:* ${from}`,
        `👤 *Sent by:* ${sourceSender}`,
        `🕒 *Retrieved:* ${formatTimestamp()}`,
        originalCaption ? `📝 *Original caption:* ${originalCaption}` : null
      ].filter(Boolean).join('\n');

      console.log(`⬇️ VV Command: Downloading ${sourceType} from ${from}`);
      const stream = await downloadContentFromMessage(media, mediaType);
      const chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      if (!buffer.length) {
        return reply('❌ The view-once media was empty or could not be downloaded.');
      }

      console.log(`📤 VV Command: Sending ${sourceType} and source details to ${privateJid}`);
      await sock.sendMessage(privateJid, { text: details });

      if (mediaType === 'audio') {
        await sock.sendMessage(privateJid, {
          audio: buffer,
          mimetype: media.mimetype || 'audio/ogg; codecs=opus',
          ptt: media.ptt !== false
        });
      } else if (mediaType === 'video') {
        await sock.sendMessage(privateJid, {
          video: buffer,
          mimetype: media.mimetype || 'video/mp4',
          caption: originalCaption || `📦 ${sourceType} from ${sourceChatName}`
        });
      } else {
        await sock.sendMessage(privateJid, {
          image: buffer,
          mimetype: media.mimetype || 'image/jpeg',
          caption: originalCaption || `📦 ${sourceType} from ${sourceChatName}`
        });
      }

      await sock.sendMessage(privateJid, {
        text: `✅ *Successfully shared.*\n\nThe ${sourceType.toLowerCase()} from *${sourceChatName}* was delivered to this private chat.`
      });

      await reply(`✅ ${sourceType} retrieved and successfully shared to my private chat with the source-chat details.`);
    } catch (error) {
      console.error('[vv cmd] ERROR:', error);
      await reply(`❌ I could not share that view-once media: ${error.message || 'download or delivery failed.'}`);
    }
  }
};