/**
 * AI Chat Command - Powered by OpenAI GPT
 */

const { askAI } = require('../../utils/openai');

module.exports = {
  name: 'ai',
  aliases: ['gpt', 'chatgpt'],
  category: 'ai',
  description: 'Chat with AI (powered by OpenAI GPT)',
  usage: '.ai <question>',
  permission: 'Everyone',
  location: 'Group & Private Chat',
  cooldown: 5,
  
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('❌ Usage: .ai <question>\n\nExample: .ai What is photosynthesis?');
    
    const question = args.join(' ');
    reply('🧿 *Consulting the Six Eyes...* ♾️');
    
    try {
      const answer = await askAI(question);
      await reply(answer);
    } catch (error) {
      await reply(`❌ AI Error: ${error.message}`);
    }
  }
};