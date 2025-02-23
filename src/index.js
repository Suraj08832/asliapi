require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const youtubeRoutes = require('./routes/youtube.routes');
const authenticate = require('./middleware/auth');

const app = express();

// Clear problematic Python environment variables
delete process.env.PYTHONPATH;
delete process.env.PYTHONHOME;

// Update yt-dlp at startup
exec('yt-dlp -U', (error, stdout, stderr) => {
    if (error) {
        console.warn('Warning: Failed to update yt-dlp:', error);
    } else {
        console.log('yt-dlp update result:', stdout);
    }
});

// Debug environment variables at startup
console.log('Environment Variables Check:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    API_KEY_EXISTS: !!process.env.API_KEY,
    ALL_ENV_KEYS: Object.keys(process.env)
});

// Don't exit if API_KEY is not set, just log warning
if (!process.env.API_KEY) {
    console.warn('WARNING: API_KEY environment variable is not set!');
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (no auth required)
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'YouTube Download API is running',
        environment: process.env.NODE_ENV || 'development',
        api_key_configured: !!process.env.API_KEY,
        endpoints: {
            info: '/api/info/:videoId',
            formats: '/api/formats/:videoId',
            download: '/api/download/:videoId?format=:format',
            debug: '/api/debug/auth'
        },
        auth: {
            required: true,
            header: 'X-API-Key'
        }
    });
});

// Debug route to verify API key configuration
app.get('/api/debug/auth', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Auth debug information',
        debug: {
            headers: req.headers,
            apiKeyConfigured: !!process.env.API_KEY,
            apiKeyLength: process.env.API_KEY ? process.env.API_KEY.length : 0,
            receivedKeyLength: req.headers['x-api-key'] ? req.headers['x-api-key'].length : 0,
            environment: process.env.NODE_ENV,
            availableEnvVars: Object.keys(process.env)
        }
    });
});

// Protected routes
app.use('/api', authenticate, youtubeRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Configuration:', {
        environment: process.env.NODE_ENV || 'development',
        apiKeyConfigured: !!process.env.API_KEY,
        port: PORT
    });
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    process.exit(0);
});