const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'fact',
  category: 'education',
  description: 'Send a random interesting educational fact.',
  usage: '.fact',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    try {
      const result = await askAI('Share one interesting, surprising educational fact that most people don\'t know. Format as:\n💡 *Did You Know?*\n\n<fact>');
      reply(result);
    } catch (e) {
      reply('💡 *Did You Know?*\n\nVenus rotates in the opposite direction to most planets, meaning the Sun rises in the west and sets in the east there! ♾️');
    }
  }
};