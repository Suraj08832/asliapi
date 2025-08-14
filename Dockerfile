FROM node:18-slim

# Install required dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip ffmpeg curl wget && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    ln -sf /usr/local/bin/yt-dlp /usr/bin/yt-dlp && \
    pip3 install --upgrade pip && \
    pip3 install yt-dlp && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify yt-dlp installation and add to PATH
RUN yt-dlp --version && \
    which yt-dlp && \
    echo "yt-dlp version:" && yt-dlp --version

# Set environment variables
ENV PATH="/usr/local/bin:/usr/bin:${PATH}"

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Verify yt-dlp is accessible from the app directory
RUN yt-dlp --version

# Expose port
EXPOSE 3000

# Start command
CMD ["node", "src/index.js"]