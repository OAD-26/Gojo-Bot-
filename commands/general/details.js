const { loadCommands } = require('../../utils/commandLoader');

module.exports = {
  name: "details",
  aliases: ["help", "info"],
  description: "View details of a specific command or all commands",
  usage: ".details <command_name> | .details all",
  permission: "Everyone",
  location: "Group & Private Chat",
  cooldown: 3,

  async execute(sock, msg, args, { from, reply }) {
    try {
      const commands = loadCommands();
      const commandName = args[0]?.toLowerCase();

      if (!commandName) {
        return reply(`📘 *HOW TO USE*\n\n.details ping\n.details ai\n.details vv\n\nUse .menu to see all commands.`);
      }

      if (commandName === 'all') {
        let helpText = `📚 *GOJO BOT COMMAND GUIDE*\n\n`;
        const seen = new Set();
        commands.forEach((cmd) => {
          if (!seen.has(cmd.name)) {
            helpText += `.${cmd.name} → ${cmd.description || cmd.desc || 'No description'}\n`;
            seen.add(cmd.name);
          }
        });
        helpText += `\n⚡ Powered by Gojo Bot`;
        return reply(helpText);
      }

      const cmd = commands.get(commandName);
      if (!cmd) {
        return reply(`⚠️ Command not found.\n\nUse .menu to see all commands.`);
      }

      const response = `📖 *COMMAND DETAILS*

🔹 *Command:*
.${cmd.name}

📌 *Description:*
${cmd.description || cmd.desc || 'No description provided.'}

⚙ *Usage:*
${cmd.usage || '.' + cmd.name}

👤 *Permission:*
${cmd.permission || 'Everyone'}

📍 *Works In:*
${cmd.location || 'Group & Private Chat'}

⏱ *Cooldown:*
${cmd.cooldown || 'None'}

⚡ *Powered by Gojo Bot*`;

      await reply(response);
    } catch (err) {
      console.error('[details cmd] error:', err);
      reply('❌ Error retrieving command details.');
    }
  }
};
