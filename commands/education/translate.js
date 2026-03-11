const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'translate',
  category: 'education',
  description: 'Translate text into English.',
  usage: '.translate <text>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide text to translate.');
    const text = args.join(' ');
    try {
      const result = await askAI(`Translate the following text into English. Only provide the translation and the detected language. Format: "🌐 *Translation:* <text>\n\n🔤 *Detected Language:* <language>"\n\nText: "${text}"`);
      reply(result);
    } catch (e) {
      reply('❌ Translation error: ' + e.message);
    }
  }
};