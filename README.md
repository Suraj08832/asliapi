# YouTube API Downloader

A robust Node.js API service that allows you to download YouTube videos in various formats and qualities. Built with Express.js and yt-dlp.

## Features

- 🔐 Secure API key authentication
- 📹 Multiple video quality options (1080p, 720p, 480p, 360p)
- 🎵 Audio-only download support
- 🚀 Direct streaming support
- 🎯 Format selection
- 📝 Detailed video information
- 🔄 Automatic yt-dlp updates
- 🌐 Browser extension support (Tampermonkey)

## Prerequisites

- Node.js (v18 or higher)
- Python 3
- yt-dlp
- ffmpeg

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/youtube-api-dl.git
cd youtube-api-dl
```

2. Install dependencies:
```bash
npm install
```

3. Install system dependencies (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install python3 ffmpeg
pip3 install yt-dlp
```

For Fedora:
```bash
sudo dnf install python3 ffmpeg
pip3 install yt-dlp
```

4. Create environment file:
```bash
# Create .env file
echo "API_KEY=your_generated_64_character_key" > .env
```

## Configuration

1. Generate a secure API key (64 characters recommended)
2. Set up environment variables in `.env`:
```env
API_KEY=your_generated_64_character_key
PORT=3000  # Optional, defaults to 3000
```

## Usage

Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

### API Endpoints

All endpoints require the `X-API-Key` header for authentication.

1. Get Download URL:
```bash
curl -H "X-API-Key: your_api_key" "http://localhost:3000/api/download/VIDEO_ID?quality=720p"
```

2. Stream Video/Audio:
```bash
# Video download
curl -H "X-API-Key: your_api_key" "http://localhost:3000/api/stream/VIDEO_ID?quality=720p" --output video.mp4

# Audio download
curl -H "X-API-Key: your_api_key" "http://localhost:3000/api/stream/VIDEO_ID?quality=audio" --output audio.m4a
```

3. Get Video Information:
```bash
curl -H "X-API-Key: your_api_key" "http://localhost:3000/api/info/VIDEO_ID"
```

4. Get Available Formats:
```bash
curl -H "X-API-Key: your_api_key" "http://localhost:3000/api/formats/VIDEO_ID"
```

### Quality Options

- `audio` - Audio only (M4A format)
- `highest` - Best available quality
- `1080p` - Full HD
- `720p` - HD
- `480p` - Standard quality
- `360p` - Low quality

## Docker Deployment

Build and run with Docker:

```bash
# Build
docker build -t youtube-api-dl .

# Run
docker run -p 3000:3000 --env-file .env youtube-api-dl
```

## Railway Deployment

1. Fork this repository
2. Create a new project in Railway
3. Connect your GitHub repository
4. Add environment variable:
   - `API_KEY`: Your secure API key
5. Deploy!

## Security Notes

- Keep your API key secure and never commit it to the repository
- Use HTTPS in production
- Monitor API usage to prevent abuse
- Update dependencies regularly

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Browser Extension

A Tampermonkey userscript is available for easy downloading directly from YouTube:

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser
2. Create a new script in Tampermonkey
3. Copy the contents of `youtubeDownloaderClient.js` into the script editor
4. Update the following variables in the script:
   ```javascript
   const API_KEY = 'Your API Key';
   const API_BASE = 'Your API Base URL'; // e.g., 'https://your-railway-app.up.railway.app'
   ```
5. Save the script

### Features
- 📥 One-click download button on YouTube pages
- 🎚️ Quality selection dialog
- 📊 Download progress indicator
- 🔄 Direct download or get link options
- 💾 Supports all quality options (audio, 144p to 1080p)
- 🎨 Dark theme UI

### Usage
1. Navigate to any YouTube video
2. Click the Tampermonkey icon
3. Select "📥 Download Video"
4. Choose your preferred quality
5. Click "Download" for direct download or "Get Link" for the download URL 