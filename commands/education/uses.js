const { educate } = require('../../utils/openai');

module.exports = {
  name: 'uses',
  category: 'education',
  description: 'Explain practical uses and applications of a topic.',
  usage: '.uses <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Uses of which topic?');
    const topic = args.join(' ');
    try {
      const result = await educate('uses', topic);
      reply(`🛠️ *Uses of: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};