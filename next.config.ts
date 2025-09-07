// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ❗️Abaikan error TypeScript saat build (tidak untuk production serius)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ❗️Abaikan error ESLint saat build
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      { source: '/search', destination: '/Search', permanent: true },
      { source: '/movie/:id', destination: '/Movie/:id', permanent: true },
      { source: '/tv/:id', destination: '/Tv/:id', permanent: true },
      { source: '/watch/:id', destination: '/Watch/:id', permanent: true },
      // ejaan: arahkan yang benar ke yang ada saat ini (atau ubah folder nanti)
      { source: '/release-year', destination: '/realease-year', permanent: true },
    ];
  },
};

module.exports = nextConfig;
