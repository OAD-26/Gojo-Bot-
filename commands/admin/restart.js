const { exec } = require('child_process');

module.exports = {
  name: 'restart',
  aliases: ['reboot'],
  category: 'admin',
  description: 'Restart the GOJO BOT',
  usage: '.restart',
  permission: 'Owner',
  location: 'Private Chat',
  cooldown: 10,

  async execute(sock, msg, args, { from, isOwner, reply }) {
    if (!isOwner) return reply('🤞 *Only the Honored One* (Owner) can use this.');
    
    try {
      reply('🌀 *Domain Expansion Deactivating...* Restarting systems...\n\n⏳ Bot will restart in 5 seconds.');
      
      setTimeout(() => {
        console.log('🔄 RESTARTING BOT...');
        exec('npm restart', (err) => {
          if (err) console.error('Restart error:', err);
        });
        
        // Fallback: Exit process to let Replit/supervisor restart
        process.exit(0);
      }, 2000);
    } catch (err) {
      console.error('[restart cmd] error:', err);
      reply('❌ Error restarting bot: ' + err.message);
    }
  }
};
