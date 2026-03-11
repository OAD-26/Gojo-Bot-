const { educate } = require('../../utils/openai');

module.exports = {
  name: 'study',
  category: 'education',
  description: 'Generate structured study notes on a topic.',
  usage: '.study <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Study notes for which topic?');
    const topic = args.join(' ');
    reply('📖 *Creating study notes...* ♾️');
    try {
      const result = await educate('study', topic);
      reply(`📖 *Study Guide: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};