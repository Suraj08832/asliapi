const { exec: execCallback } = require('child_process');
const util = require('util');
const exec = util.promisify(execCallback);

// Base yt-dlp command with common options
const YT_DLP_PATH = 'yt-dlp';
const YT_DLP_BASE = `${YT_DLP_PATH} --no-check-certificates --no-warnings`;

// Quality presets for single format selection
const QUALITY_PRESETS = {
  audio: 'bestaudio[ext=m4a]/bestaudio',
  highest: 'best[ext=mp4]/best',
  '1080p': 'best[height<=1080][ext=mp4]/best[height<=1080]',
  '720p': 'best[height<=720][ext=mp4]/best[height<=720]',
  '480p': 'best[height<=480][ext=mp4]/best[height<=480]',
  '360p': 'best[height<=360][ext=mp4]/best[height<=360]'
};

function extractYoutubeId(url) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (!match) throw new Error('Invalid YouTube URL');
  return match[1];
}

async function getVideoInfo(url) {
  try {
    // Use system yt-dlp command with additional options
    const { stdout, stderr } = await exec(`${YT_DLP_BASE} --format-sort quality --format best -j "${url}"`);
    if (stderr) {
      console.warn('yt-dlp stderr:', stderr);
    }
    const info = JSON.parse(stdout);

    return {
      title: info.title,
      description: info.description,
      duration: info.duration,
      thumbnail: info.thumbnail,
      formats: info.formats.map(format => ({
        formatId: format.format_id,
        ext: format.ext,
        resolution: format.resolution,
        filesize: format.filesize,
        vcodec: format.vcodec,
        acodec: format.acodec,
        quality: format.quality
      }))
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    throw error;
  }
}

async function getDownloadUrl(videoUrl, quality = 'highest') {
  try {
    // Get video info first
    const { stdout: infoStr, stderr: infoErr } = await exec(`${YT_DLP_BASE} -j "${videoUrl}"`);
    if (infoErr) {
      console.warn('yt-dlp info stderr:', infoErr);
    }
    const info = JSON.parse(infoStr);
    
    // Get format based on quality preset or use custom format
    const formatArg = QUALITY_PRESETS[quality] || quality;
    
    // Get direct URL with merged format
    const { stdout: urlOutput, stderr: urlErr } = await exec(`${YT_DLP_BASE} --format "${formatArg}" --get-url --no-playlist "${videoUrl}"`);
    if (urlErr) {
      console.warn('yt-dlp url stderr:', urlErr);
    }

    // Split URLs and get the appropriate one
    const urls = urlOutput.trim().split('\n');
    const downloadUrl = quality === 'audio' ? urls[0] : urls[urls.length - 1];

    return {
      url: downloadUrl,
      title: info.title,
      ext: quality === 'audio' ? 'm4a' : 'mp4',
      quality: quality,
      thumbnail: info.thumbnail,
      duration: info.duration,
      filesize: info.filesize
    };
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

module.exports = {
  extractYoutubeId,
  getVideoInfo,
  getDownloadUrl
}; 