module.exports = {
  name: 'uses',
  category: 'education',
  description: 'Explain practical uses or applications.',
  usage: '.uses <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`🛠️ *Uses of: ${args.join(' ')}*\n\n(Finding applications... ♾️)`);
  }
};