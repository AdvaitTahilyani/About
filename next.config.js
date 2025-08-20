/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable static export for development
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
