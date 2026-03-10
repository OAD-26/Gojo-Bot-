module.exports = {
  name: 'translate',
  category: 'education',
  description: 'Translate text into English.',
  usage: '.translate <text>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide text.');
    reply(`🌐 *Translation*\n\n(Translating to English... ♾️)`);
  }
};