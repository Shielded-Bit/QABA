# Use Node.js 24 alpine image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Define build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Set environment variables from build args
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

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