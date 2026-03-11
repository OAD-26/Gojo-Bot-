const { educate } = require('../../utils/openai');

module.exports = {
  name: 'paraphrase',
  category: 'education',
  description: 'Rewrite text in different wording.',
  usage: '.paraphrase <text>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide text to paraphrase.');
    const text = args.join(' ');
    try {
      const result = await educate('paraphrase', text);
      reply(`🔄 *Paraphrased*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};