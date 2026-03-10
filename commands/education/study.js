const axios = require('axios');

module.exports = {
  name: 'study',
  category: 'education',
  description: 'Generate structured study notes on a topic.',
  usage: '.study <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Study notes for which topic?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Act as a study assistant. Provide structured, easy-to-read study notes for: "${topic}".`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Organizing the chaos into notes...";
      
      const finalMsg = `📖 *Study Guide: ${topic}*\n\n${aiText}\n\n*- Mastering the craft* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error generating study guide.');
    }
  }
};