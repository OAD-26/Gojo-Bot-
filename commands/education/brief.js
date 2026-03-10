const axios = require('axios');

module.exports = {
  name: 'brief',
  category: 'education',
  description: 'Explain a topic in 2–3 sentences.',
  usage: '.brief <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Give me a topic to summarize.');
    
    const topic = args.join(' ');
    try {
      const prompt = `Explain "${topic}" in exactly 2-3 simple sentences.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "In short: knowledge is power.";
      
      const finalMsg = `🔍 *Brief Overview: ${topic}*\n\n${aiText}\n\n*- The essence of Infinity* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error summarizing topic.');
    }
  }
};