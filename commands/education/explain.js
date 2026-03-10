const axios = require('axios');

module.exports = {
  name: 'explain',
  category: 'education',
  description: 'Explain a topic clearly with examples like an AI tutor.',
  usage: '.explain <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What topic shall we expand upon today?');
    
    const topic = args.join(' ');
    try {
      // Tutor Persona Prompting
      const prompt = `Act as an AI Tutor. Explain "${topic}" clearly. Include: 1. Clear explanation, 2. Key Points, 3. A helpful example. Use simple language.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Knowledge is infinite, but my connection is currently limited.";
      
      const finalMsg = `📘 *Topic: ${topic}*\n\n${aiText}\n\n*- Gojo Academy* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error generating explanation.');
    }
  }
};