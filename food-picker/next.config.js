/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.themealdb.com', 'world.openfoodfacts.org','images.clerk.dev'],
  },
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.themealdb.com/api/json/v1/1/:path*',
      },
    ]
  },
}

module.exports = nextConfig