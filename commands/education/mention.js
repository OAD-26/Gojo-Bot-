const { educate } = require('../../utils/openai');

module.exports = {
  name: 'mention',
  category: 'education',
  description: 'List important key points about a topic.',
  usage: '.mention <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Key points on which topic?');
    const topic = args.join(' ');
    try {
      const result = await educate('mention', topic);
      reply(`📍 *Key Points: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};