const { getHealthSnapshot } = require('../../utils/botHealth');

module.exports = {
  name: 'botstatus',
  aliases: ['status'],
  category: 'general',
  description: 'Show the bot connection, version, uptime, and command status',
  usage: '.botstatus',
  permission: 'Everyone',
  location: 'Group & Private Chat',

  async execute(sock, msg, args, { reply }) {
    const health = getHealthSnapshot(sock);
    const status = health.connection === 'connected' ? 'ONLINE' : health.connection.toUpperCase();

    await reply(
      `🤖 *GOJO BOT STATUS*\n\n` +
      `🔌 *Connection:* ${status}\n` +
      `📚 *Commands loaded:* ${health.commandCount}\n` +
      `🧬 *Version:* V${health.version}\n` +
      `⏱️ *Uptime:* ${health.uptimeSeconds}s\n` +
      `🟢 *Process:* ${health.healthy ? 'Healthy' : 'Needs attention'}`
    );
  }
};