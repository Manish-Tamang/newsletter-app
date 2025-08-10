/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'cdn.tools.unlayer.com',
      'assets.unlayer.com',
      'tools.unlayer.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tools.unlayer.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.unlayer.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tools.unlayer.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
