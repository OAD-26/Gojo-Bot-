const { educate } = require('../../utils/openai');

module.exports = {
  name: 'homework',
  category: 'education',
  description: 'Help solve homework problems step-by-step.',
  usage: '.homework <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What is your homework question?');
    const question = args.join(' ');
    reply('📚 *Solving your homework...* ♾️');
    try {
      const result = await educate('homework', question);
      reply(`📚 *Homework Solution*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};