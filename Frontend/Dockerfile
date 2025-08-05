# Use Node.js 24 alpine image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY qaba-frontend/package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY qaba-frontend/ .

# Build the application
RUN npm run build

# Remove devDependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]