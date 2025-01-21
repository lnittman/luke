/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [],
  },
  experimental: {
    optimizeImages: true,
    optimizeCss: true,
  },
}

module.exports = nextConfig 