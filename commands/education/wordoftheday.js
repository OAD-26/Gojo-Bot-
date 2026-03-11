const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'wordoftheday',
  category: 'education',
  description: 'Send a word of the day with meaning and example.',
  usage: '.wordoftheday',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    try {
      const result = await askAI('Give me a word of the day — choose a unique, interesting English vocabulary word. Format exactly as:\n🔤 *Word of the Day: <word>*\n\n📖 *Meaning:* <definition>\n✨ *Example:* <example sentence>\n🏷️ *Type:* <noun/verb/adjective/etc>');
      reply(result);
    } catch (e) {
      reply('🔤 *Word of the Day: Ephemeral*\n\n📖 *Meaning:* Lasting for a very short time.\n✨ *Example:* The beauty of cherry blossoms is ephemeral.\n🏷️ *Type:* Adjective\n\n*- Expand your vocabulary* ♾️');
    }
  }
};