module.exports = {
  name: 'define',
  category: 'education',
  description: 'Return a dictionary-style definition.',
  usage: '.define <word>',
  permission: 'Everyone',
  async execute(sock, msg, args, { reply }) {
    if (!args.length) return reply('⚠️ Please provide a word to define.');
    const word = args[0];
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then(res => res.json());
      if (response.title === 'No Definitions Found') return reply(`❌ No definition found for "${word}".`);
      const def = response[0].meanings[0].definitions[0].definition;
      const example = response[0].meanings[0].definitions[0].example ? `\n\n*Example:* ${response[0].meanings[0].definitions[0].example}` : '';
      reply(`📖 *Definition of ${word}:*\n\n${def}${example}\n\n*- Gojo Educational Services* ♾️`);
    } catch (err) {
      reply('❌ Error fetching definition.');
    }
  }
};