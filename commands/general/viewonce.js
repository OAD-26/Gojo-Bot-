const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const config = require('../../config');

module.exports = {
  name: 'vv',
  aliases: ['viewonce', 'retrive'],
  category: 'general',
  description: 'Retrieve view-once images or videos and send them to you',
  usage: '.vv (reply to view-once)',
  permission: "Everyone",
  location: "Group & Private Chat",
  cooldown: 5,

  async execute(sock, msg, args, { from, sender, isOwner, reply, quoted }) {
    try {
      if (msg.key.fromMe) return;

      console.log('🔎 VV Command: Starting...');
      
      if (!quoted) {
        console.log('❌ VV Command: No quoted message found');
        return reply('⚠️ Please reply to a view-once image or video.');
      }

      console.log('📋 VV Command: Quoted structure:', Object.keys(quoted));

      // Try multiple paths to find the media
      let mediaMsg = null;
      let mtype = null;

      // Path 1: viewOnceMessageV2/V2Extension with .message
      if (quoted.viewOnceMessageV2?.message?.imageMessage) {
        mediaMsg = quoted.viewOnceMessageV2.message.imageMessage;
        mtype = 'image';
      } else if (quoted.viewOnceMessageV2?.message?.videoMessage) {
        mediaMsg = quoted.viewOnceMessageV2.message.videoMessage;
        mtype = 'video';
      } else if (quoted.viewOnceMessageV2Extension?.message?.imageMessage) {
        mediaMsg = quoted.viewOnceMessageV2Extension.message.imageMessage;
        mtype = 'image';
      } else if (quoted.viewOnceMessageV2Extension?.message?.videoMessage) {
        mediaMsg = quoted.viewOnceMessageV2Extension.message.videoMessage;
        mtype = 'video';
      }
      // Path 2: viewOnceMessage
      else if (quoted.viewOnceMessage?.message?.imageMessage) {
        mediaMsg = quoted.viewOnceMessage.message.imageMessage;
        mtype = 'image';
      } else if (quoted.viewOnceMessage?.message?.videoMessage) {
        mediaMsg = quoted.viewOnceMessage.message.videoMessage;
        mtype = 'video';
      }
      // Path 3: Direct imageMessage/videoMessage with viewOnce flag
      else if (quoted.imageMessage?.viewOnce) {
        mediaMsg = quoted.imageMessage;
        mtype = 'image';
      } else if (quoted.videoMessage?.viewOnce) {
        mediaMsg = quoted.videoMessage;
        mtype = 'video';
      }

      if (!mediaMsg || !mtype) {
        console.log('❌ VV Command: Not a view-once media');
        return reply('⚠️ Please reply to a view-once image or video.');
      }

      console.log(`⬇️ VV Command: Downloading ${mtype}...`);
      const stream = await downloadContentFromMessage(mediaMsg, mtype);
      let buffer = Buffer.from([]);
      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      const caption = mediaMsg.caption || '';
      const ownerId = config.ownerNumber[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
      const target = isOwner ? ownerId : from;
      
      const content = mtype === 'video' ? { video: buffer, caption } : { image: buffer, caption };

      console.log(`📤 VV Command: Sending ${mtype} to ${target}`);
      await sock.sendMessage(target, content, { quoted: msg });
      
      if (isOwner && from !== ownerId) {
        reply('✅ Media sent to your private chat.');
      } else if (!isOwner) {
        reply('✅ Media retrieved and sent!');
      }
    } catch (err) {
      console.error('[vv cmd] ERROR:', err.message);
      reply('❌ Error retrieving view-once media.');
    }
  }
};
