const axios = require('axios');

module.exports = {
  name: 'lesson',
  category: 'education',
  description: 'Teach a topic step-by-step.',
  usage: '.lesson <topic>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Which lesson should I teach?');
    
    const topic = args.join(' ');
    try {
      const prompt = `Act as a teacher. Teach the topic "${topic}" in 3 clear steps with an intro and summary.`;
      const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(prompt)}&lc=en`);
      const aiText = response.data.success || "Class is in session... wait.";
      
      const finalMsg = `👨‍🏫 *Lesson: ${topic}*\n\n${aiText}\n\n*- Knowledge expansion* ♾️`;
      reply(finalMsg);
    } catch (err) {
      reply('❌ Error conducting lesson.');
    }
  }
};