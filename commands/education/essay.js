module.exports = {
  name: 'essay',
  category: 'education',
  description: 'Generate a short essay about the topic.',
  usage: '.essay <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`✍️ *Essay: ${args.join(' ')}*\n\n(Writing essay... ♾️)`);
  }
};