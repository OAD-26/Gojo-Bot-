module.exports = {
  name: 'wordoftheday',
  category: 'education',
  description: 'Send a word with meaning and example sentence.',
  usage: '.wordoftheday',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    reply(`🔤 *Word of the Day*\n\n(Fetching word... ♾️)`);
  }
};