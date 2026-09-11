const database = require('../../database');

module.exports = {
  name: 'antidelete',
  aliases: ['adelete', 'ad'],
  category: 'admin',
  description: 'Enable or disable deleted-message recovery',
  usage: '.antidelete <on/off/get>',
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    const settings = database.getGroupSettings(extra.from);
    const action = args[0]?.toLowerCase();

    if (!action || action === 'get' || action === 'status') {
      return extra.reply(
        `🛡️ *Anti-delete:* ${settings.antidelete ? 'ON' : 'OFF'}\n\n` +
        `Use *.antidelete on* or *.antidelete off*.`
      );
    }

    if (!['on', 'off'].includes(action)) {
      return extra.reply('❌ Use `.antidelete on`, `.antidelete off`, or `.antidelete get`.');
    }

    database.updateGroupSettings(extra.from, { antidelete: action === 'on' });
    return extra.reply(`✅ Anti-delete has been turned *${action.toUpperCase()}* for this group.`);
  }
};