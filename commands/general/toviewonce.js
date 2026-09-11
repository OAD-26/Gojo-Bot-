const {
  extractMedia,
  getQuotedContext,
  downloadMedia,
  sendMedia,
  normalizeNumber
} = require('../../utils/messageProtection');

module.exports = {
  name: 'toviewonce',
  aliases: ['vvsend', 'once', 'convertviewonce'],
  category: 'general',
  description: 'Replace a bot-sent image, video, or voice note with a view-once copy',
  usage: '.toviewonce (reply to media sent by the bot)',
  ownerOnly: true,

  async execute(sock, msg, args, { from, reply, quoted }) {
    if (!quoted) {
      return reply('⚠️ Reply to an image, video, or voice note sent by the bot.');
    }

    const extracted = extractMedia(quoted);
    if (!extracted || !['image', 'video', 'audio'].includes(extracted.mediaType)) {
      return reply('⚠️ Supported media: image, video, or voice note.');
    }

    if (extracted.isViewOnce) {
      return reply('ℹ️ That media is already view-once.');
    }

    const context = getQuotedContext(msg);
    const botNumber = normalizeNumber(sock.user?.id || sock.user?.jid);
    const quotedSender = normalizeNumber(context?.participant);
    const isBotMessage = !quotedSender || quotedSender === botNumber;

    if (!isBotMessage) {
      return reply('❌ For safety, I can only replace media that was originally sent by the bot.');
    }

    try {
      const buffer = await downloadMedia(extracted.media, extracted.mediaType);
      await sendMedia(sock, from, extracted, buffer, {
        viewOnce: true,
        sendOptions: { quoted: msg }
      });

      if (!context?.stanzaId) {
        return reply('✅ View-once media sent, but I could not identify the original message to delete.');
      }

      const deleteKey = {
        remoteJid: from,
        id: context.stanzaId,
        fromMe: true
      };
      if (context.participant) deleteKey.participant = context.participant;
      await sock.sendMessage(from, { delete: deleteKey });
      await reply('✅ The original bot media was deleted and replaced with a view-once copy.');
    } catch (error) {
      console.error('To-view-once command error:', error);
      await reply(`❌ I could not convert that media: ${error.message || 'download or delivery failed.'}`);
    }
  }
};