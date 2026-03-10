const axios = require('axios');
module.exports = {
  name: 'shortnote',
  category: 'education',
  description: 'Return short study notes.',
  usage: '.shortnote <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic.');
    reply(`📝 *Study Notes: ${args.join(' ')}*\n\n(AI generating notes... ♾️)`);
  }
};