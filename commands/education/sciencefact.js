const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'sciencefact',
  category: 'education',
  description: 'Send an interesting science fact.',
  usage: '.sciencefact',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    try {
      const result = await askAI('Give me one fascinating science fact. It should be mind-blowing or unexpected. Format as:\n🔬 *Science Fact*\n\n<fact>\n\n📌 *Field:* <physics/biology/chemistry/astronomy/etc>');
      reply(result);
    } catch (e) {
      reply('🔬 *Science Fact*\n\nThe human body contains enough carbon to make about 900 pencils!\n\n📌 *Field:* Chemistry ♾️');
    }
  }
};