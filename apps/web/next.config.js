/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@copronomie/ui',
    '@copronomie/types'
  ],
  images: {
    domains: ['localhost']
  }
}

module.exports = nextConfig
