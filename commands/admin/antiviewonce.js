const database = require('../../database');

module.exports = {
  name: 'antiviewonce',
  aliases: ['aview', 'avonce'],
  category: 'admin',
  description: 'Enable or disable automatic view-once media recovery',
  usage: '.antiviewonce <on/off/get>',
  groupOnly: true,
  adminOnly: true,

  async execute(sock, msg, args, extra) {
    const settings = database.getGroupSettings(extra.from);
    const action = args[0]?.toLowerCase();

    if (!action || action === 'get' || action === 'status') {
      return extra.reply(
        `🛡️ *Anti-view-once:* ${settings.antiviewonce ? 'ON' : 'OFF'}\n\n` +
        `Use *.antiviewonce on* or *.antiviewonce off*.`
      );
    }

    if (!['on', 'off'].includes(action)) {
      return extra.reply('❌ Use `.antiviewonce on`, `.antiviewonce off`, or `.antiviewonce get`.');
    }

    database.updateGroupSettings(extra.from, { antiviewonce: action === 'on' });
    return extra.reply(`✅ Anti-view-once has been turned *${action.toUpperCase()}* for this group.`);
  }
};