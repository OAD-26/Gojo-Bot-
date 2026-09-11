const axios = require('axios');
const yts = require('yt-search');

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  Accept: '*/*'
};
const searchCache = new Map();
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;

function extractYouTubeId(value = '') {
  const match = String(value).match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/|v\/))([A-Za-z0-9_-]{11})/
  );
  return match?.[1] || null;
}

function getYouTubeUrl(value) {
  const id = extractYouTubeId(value);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

async function resolveYouTubeVideo(input) {
  const query = String(input || '').trim();
  if (!query) throw new Error('Please provide a song or video name.');

  const videoId = extractYouTubeId(query);
  if (videoId) {
    try {
      const video = await yts({ videoId });
      return { ...video, url: video.url || getYouTubeUrl(query) };
    } catch {
      return {
        url: getYouTubeUrl(query),
        title: 'YouTube video',
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hq720.jpg`
      };
    }
  }

  const results = await yts(query);
  if (!results?.videos?.length) throw new Error('No YouTube results found.');
  return results.videos[0];
}

async function searchYouTube(query, limit = 5) {
  const results = await yts(String(query || '').trim());
  return (results?.videos || []).slice(0, limit);
}

function saveSearchResults(chatId, videos) {
  if (!chatId || !Array.isArray(videos)) return;
  searchCache.set(chatId, { videos, savedAt: Date.now() });
}

function getSearchResult(chatId, index) {
  const cached = searchCache.get(chatId);
  if (!cached || Date.now() - cached.savedAt > SEARCH_CACHE_TTL_MS) {
    searchCache.delete(chatId);
    return null;
  }
  return cached.videos[index - 1] || null;
}

function pickDownloadUrl(data) {
  return data?.download ||
    data?.download_url ||
    data?.downloadUrl ||
    data?.dl ||
    data?.url ||
    data?.result?.download ||
    data?.result?.download_url ||
    data?.result?.url ||
    data?.data?.download ||
    data?.data?.download_url ||
    data?.data?.url ||
    null;
}

function getDownloadTitle(data, fallback = 'media') {
  return data?.title ||
    data?.name ||
    data?.result?.title ||
    data?.data?.title ||
    fallback;
}

function cleanFilename(value, fallback = 'media') {
  const cleaned = String(value || fallback)
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
  return cleaned || fallback;
}

async function downloadBuffer(url, options = {}) {
  if (!url) throw new Error('The media provider returned no download URL.');

  const maxBytes = options.maxBytes || 100 * 1024 * 1024;
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: options.timeout || 90000,
    maxContentLength: maxBytes,
    maxBodyLength: maxBytes,
    headers: { ...DEFAULT_HEADERS, ...(options.headers || {}) },
    validateStatus: status => status >= 200 && status < 300
  });

  const buffer = Buffer.from(response.data);
  if (!buffer.length) throw new Error('The downloaded media was empty.');
  if (buffer.length > maxBytes) throw new Error('The downloaded media is too large.');
  return buffer;
}

function formatViews(views) {
  if (!Number.isFinite(Number(views))) return 'unknown';
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(views));
}

module.exports = {
  extractYouTubeId,
  getYouTubeUrl,
  resolveYouTubeVideo,
  searchYouTube,
  saveSearchResults,
  getSearchResult,
  pickDownloadUrl,
  getDownloadTitle,
  cleanFilename,
  downloadBuffer,
  formatViews
};