const { educate } = require('../../utils/openai');

module.exports = {
  name: 'shortnote',
  category: 'education',
  description: 'Return quick revision notes on a topic.',
  usage: '.shortnote <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Which topic needs revision notes?');
    const topic = args.join(' ');
    reply('📝 *Generating revision notes...* ♾️');
    try {
      const result = await educate('shortnote', topic);
      reply(`📝 *Quick Notes: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};