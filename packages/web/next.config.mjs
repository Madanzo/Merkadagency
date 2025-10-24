/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@merkad/shared'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
