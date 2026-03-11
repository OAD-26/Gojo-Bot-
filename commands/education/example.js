const { educate } = require('../../utils/openai');

module.exports = {
  name: 'example',
  category: 'education',
  description: 'Provide helpful examples for understanding a topic.',
  usage: '.example <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Examples for which topic?');
    const topic = args.join(' ');
    try {
      const result = await educate('example', topic);
      reply(`💡 *Examples: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};