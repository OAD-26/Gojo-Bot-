module.exports = {
  name: 'mathsolve',
  category: 'education',
  description: 'Solve math problems step-by-step.',
  usage: '.mathsolve <problem>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a math problem.');
    reply(`🧮 *Math Solver*\n\n(Calculating... ♾️)`);
  }
};