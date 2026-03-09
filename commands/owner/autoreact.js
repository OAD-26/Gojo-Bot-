/**
 * Auto-React Command - Configure automatic reactions
 */

const db = require('../../utils/dbManager');
const path = require('path');
const arPath = path.join(__dirname, '../../database/autoreact.json');

module.exports = {
  name: 'autoreact',
  aliases: ['ar'],
  category: 'owner',
  description: 'Configure automatic reactions to messages',
  usage: '.autoreact <on/off/set bot/set all>',
  ownerOnly: true,

  async execute(sock, msg, args, extra) {
    try {
      if (!args[0]) {
        return extra.reply('📋 *Auto-React Options:*\n\n• on - Enable auto-react (Global)\n• off - Disable auto-react (Global)\n• set bot - React only to bot commands\n• set all - React to all messages');
      }

      let ar = db.read(arPath);
      const opt = args.join(' ').toLowerCase();

      if (opt === 'on') {
        ar.global = true;
        db.write(arPath, ar);
        return extra.reply('✅ Auto-react enabled globally.');
      }

      if (opt === 'off') {
        ar.global = false;
        db.write(arPath, ar);
        return extra.reply('❌ Auto-react disabled globally.');
      }

      if (opt === 'set bot') {
        ar.mode = 'bot';
        ar.emojiPool = ["⏳"];
        db.write(arPath, ar);
        return extra.reply('🤖 Auto-react mode: Bot commands only (⏳ reaction)');
      }

      if (opt === 'set all') {
        ar.mode = 'all';
        ar.emojiPool = ["🔥", "🌋", "💀", "🌟", "✨"];
        db.write(arPath, ar);
        return extra.reply('🌟 Auto-react mode: All messages (random emojis)');
      }

      extra.reply('❌ Invalid option. Use: on | off | set bot | set all');
    } catch (err) {
      console.error('[autoreact cmd] error:', err);
      extra.reply('❌ Error configuring auto-react.');
    }
  }
};
