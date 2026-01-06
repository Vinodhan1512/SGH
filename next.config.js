/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/SGH',
  assetPrefix: '/SGH/',
}

module.exports = nextConfig
