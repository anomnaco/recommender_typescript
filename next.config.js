/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
  images: {
    domains: ['images-na.ssl-images-amazon.com']
  },
  reactStrictMode: false,
}

module.exports = nextConfig