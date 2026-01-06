/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Only use basePath for production builds (GitHub Pages)
  // For local development, comment out or remove basePath
  // basePath: '/SGH',
  // assetPrefix: '/SGH/',
}

module.exports = nextConfig
