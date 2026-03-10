module.exports = {
  name: 'history',
  category: 'education',
  description: 'Explain the historical background.',
  usage: '.history <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`📜 *History of: ${args.join(' ')}*\n\n(Tracing history... ♾️)`);
  }
};