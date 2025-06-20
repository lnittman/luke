/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Enable SCSS modules
  sassOptions: {
    includePaths: ['./src/styles'],
  },
  // Next.js now supports PWA features natively through the file-based API
  // You can add headers if needed for PWA security, etc.
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
