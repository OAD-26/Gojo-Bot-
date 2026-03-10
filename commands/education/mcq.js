module.exports = {
  name: 'mcq',
  category: 'education',
  description: 'Generate multiple choice questions.',
  usage: '.mcq <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`🔘 *MCQ: ${args.join(' ')}*\n\n(Generating MCQs... ♾️)`);
  }
};