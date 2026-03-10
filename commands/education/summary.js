const axios = require('axios');

module.exports = {
  name: 'summary',
  category: 'education',
  description: 'Provide a clear summarized explanation.',
  usage: '.summary <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Provide a topic to summarize.');
    
    const topic = args.join(' ');
    try {
      const prompt = `Act as a teacher. Provide a clear, concise summary of: "${topic}".`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Summarizing... please wait.";
      
      const finalMsg = `📋 *Summary: ${topic}*\n\n${aiText}\n\n*- Captured in the Void* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error summarizing.');
    }
  }
};