module.exports = {
  name: 'study',
  category: 'education',
  description: 'Provide structured study notes.',
  usage: '.study <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`📖 *Study Guide: ${args.join(' ')}*\n\n(Creating guide... ♾️)`);
  }
};