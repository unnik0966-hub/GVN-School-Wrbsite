const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const isStaticExport =
  process.env.STATIC_EXPORT === 'true' || process.env.GITHUB_ACTIONS === 'true';

/** @type {(phase: string) => import('next').NextConfig} */
module.exports = (phase) => ({
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
  output: isStaticExport ? 'export' : 'standalone',
  trailingSlash: isStaticExport,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ['tailwind-merge'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: 'memory' };
    }
    return config;
  },
});
