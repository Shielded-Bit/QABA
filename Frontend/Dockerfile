# Stage 1: Install dependencies and build Next.js
FROM node:24-alpine AS build
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NODE_OPTIONS="--max_old_space_size=2048" \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "NEXT_PUBLIC_API_URL is required" && exit 1)

# Copy and install dependencies
COPY qaba-frontend/package*.json ./

RUN npm ci --no-audit --no-fund

# Copy source and build
COPY qaba-frontend/ .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Production runner using Next.js standalone
FROM node:24-alpine AS runner
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy standalone server and minimal assets
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Expose Next.js default port
EXPOSE 3000

# Run standalone server
CMD ["node", "server.js"]
