const axios = require('axios');

module.exports = {
  name: 'essay',
  category: 'education',
  description: 'Write a short structured essay on a topic.',
  usage: '.essay <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ What should the essay be about?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Write a short, structured educational essay on: "${topic}". Include introduction, body, and conclusion.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Writing... the flow of knowledge.";
      
      const finalMsg = `✍️ *Structured Essay: ${topic}*\n\n${aiText}\n\n*- The written word* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error writing essay.');
    }
  }
};