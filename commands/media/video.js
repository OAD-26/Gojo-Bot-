/**
 * Video Downloader - Download video from YouTube.
 */

const config = require('../../config');
const APIs = require('../../utils/api');
const {
  resolveYouTubeVideo,
  pickDownloadUrl,
  getDownloadTitle,
  cleanFilename,
  downloadBuffer
} = require('../../utils/media');

module.exports = {
  name: 'ytvideo',
  aliases: ['ytv', 'ytmp4', 'ytvid', 'video'],
  category: 'media',
  description: 'Download a video from YouTube',
  usage: '.video <video name or YouTube link>',

  async execute(sock, msg, args, extra) {
    const query = args.join(' ').trim();
    const chatId = extra.from;

    if (!query) {
      return extra.reply(`🎬 Usage: ${config.prefix}video <video name or YouTube link>`);
    }

    try {
      const video = await resolveYouTubeVideo(query);
      await extra.reply(`🎬 Downloading *${video.title}*${video.timestamp ? ` (${video.timestamp})` : ''}...`);

      const providers = [
        ['EliteProTech', () => APIs.getEliteProTechVideoByUrl(video.url)],
        ['Yupra', () => APIs.getYupraVideoByUrl(video.url)],
        ['Okatsu', () => APIs.getOkatsuVideoByUrl(video.url)]
      ];

      let videoData;
      let downloadUrl;
      let lastError;

      for (const [provider, getVideo] of providers) {
        try {
          const data = await getVideo();
          const url = pickDownloadUrl(data);
          if (!url) throw new Error('no download URL');
          videoData = data;
          downloadUrl = url;
          console.log(`Video download URL obtained through ${provider}`);
          break;
        } catch (error) {
          lastError = error;
          console.warn(`Video provider ${provider} failed: ${error.message}`);
        }
      }

      if (!downloadUrl) throw new Error(lastError?.message || 'All video download sources failed.');

      const title = getDownloadTitle(videoData, video.title);
      const caption = `🎬 *${title}*\n\n> Downloaded by ${config.botName}`;

      try {
        await sock.sendMessage(chatId, {
          video: { url: downloadUrl },
          mimetype: 'video/mp4',
          fileName: `${cleanFilename(title, 'video')}.mp4`,
          caption
        }, { quoted: msg });
      } catch (urlError) {
        console.warn('Direct video send failed; retrying with a buffer:', urlError.message);
        const buffer = await downloadBuffer(downloadUrl, { maxBytes: 100 * 1024 * 1024 });
        await sock.sendMessage(chatId, {
          video: buffer,
          mimetype: 'video/mp4',
          fileName: `${cleanFilename(title, 'video')}.mp4`,
          caption
        }, { quoted: msg });
      }
    } catch (error) {
      console.error('Video command error:', error);
      await extra.reply(`❌ Could not download that video.\n\n${error.message || 'All download sources failed.'}`);
    }
  }
};