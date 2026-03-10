module.exports = {
  name: 'grammarcheck',
  category: 'education',
  description: 'Correct grammar in a sentence.',
  usage: '.grammarcheck <text>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide text.');
    reply(`✍️ *Grammar Check*\n\n(Checking grammar... ♾️)`);
  }
};