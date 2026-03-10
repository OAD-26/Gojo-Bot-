module.exports = {
  name: 'brief',
  category: 'education',
  description: 'Explain the topic in 2–3 sentences.',
  usage: '.brief <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`🔍 *Brief: ${args.join(' ')}*\n\n(Processing... ♾️)`);
  }
};