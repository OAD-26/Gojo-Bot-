/**
 * Song Downloader - Download audio from YouTube.
 */

const APIs = require('../../utils/api');
const { toAudio } = require('../../utils/converter');
const {
  resolveYouTubeVideo,
  pickDownloadUrl,
  getDownloadTitle,
  cleanFilename,
  downloadBuffer,
  getSearchResult
} = require('../../utils/media');

function detectAudioFormat(buffer) {
  if (buffer.toString('ascii', 0, 3) === 'ID3' ||
      (buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)) {
    return { extension: 'mp3', mimetype: 'audio/mpeg' };
  }
  if (buffer.toString('ascii', 0, 4) === 'OggS') {
    return { extension: 'ogg', mimetype: 'audio/ogg; codecs=opus' };
  }
  if (buffer.toString('ascii', 0, 4) === 'RIFF') {
    return { extension: 'wav', mimetype: 'audio/wav' };
  }
  if (buffer.toString('ascii', 4, 8) === 'ftyp') {
    return { extension: 'm4a', mimetype: 'audio/mp4' };
  }
  return { extension: 'm4a', mimetype: 'audio/mp4' };
}

module.exports = {
  name: 'song',
  aliases: ['play', 'music', 'yta'],
  category: 'media',
  description: 'Download audio from YouTube',
  usage: '.play <song name or YouTube link>',

  async execute(sock, msg, args, extra) {
    const query = args.join(' ').trim();
    const chatId = extra.from;

    if (!query) {
      return extra.reply('🎵 Please provide a song name or YouTube link.\n\nExample: .play Calm Down');
    }

    try {
      const selectedNumber = /^\d+$/.test(args[0] || '') ? Number(args[0]) : 0;
      const selectedVideo = selectedNumber > 0
        ? getSearchResult(chatId, selectedNumber)
        : null;
      const video = selectedVideo || await resolveYouTubeVideo(query);
      if (video.thumbnail) {
        await sock.sendMessage(chatId, {
          image: { url: video.thumbnail },
          caption: `🎵 *${video.title}*\n⏱️ ${video.timestamp || 'unknown'}\n\nDownloading audio...`
        }, { quoted: msg });
      } else {
        await extra.reply(`🎵 Downloading *${video.title}*...`);
      }

      const providers = [
        ['EliteProTech', () => APIs.getEliteProTechDownloadByUrl(video.url)],
        ['Yupra', () => APIs.getYupraDownloadByUrl(video.url)],
        ['Okatsu', () => APIs.getOkatsuDownloadByUrl(video.url)],
        ['Izumi', () => APIs.getIzumiDownloadByUrl(video.url)]
      ];

      let audioBuffer;
      let audioData;
      let lastError;

      for (const [provider, getAudio] of providers) {
        try {
          const data = await getAudio();
          const url = pickDownloadUrl(data);
          if (!url) throw new Error('no download URL');
          audioBuffer = await downloadBuffer(url, { maxBytes: 64 * 1024 * 1024 });
          audioData = data;
          console.log(`Song download succeeded through ${provider}`);
          break;
        } catch (error) {
          lastError = error;
          console.warn(`Song provider ${provider} failed: ${error.message}`);
        }
      }

      if (!audioBuffer) {
        throw new Error(lastError?.message || 'All song download sources failed.');
      }

      const detected = detectAudioFormat(audioBuffer);
      let finalBuffer = audioBuffer;
      let finalMimetype = detected.mimetype;
      let finalExtension = detected.extension;

      if (detected.extension !== 'mp3') {
        finalBuffer = await toAudio(audioBuffer, detected.extension);
        if (!finalBuffer?.length) throw new Error('Audio conversion returned an empty file.');
        finalMimetype = 'audio/mpeg';
        finalExtension = 'mp3';
      }

      const title = getDownloadTitle(audioData, video.title);
      await sock.sendMessage(chatId, {
        audio: finalBuffer,
        mimetype: finalMimetype,
        fileName: `${cleanFilename(title, 'song')}.${finalExtension}`,
        ptt: false
      }, { quoted: msg });
    } catch (error) {
      console.error('Song command error:', error);
      await extra.reply(`❌ Could not download that song.\n\n${error.message || 'All download sources failed.'}`);
    }
  }
};