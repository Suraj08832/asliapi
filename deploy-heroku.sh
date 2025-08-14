#!/bin/bash

# Heroku Deployment Script for YouTube Downloader API
# Usage: ./deploy-heroku.sh [app-name] [api-key]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    print_error "Heroku CLI is not installed. Please install it first:"
    echo "https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run:"
    echo "git init"
    echo "git add ."
    echo "git commit -m 'Initial commit'"
    exit 1
fi

# Get app name and API key from arguments
APP_NAME=$1
API_KEY=$2

# If no app name provided, generate one
if [ -z "$APP_NAME" ]; then
    APP_NAME="youtube-dl-api-$(date +%s)"
    print_warning "No app name provided. Using generated name: $APP_NAME"
fi

# If no API key provided, prompt for one
if [ -z "$API_KEY" ]; then
    print_warning "No API key provided. Please enter your API key:"
    read -s API_KEY
    echo
fi

# Validate API key
if [ -z "$API_KEY" ]; then
    print_error "API key is required"
    exit 1
fi

print_status "Starting Heroku deployment..."

# Check if user is logged in to Heroku
if ! heroku auth:whoami &> /dev/null; then
    print_status "Please login to Heroku..."
    heroku login
fi

# Create Heroku app
print_status "Creating Heroku app: $APP_NAME"
heroku create "$APP_NAME" || {
    print_warning "App creation failed. Using existing app or generating new name..."
    heroku create
}

# Get the actual app name (in case it was auto-generated)
ACTUAL_APP_NAME=$(heroku apps:info --json | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
print_status "Using app: $ACTUAL_APP_NAME"

# Set stack to container
print_status "Setting stack to container..."
heroku stack:set container

# Set environment variables
print_status "Setting environment variables..."
heroku config:set API_KEY="$API_KEY"
heroku config:set NODE_ENV=production

# Add all files to git
print_status "Adding files to git..."
git add .

# Commit changes
print_status "Committing changes..."
git commit -m "Deploy to Heroku" || {
    print_warning "No changes to commit or commit failed. Continuing..."
}

# Deploy to Heroku
print_status "Deploying to Heroku..."
git push heroku main || git push heroku master

# Scale the app
print_status "Scaling app..."
heroku ps:scale web=1

# Wait a moment for the app to start
print_status "Waiting for app to start..."
sleep 10

# Check app status
print_status "Checking app status..."
heroku ps

# Get app URL
APP_URL=$(heroku info -s | grep web_url | cut -d= -f2)
print_status "Your app is deployed at: $APP_URL"

# Test the health endpoint
print_status "Testing health endpoint..."
if curl -s "$APP_URL" > /dev/null; then
    print_status "✅ App is running successfully!"
    echo
    echo "🎉 Deployment completed successfully!"
    echo "📱 App URL: $APP_URL"
    echo "🔑 API Key: $API_KEY"
    echo
    echo "📖 Next steps:"
    echo "1. Test your API: curl $APP_URL"
    echo "2. View logs: heroku logs --tail"
    echo "3. Open app: heroku open"
    echo "4. Monitor usage: heroku dashboard"
else
    print_warning "⚠️  App might still be starting up. Check logs with: heroku logs --tail"
fi

echo
print_status "Deployment script completed!"
