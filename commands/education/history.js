const { educate } = require('../../utils/openai');

module.exports = {
  name: 'history',
  category: 'education',
  description: 'Explain the historical background of a topic.',
  usage: '.history <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ History of which topic?');
    const topic = args.join(' ');
    reply('📜 *Searching through time...* ♾️');
    try {
      const result = await educate('history', topic);
      reply(`📜 *History: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};