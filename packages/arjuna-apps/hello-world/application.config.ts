import { type ApplicationConfig } from 'arjuna-sdk';

const config: ApplicationConfig = {
  universalIdentifier: '4ec0391d-18d5-411c-b2f3-266ddc1c3ef7',
  displayName: 'Hello World',
  description: 'A simple hello world app',
  icon: 'IconWorld',
  applicationVariables: {
    ARJUNA_API_KEY: {
      universalIdentifier: 'dedc53eb-9c12-4fe2-ba86-4a2add19d305',
      description: 'ArjunaCRM API Key',
      isSecret: true,
    },
    ARJUNA_API_URL: {
      universalIdentifier: 'ef8ab489-e68a-4841-b402-261f440e6185',
      description: 'ArjunaCRM API Url',
      isSecret: false,
    },
  },
};

export default config;
