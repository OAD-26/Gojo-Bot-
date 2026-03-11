const { educate } = require('../../utils/openai');

module.exports = {
  name: 'research',
  category: 'education',
  description: 'Provide structured research information on a topic.',
  usage: '.research <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Research on which topic?');
    const topic = args.join(' ');
    reply('🔬 *Researching...* ♾️');
    try {
      const result = await educate('research', topic);
      reply(`🔬 *Research: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};