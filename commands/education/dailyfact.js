const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'dailyfact',
  category: 'education',
  description: 'Send a random interesting educational fact.',
  usage: '.dailyfact',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    try {
      const result = await askAI('Give me one surprising, interesting educational fact that most people don\'t know. Format it as:\n💡 *Daily Fact*\n\n<fact>\n\n*Source/Category:* <category>');
      reply(result);
    } catch (e) {
      const fallbacks = [
        "💡 *Daily Fact*\n\nHoney never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible!\n\n*Source: Archaeology* ♾️",
        "💡 *Daily Fact*\n\nA bolt of lightning is 5 times hotter than the surface of the sun!\n\n*Source: Physics* ♾️",
        "💡 *Daily Fact*\n\nOctopuses have three hearts, blue blood, and can change color despite being colorblind!\n\n*Source: Biology* ♾️"
      ];
      reply(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    }
  }
};