/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  reactCompiler: true,
  serverExternalPackages: ['puppeteer'],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;