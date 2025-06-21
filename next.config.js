/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving from the /public directory
  images: {
    // This allows Next.js to optimize and serve images from the public directory
    domains: ['localhost'],
    // Configure remotePatterns if needed for external image URLs
    remotePatterns: []
  },
  // Configure webpack to handle file uploads
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      type: 'asset',
    });
    return config;
  },
}

module.exports = nextConfig
