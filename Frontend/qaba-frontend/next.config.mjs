/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '8mb', // Increase from default 1mb to 8mb
    },
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
};

export default nextConfig;