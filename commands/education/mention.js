module.exports = {
  name: 'mention',
  category: 'education',
  description: 'List important key points.',
  usage: '.mention <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`📍 *Key Points: ${args.join(' ')}*\n\n(Extracting points... ♾️)`);
  }
};