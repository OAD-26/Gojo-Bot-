const axios = require('axios');

module.exports = {
  name: 'example',
  category: 'education',
  description: 'Provide helpful examples for understanding a topic.',
  usage: '.example <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Examples for which topic?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Provide 3 clear examples to help understand the topic: "${topic}".`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Examples are the bridge to understanding.";
      
      const finalMsg = `💡 *Examples for: ${topic}*\n\n${aiText}\n\n*- Real world applications* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error generating examples.');
    }
  }
};