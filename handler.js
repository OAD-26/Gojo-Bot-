const config = require('./config');
const { handleAutoReact, handleAutoGreet } = require('./utils/jogoSystems');
const { loadCommands } = require('./utils/commandLoader');
const db = require('./utils/dbManager');
const path = require('path');
const agPath = path.join(__dirname, './database/autogreet.json');

let commands;
try { commands = loadCommands(); } catch (e) { commands = new Map(); }

module.exports = {
  handleMessage: async (sock, msg) => {
    try {
      if (!msg.message) return;
      const from = msg.key.remoteJid;
      if (!from || from.includes('@broadcast')) return;
      
      let body = "";
      if (msg.message.conversation) body = msg.message.conversation;
      else if (msg.message.extendedTextMessage) body = msg.message.extendedTextMessage.text;
      else if (msg.message.imageMessage) body = msg.message.imageMessage.caption || "";
      else if (msg.message.videoMessage) body = msg.message.videoMessage.caption || "";
      else if (msg.message.buttonsResponseMessage) body = msg.message.buttonsResponseMessage.selectedButtonId || "";
      else if (msg.message.listResponseMessage) body = msg.message.listResponseMessage.singleSelectReply.selectedRowId || "";
      else if (msg.message.templateButtonReplyMessage) body = msg.message.templateButtonReplyMessage.selectedId || "";
      
      const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || 
                        msg.message?.imageMessage?.contextInfo?.quotedMessage || 
                        msg.message?.videoMessage?.contextInfo?.quotedMessage ||
                        msg.message?.viewOnceMessageV2?.contextInfo?.quotedMessage ||
                        msg.message?.viewOnceMessage?.contextInfo?.quotedMessage ||
                        msg.message?.viewOnceMessageV2Extension?.contextInfo?.quotedMessage ||
                        msg.message?.buttonsResponseMessage?.contextInfo?.quotedMessage ||
                        msg.message?.listResponseMessage?.contextInfo?.quotedMessage ||
                        msg.message?.templateButtonReplyMessage?.contextInfo?.quotedMessage;
      const sender = msg.key.participant || from;
      const isGroup = from.endsWith('@g.us');
      
      // Owner = the WhatsApp account the bot is running on
      const botOwnerNumber = (sock.user?.id || '').replace(/[^0-9]/g, '');
      const senderNumber = sender.split('@')[0].split(':')[0];
      const isOwner = botOwnerNumber === senderNumber;

      await handleAutoReact(sock, msg, from, body, isGroup, sender).catch(() => {});
      await handleAutoGreet(sock, msg, from, isGroup, sender, isOwner).catch(() => {});

      // Send owner welcome message on first interaction
      if (isOwner && msg.key.fromMe !== true) {
        const ownerWelcomePath = path.join(__dirname, './database/ownerWelcome.json');
        let ownerData = db.read(ownerWelcomePath) || { sent: false };
        
        if (!ownerData.sent) {
          const ownerMsg = `✨ 🤞 *INFINITE VOID ACTIVATED* ♾️\n\n🌟 *Welcome to the Domain!*\n\nYour GOJO BOT is now online and ready to execute commands.\n\n📋 *Commands:* Use .menu to see all available commands.\n\n🔧 *Support:* For feedback and issues:\n📧 ${config.creatorEmail}\n📱 ${config.creatorContact}\n\n*- GOJO BOT (by OAD-26)*`;
          
          sock.sendMessage(from, { text: ownerMsg }).catch(() => {});
          ownerData.sent = true;
          db.write(ownerWelcomePath, ownerData);
          console.log('📤 Owner welcome message sent');
        }
      }

      // Command Execution
      const bodyClean = body.trim();
      if (bodyClean.startsWith(config.prefix)) {
        const args = bodyClean.slice(config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        console.log(`🔥 Command Received: ${commandName} from ${sender}`);

        // Inject quoted message into the message object so commands can find it easily
        if (quotedMsg) {
          if (!msg.message.extendedTextMessage) msg.message.extendedTextMessage = { contextInfo: { quotedMessage: quotedMsg } };
          else if (!msg.message.extendedTextMessage.contextInfo) msg.message.extendedTextMessage.contextInfo = { quotedMessage: quotedMsg };
          else msg.message.extendedTextMessage.contextInfo.quotedMessage = quotedMsg;
        }

      // Custom Command: .entrance [on/off/allow]
      if (commandName === 'entrance' || commandName === 'greet') {
        if (!isOwner) return sock.sendMessage(from, { text: "🤞 *Only the Honored One* can control the domain." });
        let ag = db.read(agPath);
        if (!ag.group) ag.group = { enabled: false, allowedGroups: [], chats: {} };
        
        const action = args[0]?.toLowerCase();
        if (action === 'on') {
          ag.group.enabled = true;
          db.write(agPath, ag);
          return sock.sendMessage(from, { text: "✨ *DOMAIN ENTRANCE:* ENABLED ♾️" });
        } else if (action === 'off') {
          ag.group.enabled = false;
          db.write(agPath, ag);
          return sock.sendMessage(from, { text: "🌑 *DOMAIN ENTRANCE:* DISABLED 🌀" });
        } else if (action === 'allow') {
          if (!isGroup) return sock.sendMessage(from, { text: "⚠️ This technique must be used within a group domain." });
          if (!ag.group.allowedGroups) ag.group.allowedGroups = [];
          if (!ag.group.allowedGroups.includes(from)) {
            ag.group.allowedGroups.push(from);
            db.write(agPath, ag);
            return sock.sendMessage(from, { text: "✨ *DOMAIN EXPANDED:* This group is now part of the Infinity. ♾️" });
          } else {
            return sock.sendMessage(from, { text: "🧿 This group is already within the Infinite Void." });
          }
        } else if (action === 'disallow') {
          if (!isGroup) return sock.sendMessage(from, { text: "⚠️ This technique must be used within a group domain." });
          ag.group.allowedGroups = ag.group.allowedGroups?.filter(g => g !== from) || [];
          db.write(agPath, ag);
          return sock.sendMessage(from, { text: "🌀 *DOMAIN RETRACTED:* Group excluded from the Infinity. 🌑" });
        }
        return sock.sendMessage(from, { text: "📘 *USAGE:*\n.entrance on\n.entrance off\n.entrance allow\n.entrance disallow" });
      }

      const cmd = commands.get(commandName);
      if (cmd) {
        console.log(`🚀 Executing Command: ${cmd.name} | Quoted: ${quotedMsg ? 'YES' : 'NO'}`);
        const ctx = {
          from, sender, isOwner, isGroup,
          quoted: quotedMsg,
          reply: (t) => sock.sendMessage(from, { text: t }, { quoted: msg }).catch(e => console.error(`Reply error:`, e.message)),
          react: (e) => sock.sendMessage(from, { react: { text: e, key: msg.key } })
        };
        try {
          await cmd.execute(sock, msg, args, ctx);
        } catch (err) {
          console.error(`❌ Command Execution Error (${commandName}):`, err.message);
          sock.sendMessage(from, { text: "⚠️ An error occurred while executing this command." }).catch(() => {});
        }
      } else {
        console.log(`❓ Command not found: ${commandName}`);
      }
      }
    } catch (e) { console.error(e); }
  }
};
