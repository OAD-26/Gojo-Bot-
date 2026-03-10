module.exports = {
  name: 'paraphrase',
  category: 'education',
  description: 'Rewrite text in different wording.',
  usage: '.paraphrase <text>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide text.');
    reply(`🔄 *Paraphrase*\n\n(Rewriting text... ♾️)`);
  }
};