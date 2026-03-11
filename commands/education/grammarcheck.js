const { educate } = require('../../utils/openai');

module.exports = {
  name: 'grammarcheck',
  category: 'education',
  description: 'Check and correct grammar in a sentence.',
  usage: '.grammarcheck <text>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a sentence to check.');
    const text = args.join(' ');
    try {
      const result = await educate('grammarcheck', text);
      reply(`✅ *Grammar Check*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};