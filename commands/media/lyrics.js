/**
 * Lyrics Finder.
 */

const axios = require('axios');
const config = require('../../config');

function normalizeLyrics(data) {
  if (!data) return null;
  const lyrics = data.plainLyrics || data.lyrics || data.text;
  if (!lyrics || typeof lyrics !== 'string') return null;

  return {
    title: data.trackName || data.title || data.name || 'Unknown song',
    artist: data.artistName || data.artist || 'Unknown artist',
    lyrics: lyrics.trim(),
    thumbnail: data.thumbnail || data.image || data.albumArt || null
  };
}

async function getFromLrcLib(query) {
  const response = await axios.get('https://lrclib.net/api/search', {
    params: { track_name: query },
    timeout: 15000,
    headers: { 'User-Agent': 'GOJO-BOT/1.1' }
  });
  const result = Array.isArray(response.data)
    ? response.data.find(item => item.plainLyrics || item.syncedLyrics)
    : null;
  if (!result) return null;
  if (!result.plainLyrics && result.syncedLyrics) {
    result.plainLyrics = result.syncedLyrics
      .replace(/\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]\s*/g, '\n')
      .trim();
  }
  return normalizeLyrics(result);
}

async function getFromLegacyProviders(query) {
  const providers = [
    async () => {
      const response = await axios.get('https://api.vreden.my.id/api/lyrics', {
        params: { query },
        timeout: 15000
      });
      return normalizeLyrics(response.data?.result);
    },
    async () => {
      const response = await axios.get('https://api.siputzx.my.id/api/s/lyrics', {
        params: { query },
        timeout: 15000
      });
      return normalizeLyrics(response.data?.data);
    }
  ];

  for (const provider of providers) {
    try {
      const result = await provider();
      if (result) return result;
    } catch (error) {
      console.warn('Lyrics provider failed:', error.message);
    }
  }
  return null;
}

module.exports = {
  name: 'lyrics',
  aliases: ['lyric', 'lirik', 'songlyrics'],
  category: 'media',
  description: 'Find lyrics for a song',
  usage: '.lyrics <song name>',

  async execute(sock, msg, args, extra) {
    const query = args.join(' ').trim();
    if (!query) {
      return extra.reply(`📝 Usage: ${config.prefix}lyrics <song name>\n\nExample: ${config.prefix}lyrics Adele Hello`);
    }

    try {
      const lyricsData = await getFromLrcLib(query) || await getFromLegacyProviders(query);
      if (!lyricsData) return extra.reply(`❌ I could not find lyrics for *${query}*.`);

      const lyrics = lyricsData.lyrics.length > 5000
        ? `${lyricsData.lyrics.slice(0, 5000)}...\n\n_Lyrics truncated to fit WhatsApp._`
        : lyricsData.lyrics;
      const caption = `🎵 *${lyricsData.title}*\n👤 *Artist:* ${lyricsData.artist}\n\n📝 *Lyrics:*\n${lyrics}\n\n_Fetched by ${config.botName}_`;

      if (lyricsData.thumbnail) {
        await sock.sendMessage(extra.from, {
          image: { url: lyricsData.thumbnail },
          caption
        }, { quoted: msg });
      } else {
        await extra.reply(caption);
      }
    } catch (error) {
      console.error('Lyrics command error:', error);
      await extra.reply('❌ Lyrics services are unavailable right now. Please try again later.');
    }
  }
};