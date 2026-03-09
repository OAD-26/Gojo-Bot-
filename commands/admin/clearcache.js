const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'clearcache',
  aliases: ['cleartemp', 'clearmem'],
  category: 'admin',
  description: 'Clear bot cache and temporary files',
  usage: '.clearcache',
  permission: 'Owner',
  location: 'Private Chat',
  cooldown: 10,

  async execute(sock, msg, args, { from, isOwner, reply }) {
    if (!isOwner) return reply('🤞 *Only the Honored One* (Owner) can use this.');
    
    try {
      let clearedCount = 0;
      const tempDirs = [
        path.join(__dirname, '../../tmp'),
        path.join(__dirname, '../../temp'),
        path.join(__dirname, '../../cache')
      ];

      // Clear temp directories if they exist
      tempDirs.forEach(dir => {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
          clearedCount++;
          console.log(`✅ Cleared: ${dir}`);
        }
      });

      // Clear Node.js cache for commands and utilities
      Object.keys(require.cache).forEach(key => {
        if (key.includes('/commands/') || key.includes('/utils/')) {
          delete require.cache[key];
        }
      });

      reply(`✨ *Cache Cleared!* ♾️\n\n🧹 Directories cleared: ${clearedCount}\n🗑️ Memory cache flushed\n🌀 Systems optimized\n\n*- The Infinite Void is clean* 🌑`);
      
      console.log('🧹 Cache cleared successfully');
    } catch (err) {
      console.error('[clearcache cmd] error:', err);
      reply('❌ Error clearing cache: ' + err.message);
    }
  }
};
