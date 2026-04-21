/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // output: 'standalone',
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;