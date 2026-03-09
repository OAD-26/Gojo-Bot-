/**
 * Global Configuration for WhatsApp MD Bot
 */

module.exports = {
    // Bot Owner Configuration
    ownerNumber: ['91xxxxxxxxxxx'], // Add your number without + or spaces
    ownerName: ['OAD-26'], // Owner names
    
    // Creator Configuration
    creatorNumber: '2349138385352', // Creator's WhatsApp number
    creatorName: 'OAD-26',
    creatorContact: '+2349138385352',
    creatorEmail: 'oad262626@gmail.com',
    
    // Bot Configuration
    botName: 'GOJO',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || '',
    newsletterJid: '120363161513685998@newsletter',
    updateZipUrl: 'https://github.com/OAD-26/GOJO-BOT/archive/refs/heads/main.zip',
    
    // Sticker Configuration
    packname: 'GOJO BOT 🔥',
    author: 'OAD-26',
    
    // Bot Behavior
    selfMode: false,
    autoRead: true,
    autoTyping: false,
    autoBio: true,
    autoSticker: true,
    autoReact: false,
    autoReactMode: 'bot',
    autoDownload: false,
    
    // Group Settings Defaults
    defaultGroupSettings: {
      antilink: true,
      antilinkAction: 'delete',
      antitag: true,
      antitagAction: 'delete',
      antiall: false,
      antiviewonce: true,
      antibot: true,
      anticall: true,
      antigroupmention: true,
      antigroupmentionAction: 'delete',
      welcome: true,
      welcomeMessage: '✨ *The Six Eyes see all.* Welcome @user to the Infinite Void of *#group*! ♾️',
      goodbye: true,
      goodbyeMessage: '🌀 A soul has left the domain. Goodbye @user. *Blue... Red... Hollow Purple!*',
      antiSpam: true,
      antidelete: true,
      nsfw: false,
      detect: true,
      chatbot: false,
      autosticker: true
    },
    
    // API Keys
    apiKeys: {
      openai: '',
      deepai: '',
      remove_bg: ''
    },
    
    // Message Configuration
    messages: {
      wait: '♾️ *Cursed Technique: Lapse Blue.* Concentrating energy... Please wait.',
      success: '✨ *Infinite Void.* Success! Everything is clear.',
      error: '❌ *A ripple in the Infinity!* Error occurred.',
      ownerOnly: '🤞 *Only the Honored One* (OAD-26) can command me.',
      adminOnly: '🧿 *Only Grade 1 Sorcerers* (admins) can use this.',
      groupOnly: '🏯 This belongs within a *Domain Expansion* (group).',
      privateOnly: '🌑 Speak to me in the *Shadows* (private chat).',
      botAdminNeeded: '🦾 I need *High-Level Authority* (admin) to do this.',
      invalidCommand: '⚠️ You dare command the strongest? Type .menu for guidance.'
    },
    
    timezone: 'Asia/Kolkata',
    maxWarnings: 3,
    
    social: {
      github: 'https://github.com/OAD-26',
      instagram: 'https://instagram.com/oad26',
      youtube: 'https://youtube.com/@oad26'
    }
};
