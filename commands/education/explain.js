const { educate } = require('../../utils/openai');

module.exports = {
  name: 'explain',
  category: 'education',
  description: 'Explain a topic clearly with examples like an AI tutor.',
  usage: '.explain <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What topic would you like explained?');
    const topic = args.join(' ');
    reply('📘 *Gojo Tutor is thinking...* ♾️');
    try {
      const result = await educate('explain', topic);
      reply(`📘 *Explanation: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};