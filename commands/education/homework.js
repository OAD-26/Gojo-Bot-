const axios = require('axios');

module.exports = {
  name: 'homework',
  category: 'education',
  description: 'Help students solve homework with explanation.',
  usage: '.homework <question>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Show me your homework question.');
    
    const question = args.join(' ');
    try {
      const prompt = `Act as an AI homework helper. Help solve this question with a clear educational explanation: "${question}".`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Focus... the solution is near.";
      
      const finalMsg = `📚 *Homework Helper*\n\n${aiText}\n\n*- Keep studying!* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error assisting with homework.');
    }
  }
};