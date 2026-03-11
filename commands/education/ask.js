const { educate } = require('../../utils/openai');

module.exports = {
  name: 'ask',
  category: 'education',
  description: 'Answer any educational question clearly like an AI tutor.',
  usage: '.ask <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What would you like to ask?');
    const question = args.join(' ');
    reply('🎓 *Gojo Tutor thinking...* ♾️');
    try {
      const result = await educate('ask', question);
      reply(`🎓 *Answer*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};