module.exports = {
  name: 'facts',
  category: 'education',
  description: 'Provide interesting educational facts.',
  usage: '.facts <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`🧠 *Facts about: ${args.join(' ')}*\n\n(Searching facts... ♾️)`);
  }
};