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
COPY package*.json ./

# Remove package-lock.json if it exists to avoid conflicts
RUN rm -f package-lock.json

# Install Node.js dependencies
# Use --legacy-peer-deps to handle any peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Build Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production
ENV PORT=3000

# Start the application
CMD ["npm", "start"]

