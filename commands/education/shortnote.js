const axios = require('axios');

module.exports = {
  name: 'shortnote',
  category: 'education',
  description: 'Return quick revision notes on a topic.',
  usage: '.shortnote <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Which topic needs revision notes?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Act as a tutor. Provide quick, structured revision notes for the topic: "${topic}". Use bullet points.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Condensing the infinite knowledge... wait.";
      
      const finalMsg = `📝 *Quick Revision Notes: ${topic}*\n\n${aiText}\n\n*- Study efficient* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error generating notes.');
    }
  }
};