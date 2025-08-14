# Heroku Deployment Guide

This guide will help you deploy your YouTube Downloader API to Heroku.

## Prerequisites

1. **Heroku CLI** installed on your machine
2. **Git** repository initialized
3. **Heroku account** (free tier available)

## Step 1: Install Heroku CLI

Download and install from: https://devcenter.heroku.com/articles/heroku-cli

## Step 2: Login to Heroku

```bash
heroku login
```

## Step 3: Create Heroku App

```bash
# Create a new Heroku app
heroku create your-app-name

# Or let Heroku generate a random name
heroku create
```

## Step 4: Set Environment Variables

```bash
# Set your API key (replace 'your-secret-api-key' with your actual key)
heroku config:set API_KEY=your-secret-api-key

# Set environment to production
heroku config:set NODE_ENV=production
```

## Step 5: Deploy Using Docker

```bash
# Set the stack to container
heroku stack:set container

# Deploy your app
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

## Step 6: Verify Deployment

```bash
# Open your app in browser
heroku open

# Check logs
heroku logs --tail

# Check app status
heroku ps
```

## Step 7: Scale Your App (Optional)

```bash
# Scale to 1 dyno (free tier)
heroku ps:scale web=1
```

## Environment Variables

Make sure to set these in Heroku:

- `API_KEY`: Your secret API key for authentication
- `NODE_ENV`: Set to "production"
- `PORT`: Automatically set by Heroku

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check logs with `heroku logs --tail`
2. **yt-dlp Issues**: The Dockerfile installs yt-dlp automatically
3. **Port Issues**: Heroku sets PORT automatically
4. **Memory Issues**: Consider upgrading to paid dyno if needed

### Useful Commands:

```bash
# View logs
heroku logs --tail

# Restart app
heroku restart

# Check config vars
heroku config

# Run commands on dyno
heroku run node src/index.js

# Open Heroku dashboard
heroku dashboard
```

## API Usage After Deployment

Your API will be available at: `https://your-app-name.herokuapp.com`

Example usage:
```bash
# Health check
curl https://your-app-name.herokuapp.com/

# Get video info (with API key)
curl -H "X-API-Key: your-api-key" \
     https://your-app-name.herokuapp.com/api/info/VIDEO_ID
```

## Cost Considerations

- **Free Tier**: No longer available on Heroku
- **Basic Dyno**: $7/month
- **Standard Dyno**: $25/month

## Security Notes

1. Always use HTTPS in production
2. Keep your API key secure
3. Consider rate limiting for production use
4. Monitor your app usage and logs regularly
