/** @type {import('next').NextConfig} */

const docsBaseUrl = process.env.NEXT_PUBLIC_DOCS_URL
  ? process.env.NEXT_PUBLIC_DOCS_URL.replace(/\/+$/, '')
  : 'https://docs.vedpragya.com';

const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/user-guide',
        destination: `${docsBaseUrl}/user-guide/introduction`,
        permanent: true,
      },
      {
        source: '/user-guide/section/:folder/:slug*',
        destination: `${docsBaseUrl}/user-guide/:folder/:slug*`,
        permanent: true,
      },
      {
        source: '/user-guide/:folder/:slug*',
        destination: `${docsBaseUrl}/user-guide/:folder/:slug*`,
        permanent: true,
      },

      {
        source: '/developers',
        destination: `${docsBaseUrl}/developers/introduction`,
        permanent: true,
      },
      {
        source: '/developers/section/:folder/:slug*',
        destination: `${docsBaseUrl}/developers/:folder/:slug*`,
        permanent: true,
      },
      {
        source: '/developers/:folder/:slug*',
        destination: `${docsBaseUrl}/developers/:folder/:slug*`,
        permanent: true,
      },
      {
        source: '/developers/:slug',
        destination: `${docsBaseUrl}/developers/:slug`,
        permanent: true,
      },

      {
        source: '/arjuna-ui',
        destination: `${docsBaseUrl}/arjuna-ui/introduction`,
        permanent: true,
      },
      {
        source: '/arjuna-ui/section/:folder/:slug*',
        destination: `${docsBaseUrl}/arjuna-ui/:folder/:slug*`,
        permanent: true,
      },
      {
        source: '/arjuna-ui/:folder/:slug*',
        destination: `${docsBaseUrl}/arjuna-ui/:folder/:slug*`,
        permanent: true,
      },
      {
        source: '/arjuna-ui/:slug',
        destination: `${docsBaseUrl}/arjuna-ui/:slug`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
