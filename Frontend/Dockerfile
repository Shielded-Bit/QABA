# Stage 1: Build the frontend
FROM node:24-alpine AS build
WORKDIR /app

# Copy and install dependencies
COPY qaba-frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY qaba-frontend/ .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy built files to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
