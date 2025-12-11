/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
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
        destination: 'https://docs.arjuna.com/user-guide/introduction',
        permanent: true,
      },
      {
        source: '/user-guide/section/:folder/:slug*',
        destination: 'https://docs.arjuna.com/user-guide/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/user-guide/:folder/:slug*',
        destination: 'https://docs.arjuna.com/user-guide/:folder/:slug*',
        permanent: true,
      },

      {
        source: '/developers',
        destination: 'https://docs.arjuna.com/developers/introduction',
        permanent: true,
      },
      {
        source: '/developers/section/:folder/:slug*',
        destination: 'https://docs.arjuna.com/developers/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/developers/:folder/:slug*',
        destination: 'https://docs.arjuna.com/developers/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/developers/:slug',
        destination: 'https://docs.arjuna.com/developers/:slug',
        permanent: true,
      },

      {
        source: '/arjuna-ui',
        destination: 'https://docs.arjuna.com/arjuna-ui/introduction',
        permanent: true,
      },
      {
        source: '/arjuna-ui/section/:folder/:slug*',
        destination: 'https://docs.arjuna.com/arjuna-ui/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/arjuna-ui/:folder/:slug*',
        destination: 'https://docs.arjuna.com/arjuna-ui/:folder/:slug*',
        permanent: true,
      },
      {
        source: '/arjuna-ui/:slug',
        destination: 'https://docs.arjuna.com/arjuna-ui/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
