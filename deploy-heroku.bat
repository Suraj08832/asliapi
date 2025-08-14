@echo off
setlocal enabledelayedexpansion

REM Heroku Deployment Script for YouTube Downloader API (Windows)
REM Usage: deploy-heroku.bat [app-name] [api-key]

echo [INFO] Starting Heroku deployment...

REM Check if Heroku CLI is installed
heroku --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Heroku CLI is not installed. Please install it first:
    echo https://devcenter.heroku.com/articles/heroku-cli
    pause
    exit /b 1
)

REM Check if git is initialized
if not exist ".git" (
    echo [ERROR] Git repository not initialized. Please run:
    echo git init
    echo git add .
    echo git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Get app name and API key from arguments
set APP_NAME=%1
set API_KEY=%2

REM If no app name provided, generate one
if "%APP_NAME%"=="" (
    set APP_NAME=youtube-dl-api-%RANDOM%
    echo [WARNING] No app name provided. Using generated name: %APP_NAME%
)

REM If no API key provided, prompt for one
if "%API_KEY%"=="" (
    echo [WARNING] No API key provided. Please enter your API key:
    set /p API_KEY=
)

REM Validate API key
if "%API_KEY%"=="" (
    echo [ERROR] API key is required
    pause
    exit /b 1
)

echo [INFO] Starting Heroku deployment...

REM Check if user is logged in to Heroku
heroku auth:whoami >nul 2>&1
if errorlevel 1 (
    echo [INFO] Please login to Heroku...
    heroku login
)

REM Create Heroku app
echo [INFO] Creating Heroku app: %APP_NAME%
heroku create "%APP_NAME%" 2>nul
if errorlevel 1 (
    echo [WARNING] App creation failed. Using existing app or generating new name...
    heroku create
)

REM Set stack to container
echo [INFO] Setting stack to container...
heroku stack:set container

REM Set environment variables
echo [INFO] Setting environment variables...
heroku config:set API_KEY="%API_KEY%"
heroku config:set NODE_ENV=production

REM Add all files to git
echo [INFO] Adding files to git...
git add .

REM Commit changes
echo [INFO] Committing changes...
git commit -m "Deploy to Heroku" 2>nul
if errorlevel 1 (
    echo [WARNING] No changes to commit or commit failed. Continuing...
)

REM Deploy to Heroku
echo [INFO] Deploying to Heroku...
git push heroku main 2>nul
if errorlevel 1 (
    git push heroku master
)

REM Scale the app
echo [INFO] Scaling app...
heroku ps:scale web=1

REM Wait a moment for the app to start
echo [INFO] Waiting for app to start...
timeout /t 10 /nobreak >nul

REM Check app status
echo [INFO] Checking app status...
heroku ps

REM Get app URL
for /f "tokens=2 delims==" %%i in ('heroku info -s ^| findstr web_url') do set APP_URL=%%i
echo [INFO] Your app is deployed at: %APP_URL%

REM Test the health endpoint
echo [INFO] Testing health endpoint...
curl -s "%APP_URL%" >nul 2>&1
if errorlevel 1 (
    echo [WARNING] ⚠️  App might still be starting up. Check logs with: heroku logs --tail
) else (
    echo [INFO] ✅ App is running successfully!
    echo.
    echo 🎉 Deployment completed successfully!
    echo 📱 App URL: %APP_URL%
    echo 🔑 API Key: %API_KEY%
    echo.
    echo 📖 Next steps:
    echo 1. Test your API: curl %APP_URL%
    echo 2. View logs: heroku logs --tail
    echo 3. Open app: heroku open
    echo 4. Monitor usage: heroku dashboard
)

echo.
echo [INFO] Deployment script completed!
pause
