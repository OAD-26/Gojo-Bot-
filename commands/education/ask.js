module.exports = {
  name: 'ask',
  category: 'education',
  description: 'Answer any educational question clearly.',
  usage: '.ask <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Please ask a question.');
    const question = args.join(' ');
    try {
      reply(`🔍 *Analyzing your question...* ♾️\n\n(Feature being integrated with AI. Please use .define or .explain for now!)`);
    } catch (err) {
      reply('❌ Error answering question.');
    }
  }
};