import { type ApplicationConfig } from 'arjuna-sdk/application';

const config: ApplicationConfig = {
  universalIdentifier: '8f3c5a1e-9b2d-4c7e-a5f3-1d8e9c2b4a6f',
  displayName: 'Webmetic Visitor Intelligence',
  description:
    'Automatically sync B2B website visitor data into ArjunaCRM CRM. Identify companies visiting your website and track engagement without forms or manual entry.',
  applicationVariables: {
    ARJUNA_API_KEY: {
      universalIdentifier: 'eb3866a1-36df-42f3-bcb8-351120b74096',
      description: 'ArjunaCRM API key for authentication',
      isSecret: true,
    },
    ARJUNA_API_URL: {
      universalIdentifier: '10dfe92a-b472-43e6-a33a-db89dcdd9bad',
      description: 'ArjunaCRM API URL (base URL of your ArjunaCRM instance)',
      isSecret: false,
      value: '',
    },
    WEBMETIC_API_KEY: {
      universalIdentifier: '28540b41-ab79-489b-953f-c1491adc28f2',
      description: 'Webmetic API key (get from hub.webmetic.de)',
      isSecret: true,
    },
    WEBMETIC_DOMAIN: {
      universalIdentifier: '74f7d252-539a-4eba-8d12-e7010c8128a1',
      description: 'Your website domain to track (e.g., example.com)',
      isSecret: false,
    },
  },
};

export default config;
