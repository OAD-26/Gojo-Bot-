module.exports = {
  name: 'example',
  category: 'education',
  description: 'Provide examples related to the topic.',
  usage: '.example <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`💡 *Examples for: ${args.join(' ')}*\n\n(Generating examples... ♾️)`);
  }
};