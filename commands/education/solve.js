const { educate } = require('../../utils/openai');

module.exports = {
  name: 'solve',
  category: 'education',
  description: 'Solve math, science, or logical problems step-by-step.',
  usage: '.solve <problem>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What problem should I solve?');
    const problem = args.join(' ');
    reply('🧩 *Calculating...* ♾️');
    try {
      const result = await educate('solve', problem);
      reply(`🧩 *Step-by-Step Solution*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};