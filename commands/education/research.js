const axios = require('axios');

module.exports = {
  name: 'research',
  category: 'education',
  description: 'Provide structured research information on a topic.',
  usage: '.research <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Research topic?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Provide structured research information on: "${topic}". Include background, current findings, and significance.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Digging deep into the archives...";
      
      const finalMsg = `🔬 *Research Findings: ${topic}*\n\n${aiText}\n\n*- Deeper understanding* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error conducting research.');
    }
  }
};