<div align="center">
  <a href="https://vedpragya.com">
    <picture>
      <img alt="ArjunaCRM logo" src="https://raw.githubusercontent.com/vedpragyabharat/arjuna/2f25922f4cd5bd61e1427c57c4f8ea224e1d552c/packages/arjuna-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>ArjunaCRM SDK</h1>

<a href="https://www.npmjs.com/package/arjuna-sdk"><img alt="NPM version" src="https://img.shields.io/npm/v/arjuna-sdk.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/vedpragyabharat/arjuna/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=ArjunaCRM&labelColor=000000&logoWidth=20"></a>

</div>

A CLI and SDK to develop, build, and publish applications that extend [ArjunaCRM CRM](https://vedpragya.com).

- Type‑safe client and workspace entity typings
- Built‑in CLI for auth, generate, dev sync, one‑off sync, and uninstall
- Works great with the scaffolder: [create-arjuna-app](https://www.npmjs.com/package/create-arjuna-app)

## Prerequisites
- Node.js 24+ (recommended) and Yarn 4
- A ArjunaCRM workspace and an API key. Generate one at https://app.vedpragya.com/settings/api-webhooks

## Installation

```bash
npm install arjuna-sdk
# or
yarn add arjuna-sdk
```

## Getting started
You can either scaffold a new app or add the SDK to an existing one.

- Start new (recommended):
  ```bash
  npx create-arjuna-app@latest my-arjuna-app
  cd my-arjuna-app
  ```
- Existing project: install the SDK as shown above, then use the CLI below.

## CLI quickstart
```bash
# Authenticate using your API key (CLI will prompt for it)
arjuna auth login

# Add a new entity to your application (guided prompts)
arjuna app add

# Generate a typed ArjunaCRM client and TypeScript definitions for your workspace entities
arjuna app generate

# Start dev mode: automatically syncs changes to your workspace for instant testing
arjuna app dev

# One‑time sync of local changes
arjuna app sync

# Uninstall the application from the current workspace
arjuna app uninstall
```

## Usage (SDK)
```typescript
// Example: import what you need from the SDK
import { /* your exports */ } from 'arjuna-sdk';
```

## Publish your application
Applications are currently stored in [`arjuna/packages/arjuna-apps`](https://github.com/vedpragyabharat/arjuna/tree/main/packages/arjuna-apps).

You can share your application with all ArjunaCRM users:

```bash
# pull the ArjunaCRM project
git clone https://github.com/vedpragyabharat/arjuna.git
cd arjuna

# create a new branch
git checkout -b feature/my-awesome-app
```

- Copy your app folder into `arjuna/packages/arjuna-apps`.
- Commit your changes and open a pull request on https://github.com/vedpragyabharat/arjuna

```bash
git commit -m "Add new application"
git push
```

Our team reviews contributions for quality, security, and reusability.

## Troubleshooting
- Auth errors: run `arjuna auth login` again and ensure the API key has the required permissions.
- Typings out of date: run `arjuna app generate` to refresh the client and types.
- Not seeing changes in dev: make sure dev mode is running (`arjuna app dev`).

## Contributing
- See our [GitHub](https://github.com/vedpragyabharat/arjuna)
- Join our [Discord](https://discord.gg/cx5n4Jzs57)
