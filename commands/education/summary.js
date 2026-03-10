module.exports = {
  name: 'summary',
  category: 'education',
  description: 'Return a summarized explanation.',
  usage: '.summary <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`📋 *Summary: ${args.join(' ')}*\n\n(Summarizing... ♾️)`);
  }
};