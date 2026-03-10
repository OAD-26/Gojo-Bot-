const axios = require('axios');

module.exports = {
  name: 'ai',
  category: 'education',
  description: 'General AI assistant for all your questions.',
  usage: '.ai <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('🤞 *Infinite Void.* Please provide a question for the Six Eyes to analyze.');
    
    const query = args.join(' ');
    try {
      // Using a more reliable free AI API or placeholder logic for the tutor persona
      // In a real production bot, you'd use OpenAI/Claude/Gemini API keys from config
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(query)}&lc=en`);
      const aiResponse = response.data.success || "I am currently meditating in the Infinite Void. Please try again in a moment.";
      
      const formattedResponse = `🎓 *Gojo AI Tutor* ♾️\n\n${aiResponse}\n\n*- The Honored One* ✨`;
      reply(formattedResponse);
    } catch (err) {
      console.error('AI Error:', err);
      reply('❌ *Cursed Technique Error.* The AI tutor is currently unavailable.');
    }
  }
};