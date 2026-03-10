module.exports = {
  name: 'word',
  category: 'education',
  description: 'Send word of the day with meaning and example.',
  usage: '.word',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    const words = [
      { w: "Ephemeral", m: "Lasting for a very short time.", e: "The beauty of the sunset was ephemeral." },
      { w: "Eloquent", m: "Fluent or persuasive in speaking or writing.", e: "She made an eloquent plea for peace." },
      { w: "Resilient", m: "Able to withstand or recover quickly from difficult conditions.", e: "The community was remarkably resilient after the storm." }
    ];
    const item = words[Math.floor(Math.random() * words.length)];
    reply(`🔤 *Word of the Day: ${item.w}*\n\n📖 *Meaning:* ${item.m}\n✨ *Example:* ${item.e}\n\n*- Expand your vocabulary* ♾️`);
  }
};