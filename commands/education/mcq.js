const axios = require('axios');

module.exports = {
  name: 'mcq',
  category: 'education',
  description: 'Generate multiple choice questions on a topic.',
  usage: '.mcq <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ MCQs for which topic?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Generate 3 Multiple Choice Questions on "${topic}" with options A, B, C, D and the correct answer.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Calculating options...";
      
      const finalMsg = `🔘 *MCQ Challenge: ${topic}*\n\n${aiText}\n\n*- Pick the right path* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error generating MCQs.');
    }
  }
};