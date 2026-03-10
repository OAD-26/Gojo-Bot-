const axios = require('axios');

module.exports = {
  name: 'quiz',
  category: 'education',
  description: 'Generate a quiz with answers on a topic.',
  usage: '.quiz <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ A quiz on which topic?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Generate a 3-question quiz on "${topic}" with answers provided at the bottom.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Testing your limits... wait.";
      
      const finalMsg = `📝 *Quiz Time: ${topic}*\n\n${aiText}\n\n*- Challenge yourself* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error generating quiz.');
    }
  }
};