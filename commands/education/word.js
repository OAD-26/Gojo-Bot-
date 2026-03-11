const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'word',
  category: 'education',
  description: 'Send word of the day with meaning and example.',
  usage: '.word',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    try {
      const result = await askAI('Give a unique English vocabulary word. Format exactly as:\n🔤 *Word: <word>*\n\n📖 *Meaning:* <definition>\n✨ *Example:* <example sentence>');
      reply(result);
    } catch (e) {
      reply('🔤 *Word: Resilient*\n\n📖 *Meaning:* Able to recover quickly from difficulties.\n✨ *Example:* She was resilient in the face of challenges. ♾️');
    }
  }
};