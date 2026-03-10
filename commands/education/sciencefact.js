module.exports = {
  name: 'sciencefact',
  category: 'education',
  description: 'Send an interesting science fact.',
  usage: '.sciencefact',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    reply(`🧪 *Science Fact*\n\n(Fetching fact... ♾️)`);
  }
};