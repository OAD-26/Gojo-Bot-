const axios = require('axios');

module.exports = {
  name: 'ask',
  category: 'education',
  description: 'Answer any educational question clearly like an AI tutor.',
  usage: '.ask <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What would you like to ask your tutor today?');
    
    const query = args.join(' ');
    try {
      const prompt = `Act as an AI Tutor. Answer this question clearly and educationally: "${query}". Include 1. Explanation, 2. Key Points, 3. Example.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "My knowledge is vast, but my connection is fleeting.";
      
      const finalMsg = `🎓 *AI Tutor Answer*\n\n${aiText}\n\n*- Gojo Academy* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error answering your question.');
    }
  }
};