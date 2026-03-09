const db = require('./dbManager');
const path = require('path');
const arPath = path.join(__dirname, '../database/autoreact.json');
const agPath = path.join(__dirname, '../database/autogreet.json');

const handleAutoReact = async (sock, msg, from, body, isGroup, sender) => {
  let ar = db.read(arPath);
  
  // Check if globally enabled or enabled for this specific chat
  const isEnabled = ar.global || ar.enabledChats?.includes(from);
  if (!isEnabled) return;

  // If mode is 'bot', only react if it starts with prefix
  const config = require('../config');
  if (ar.mode === 'bot' && !body.trim().startsWith(config.prefix)) return;

  if (Math.random() * 100 > (ar.probability || 100)) return;
  const emojis = ar.emojiPool || ["♾️", "✨", "🌀", "🧿", "🤞"];
  await sock.sendMessage(from, { react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: msg.key } });
};

const handleAutoGreet = async (sock, msg, from, isGroup, sender, isOwner) => {
  let ag = db.read(agPath);
  const now = Date.now();
  
  // Owner Greet
  if (isOwner && ag.owner?.enabled) {
    if (now - (ag.owner.last || 0) > 86400000) {
      await sock.sendMessage(from, { text: "♾️ *WELCOME BACK, THE HONORED ONE* ✨\n\n_Throughout Heaven and Earth, you alone are the honored one._" }, { quoted: msg });
      ag.owner.last = now;
      db.write(agPath, ag);
    }
  }
  
  // Group Entrance
  if (isGroup && ag.group?.enabled) {
    // Only work if specifically allowed for this group
    if (!ag.group.allowedGroups?.includes(from)) return;
    
    ag.group.chats = ag.group.chats || {};
    if (now - (ag.group.chats[from] || 0) > 86400000) {
      const groupMetadata = await sock.groupMetadata(from);
      const groupName = groupMetadata.subject;
      
      const welcomeMsg = `♾️ *DOMAIN EXPANSION: INFINITE VOID* ✨\n\n` +
                        `📍 *Domain:* ${groupName}\n` +
                        `✨ *Status:* Ascended\n` +
                        `🤞 *Warning:* Infinite information is flowing...`;
                        
      await sock.sendMessage(from, { text: welcomeMsg });
      ag.group.chats[from] = now;
      db.write(agPath, ag);
    }
  }
};
module.exports = { handleAutoReact, handleAutoGreet };
