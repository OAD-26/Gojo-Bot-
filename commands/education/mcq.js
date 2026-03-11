const { educate } = require('../../utils/openai');

module.exports = {
  name: 'mcq',
  category: 'education',
  description: 'Generate multiple choice questions on a topic.',
  usage: '.mcq <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ MCQ on which topic?');
    const topic = args.join(' ');
    reply('🔘 *Creating MCQs...* ♾️');
    try {
      const result = await educate('mcq', topic);
      reply(`🔘 *MCQ: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};