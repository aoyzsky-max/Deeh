# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine

# Install system dependencies needed for yt-dlp
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    wget \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Install yt-dlp
RUN pip3 install --no-cache-dir yt-dlp

# Verify yt-dlp installation
RUN yt-dlp --version

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy application files
COPY server.js ./

# Expose port (Railway will set PORT env var)
EXPOSE 3001

# Set default port (Railway will override with PORT env var)
ENV PORT=3001
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]

