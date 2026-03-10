const axios = require('axios');

module.exports = {
  name: 'solve',
  category: 'education',
  description: 'Solve math or logical problems step-by-step.',
  usage: '.solve <problem>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Please provide a problem to solve.');
    
    const problem = args.join(' ');
    try {
      const prompt = `Act as a math/logic tutor. Solve this problem step-by-step with explanation: "${problem}".`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Thinking... the logic is shifting.";
      
      const finalMsg = `🧩 *Step-by-Step Solution*\n\n${aiText}\n\n*- Clear your mind* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error solving the problem.');
    }
  }
};