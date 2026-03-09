module.exports = {
  name: "ping",
  description: "Check if the bot is alive and see its response speed",
  usage: ".ping",
  permission: "Everyone",
  location: "Group & Private Chat",
  cooldown: 3,

  async execute(sock, msg, args, { reply }) {
    const start = Date.now();
    await reply('♾️ *Expanding Infinite Void...*');
    const end = Date.now();
    await reply(`✨ *Ascended!* Reality Lag: ${end - start}ms`);
  }
};
