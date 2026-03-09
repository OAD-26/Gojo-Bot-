module.exports = {
  name: 'refresh',
  aliases: ['reload'],
  category: 'admin',
  description: 'Refresh/reload all bot systems and commands',
  usage: '.refresh',
  permission: 'Owner',
  location: 'Private Chat',
  cooldown: 5,

  async execute(sock, msg, args, { from, isOwner, reply }) {
    if (!isOwner) return reply('🤞 *Only the Honored One* (Owner) can use this.');
    
    try {
      reply('♾️ *Refreshing systems...* ✨');
      
      // Reload commands
      delete require.cache[require.resolve('../../utils/commandLoader')];
      const { loadCommands } = require('../../utils/commandLoader');
      const commands = loadCommands();
      
      // Reload config
      delete require.cache[require.resolve('../../config')];
      const config = require('../../config');
      
      // Reload handler
      delete require.cache[require.resolve('../../handler')];
      
      setTimeout(() => {
        reply(`✨ *Systems Refreshed!* ♾️\n\n✅ Commands: ${commands.size} loaded\n✅ Config reloaded\n✅ Ready to serve!\n\n*- The Six Eyes see all* 🧿`);
      }, 500);
    } catch (err) {
      console.error('[refresh cmd] error:', err);
      reply('❌ Error refreshing systems: ' + err.message);
    }
  }
};
