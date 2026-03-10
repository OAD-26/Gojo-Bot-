const axios = require('axios');
const config = require('../../config');

module.exports = {
  name: 'explain',
  category: 'education',
  description: 'Give a clear and simple explanation of the topic.',
  usage: '.explain <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Please provide a topic to explain.');
    const topic = args.join(' ');
    try {
      const prompt = `Explain the following topic in a clear and simple way for a student: ${topic}. Format with Gojo style emojis.`;
      // Placeholder for AI integration - using a public free API or similar logic
      // In a real scenario, this would call OpenAI/Gemini
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const text = response.data.success || `✨ *Explanation for ${topic}:*\n\n(AI service is warming up, please try again in a moment! ♾️)`;
      reply(text);
    } catch (err) {
      reply('❌ Error generating explanation.');
    }
  }
};