# YouTube API Downloader Documentation

This API allows you to download YouTube videos in various formats and qualities. It provides endpoints for getting video information, available formats, and download URLs.

## Authentication

All API requests require an API key to be sent in the header:

```http
X-API-Key: your_api_key_here
```

## Base URL

```
https://youtubeapidownloader-production.up.railway.app
```

## Endpoints

### 1. Get Download URL

Get a direct download URL for a YouTube video in your desired quality.

```http
GET /api/download/:videoId
```

#### Parameters

- `videoId` (path parameter) - The YouTube video ID (e.g., "jNQXAC9IVRw" from "https://www.youtube.com/watch?v=jNQXAC9IVRw")
- `quality` (query parameter, optional) - The desired video quality

#### Quality Options

- `audio` - Audio only (M4A format)
- `highest` - Best available quality (MP4)
- `1080p` - Up to 1080p (MP4)
- `720p` - Up to 720p (MP4)
- `480p` - Up to 480p (MP4)
- `360p` - Up to 360p (MP4)

#### Example Request

```bash
# Download highest quality
curl -H "X-API-Key: your_api_key" "https://youtubeapidownloader-production.up.railway.app/api/download/jNQXAC9IVRw"

# Download specific quality
curl -H "X-API-Key: your_api_key" "https://youtubeapidownloader-production.up.railway.app/api/download/jNQXAC9IVRw?quality=720p"

# Download audio only
curl -H "X-API-Key: your_api_key" "https://youtubeapidownloader-production.up.railway.app/api/download/jNQXAC9IVRw?quality=audio"
```

#### Success Response

```json
{
    "status": "success",
    "download_url": "https://example.com/video.mp4",
    "title": "Video Title",
    "ext": "mp4",  // or "m4a" for audio
    "quality": "720p",
    "thumbnail": "https://example.com/thumbnail.jpg",
    "duration": 19,
    "available_qualities": [
        "audio",
        "highest",
        "1080p",
        "720p",
        "480p",
        "360p"
    ]
}
```

### 2. Get Video Information

Get detailed information about a YouTube video.

```http
GET /api/info/:videoId
```

#### Parameters

- `videoId` (path parameter) - The YouTube video ID

#### Example Request

```bash
curl -H "X-API-Key: your_api_key" "https://youtubeapidownloader-production.up.railway.app/api/info/jNQXAC9IVRw"
```

#### Success Response

```json
{
    "title": "Video Title",
    "description": "Video Description",
    "duration": 19,
    "thumbnail": "https://example.com/thumbnail.jpg",
    "formats": [
        {
            "formatId": "22",
            "ext": "mp4",
            "resolution": "720p",
            "filesize": 1234567,
            "vcodec": "avc1.64001F",
            "acodec": "mp4a.40.2",
            "quality": "hd720"
        }
        // ... more formats
    ]
}
```

### 3. Get Available Formats

Get a list of all available formats for a YouTube video.

```http
GET /api/formats/:videoId
```

#### Parameters

- `videoId` (path parameter) - The YouTube video ID

#### Example Request

```bash
curl -H "X-API-Key: your_api_key" "https://youtubeapidownloader-production.up.railway.app/api/formats/jNQXAC9IVRw"
```

#### Success Response

Same as the video information response.

## Error Responses

All endpoints may return the following error responses:

```json
{
    "error": "Error Type",
    "message": "Detailed error message"
}
```

Common error types:
- Invalid API Key
- Invalid Video ID
- Video Not Found
- Failed to get download URL
- Failed to get video info

## Rate Limiting

Please be mindful of rate limiting and fair usage. Excessive requests may be throttled.

## Notes

1. Download URLs are temporary and expire after some time
2. Some videos may not be available in all quality options
3. Audio-only downloads are provided in M4A format for best quality
4. The API automatically handles YouTube's adaptive formats and merges them when necessary

## Example Implementation

Here's a simple example using JavaScript/Node.js:

```javascript
async function downloadVideo(videoId, quality = 'highest') {
    const response = await fetch(
        `https://youtubeapidownloader-production.up.railway.app/api/download/${videoId}?quality=${quality}`,
        {
            headers: {
                'X-API-Key': 'your_api_key'
            }
        }
    );
    const data = await response.json();
    return data.download_url;
}
``` 