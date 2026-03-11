const { educate } = require('../../utils/openai');

module.exports = {
  name: 'quiz',
  category: 'education',
  description: 'Generate a quiz with answers on a topic.',
  usage: '.quiz <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Quiz on which topic?');
    const topic = args.join(' ');
    reply('📝 *Generating quiz...* ♾️');
    try {
      const result = await educate('quiz', topic);
      reply(`📝 *Quiz: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};