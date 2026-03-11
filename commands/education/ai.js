const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'tutor',
  aliases: ['gojo'],
  category: 'education',
  description: 'General AI assistant with Gojo tutor personality.',
  usage: '.tutor <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Ask me anything!');
    const question = args.join(' ');
    reply('🧿 *The Six Eyes are analyzing...* ♾️');
    try {
      const result = await askAI(question);
      reply(result);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};