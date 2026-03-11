const { educate } = require('../../utils/openai');

module.exports = {
  name: 'brief',
  category: 'education',
  description: 'Explain a topic in 2–3 sentences.',
  usage: '.brief <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Brief on which topic?');
    const topic = args.join(' ');
    try {
      const result = await educate('brief', topic);
      reply(`🔍 *Brief: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};