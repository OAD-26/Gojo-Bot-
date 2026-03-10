module.exports = {
  name: 'lesson',
  category: 'education',
  description: 'Provide a mini lesson explaining the topic step by step.',
  usage: '.lesson <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`👨‍🏫 *Lesson: ${args.join(' ')}*\n\n(Preparing lesson... ♾️)`);
  }
};