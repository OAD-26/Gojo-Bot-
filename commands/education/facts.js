const { educate } = require('../../utils/openai');

module.exports = {
  name: 'facts',
  category: 'education',
  description: 'Provide interesting educational facts about a topic.',
  usage: '.facts <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Facts about which topic?');
    const topic = args.join(' ');
    try {
      const result = await educate('facts', topic);
      reply(`🧠 *Facts: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};