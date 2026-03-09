/**
 * AI Chat Command - ChatGPT-style responses
 */

const APIs = require('../../utils/api');

module.exports = {
  name: 'ai',
  aliases: ['gpt', 'chatgpt', 'ask'],
  category: 'ai',
  description: 'Chat with AI (ChatGPT-style) to get answers to any question',
  usage: '.ai <question>',
  permission: "Everyone",
  location: "Group & Private Chat",
  cooldown: 5,
  
  async execute(sock, msg, args, extra) {
    try {
      if (args.length === 0) {
        return extra.reply('❌ Usage: .ai <question>\n\nExample: .ai What is the capital of France?');
      }
      
      const question = args.join(' ');
      
      const response = await APIs.chatAI(question);
      
      // Send only the answer without labels
      const answer = response.response || response.msg || response.data?.msg || response;
      await extra.reply(answer);
      
    } catch (error) {
      await extra.reply(`❌ AI Error: ${error.message}`);
    }
  }
};
