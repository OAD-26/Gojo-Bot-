module.exports = {
  name: 'quiz',
  category: 'education',
  description: 'Generate a quiz with 3–5 questions.',
  usage: '.quiz <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`📝 *Quiz: ${args.join(' ')}*\n\n(Generating questions... ♾️)`);
  }
};