const express = require('express');
const https = require('https');
const { getVideoInfo, getDownloadUrl, extractYoutubeId } = require('../utils/youtube-processor');

const router = express.Router();

// Get video formats
router.get('/formats/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await getVideoInfo(url);
        res.json(info);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to get video formats',
            message: error.message
        });
    }
});

// Download video
router.get('/download/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const { quality = 'highest' } = req.query;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        
        const downloadInfo = await getDownloadUrl(url, quality);
        
        res.json({
            status: 'success',
            download_url: downloadInfo.url,
            title: downloadInfo.title,
            ext: downloadInfo.ext,
            quality: downloadInfo.quality,
            thumbnail: downloadInfo.thumbnail,
            duration: downloadInfo.duration,
            available_qualities: [
                'audio',
                'highest',
                '1080p',
                '720p',
                '480p',
                '360p'
            ]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to get download URL',
            message: error.message
        });
    }
});

// Get video info
router.get('/info/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await getVideoInfo(url);
        res.json(info);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to get video info',
            message: error.message
        });
    }
});

// Stream video
router.get('/stream/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const { quality = 'highest' } = req.query;
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        
        const downloadInfo = await getDownloadUrl(url, quality);
        
        // Set appropriate headers
        res.setHeader('Content-Type', quality === 'audio' ? 'audio/mp4' : 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${downloadInfo.title}.${downloadInfo.ext}"`);
        
        // Create a stream from the video URL and pipe it to the response
        https.get(downloadInfo.url, (videoStream) => {
            videoStream.pipe(res);
            
            // Handle errors during streaming
            videoStream.on('error', (error) => {
                console.error('Stream error:', error);
                if (!res.headersSent) {
                    res.status(500).json({
                        error: 'Streaming failed',
                        message: error.message
                    });
                }
            });
        }).on('error', (error) => {
            console.error('HTTPS request error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    error: 'Failed to start stream',
                    message: error.message
                });
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Failed to stream video',
            message: error.message
        });
    }
});

module.exports = router; 