const { educate } = require('../../utils/openai');

module.exports = {
  name: 'essay',
  category: 'education',
  description: 'Write a short structured essay on a topic.',
  usage: '.essay <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Essay on which topic?');
    const topic = args.join(' ');
    reply('✍️ *Writing your essay...* ♾️');
    try {
      const result = await educate('essay', topic);
      reply(`✍️ *Essay: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};