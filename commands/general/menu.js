const config = require('../../config');
const { loadCommands } = require('../../utils/commandLoader');

module.exports = {
    name: 'menu',
    alias: ['help', 'h'],
    category: 'general',
    desc: 'Show bot menu',
    execute: async (sock, msg, args, { from, sender, isOwner, reply }) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const commands = loadCommands();
        const categories = {};

        // Organize commands by category
        commands.forEach((cmd, name) => {
            // Skip aliases to avoid duplicates in the menu
            if (cmd.name !== name) return;
            
            const cat = cmd.category || 'misc';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.name);
        });

        let menuText = `♾️ *GOJO BOT - INFINITE VOID* ✨\n\n`;
        menuText += `👤 *User:* @${sender.split('@')[0]}\n`;
        menuText += `🤞 *The Honored One:* OAD-26\n`;
        menuText += `⏳ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n`;
        menuText += `✨ *Prefix:* [ ${config.prefix} ]\n\n`;

        // Special System Section (Hardcoded or based on specific logic)
        menuText += `*📜 DOMAIN CONFIG*\n`;
        menuText += `│ ∘ ${config.prefix}entrance [on/off]\n`;
        menuText += `│ ∘ ${config.prefix}autoreact [on/off]\n`;
        menuText += `╰─══════════════════\n\n`;

        // Dynamic Categories
        Object.keys(categories).sort().forEach(cat => {
            menuText += `*🧿 ${cat.toUpperCase()} TECHNIQUES*\n`;
            categories[cat].sort().forEach(cmdName => {
                const cmd = commands.get(cmdName);
                menuText += `│ ∘ ${config.prefix}${cmdName}${cmd.desc || cmd.description ? ` - ${cmd.desc || cmd.description}` : ''}\n`;
            });
            menuText += `╰─══════════════════\n\n`;
        });
        
        menuText += `_✨ "Throughout Heaven and Earth, I alone am the honored one."_`;

        await sock.sendMessage(from, { 
            text: menuText,
            mentions: [sender]
        }, { quoted: msg });
    }
};
