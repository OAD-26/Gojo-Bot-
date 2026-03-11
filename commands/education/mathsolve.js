const { educate } = require('../../utils/openai');

module.exports = {
  name: 'mathsolve',
  category: 'education',
  description: 'Solve math problems step-by-step.',
  usage: '.mathsolve <problem>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What math problem should I solve?');
    const problem = args.join(' ');
    reply('🧮 *Calculating...* ♾️');
    try {
      const result = await educate('mathsolve', problem);
      reply(`🧮 *Math Solution*\n\n${result}`);
    } catch (e) {
      reply('❌ AI error: ' + e.message);
    }
  }
};