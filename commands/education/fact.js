module.exports = {
  name: 'fact',
  category: 'education',
  description: 'Send a random interesting educational fact.',
  usage: '.fact',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    const facts = [
      "The shortest war in history lasted only 38 minutes between Britain and Zanzibar.",
      "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
      "The fingerprints of koalas are so indistinguishable from humans that they have on occasion been confused at crime scenes.",
      "Venus is the only planet that rotates clockwise."
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    reply(`💡 *Did you know?*\n\n${fact}\n\n*- The Six Eyes see all* 🧿`);
  }
};