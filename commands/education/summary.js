const { educate } = require('../../utils/openai');

module.exports = {
  name: 'summary',
  category: 'education',
  description: 'Provide a clear summarized explanation.',
  usage: '.summary <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Summarize which topic?');
    const topic = args.join(' ');
    reply('📋 *Summarizing...* ♾️');
    try {
      const result = await educate('summary', topic);
      reply(`📋 *Summary: ${topic}*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};