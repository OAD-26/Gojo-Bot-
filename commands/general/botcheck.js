const { getHealthSnapshot } = require('../../utils/botHealth');

module.exports = {
  name: 'botcheck',
  aliases: ['health', 'healthcheck'],
  category: 'general',
  description: 'Run a bot health check',
  usage: '.botcheck',
  permission: 'Everyone',
  location: 'Group & Private Chat',

  async execute(sock, msg, args, { reply }) {
    const health = getHealthSnapshot(sock);
    const checks = [
      `${health.connection === 'connected' ? '✅' : '⚠️'} WhatsApp connection: ${health.connection}`,
      `${health.commandCount > 0 ? '✅' : '❌'} Command registry: ${health.commandCount} commands`,
      `${health.authenticated ? '✅' : '⚠️'} Authentication: ${health.authenticated ? 'ready' : 'waiting for QR'}`,
      `✅ Node.js: ${health.node}`,
      `✅ Memory: ${health.memory.heapUsed} used`
    ];

    await reply(
      `🩺 *GOJO BOT HEALTH CHECK*\n\n` +
      `${checks.join('\n')}\n\n` +
      `📦 *Bot version:* V${health.version}\n` +
      `🟢 *Overall:* ${health.healthy ? 'HEALTHY' : 'WAITING OR NEEDS ATTENTION'}`
    );
  }
};