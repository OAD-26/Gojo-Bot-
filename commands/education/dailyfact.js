module.exports = {
  name: 'dailyfact',
  category: 'education',
  description: 'Send a random educational fact.',
  usage: '.dailyfact',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    const facts = [
      "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old!",
      "Octopuses have three hearts.",
      "A day on Venus is longer than a year on Venus.",
      "Bananas are berries, but strawberries aren't."
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    reply(`💡 *Daily Fact:* \n\n${fact}\n\n*- Stay Curious!* ♾️✨`);
  }
};