const config = require('../../config');
const { searchYouTube, saveSearchResults, formatViews } = require('../../utils/media');

module.exports = {
  name: 'find',
  aliases: ['ytsearch', 'yts', 'searchsong'],
  category: 'media',
  description: 'Search YouTube and show playable results',
  usage: '.find <song or video name>',

  async execute(sock, msg, args, extra) {
    const query = args.join(' ').trim();
    if (!query) {
      return extra.reply(`🔎 Usage: ${config.prefix}find <song or video name>\n\nExample: ${config.prefix}find Calm Down`);
    }

    try {
      const videos = await searchYouTube(query, 5);
      if (!videos.length) return extra.reply('❌ No YouTube results found.');
      saveSearchResults(extra.from, videos);

      const lines = videos.map((video, index) => [
        `${index + 1}. *${video.title}*`,
        `⏱️ ${video.timestamp || 'unknown'}  •  👁️ ${formatViews(video.views)} views`,
        `🔗 ${video.url}`
      ].join('\n'));

      await extra.reply(
        `🔎 *YouTube results for:* ${query}\n\n${lines.join('\n\n')}\n\n` +
        `Use ${config.prefix}play <number, title, or URL> to download audio.`
      );
    } catch (error) {
      console.error('Find command error:', error.message);
      await extra.reply('❌ YouTube search is unavailable right now. Please try again shortly.');
    }
  }
};