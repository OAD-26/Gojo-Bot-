const { educate } = require('../../utils/openai');

module.exports = {
  name: 'lesson',
  category: 'education',
  description: 'Teach a topic step-by-step as a mini lesson.',
  usage: '.lesson <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Lesson on which topic?');
    const topic = args.join(' ');
    reply('👨‍🏫 *Class is in session...* ♾️');
    try {
      const result = await educate('lesson', topic);
      reply(`👨‍🏫 *Lesson: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};