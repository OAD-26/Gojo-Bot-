const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'update',
  aliases: ['upgrade'],
  category: 'admin',
  description: 'Update GOJO BOT to the latest version',
  usage: '.update',
  permission: 'Owner',
  location: 'Private Chat',
  cooldown: 30,

  async execute(sock, msg, args, { from, isOwner, reply }) {
    if (!isOwner) return reply('🤞 *Only the Honored One* (Owner) can use this.');
    
    try {
      reply('✨ *Checking for updates...*\n\n⏳ This may take a moment...');
      
      // Update npm packages
      exec('npm install', (error, stdout, stderr) => {
        if (error) {
          console.error('Update error:', error);
          return sock.sendMessage(from, { text: `❌ *Update Failed!*\n\nError: ${error.message}` }).catch(() => {});
        }
        
        sock.sendMessage(from, { text: `✅ *Update Complete!* ♾️\n\n🌟 All packages updated successfully!\n\n🔄 Restart the bot with .restart to apply changes.\n\n*- The Honored One (GOJO BOT)*` }).catch(() => {});
        console.log('✅ Bot packages updated');
      });
    } catch (err) {
      console.error('[update cmd] error:', err);
      reply('❌ Error updating bot: ' + err.message);
    }
  }
};
