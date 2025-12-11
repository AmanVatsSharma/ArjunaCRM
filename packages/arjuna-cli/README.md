# Deprecated: arjuna-cli

This package is deprecated. Please install and use arjuna-sdk instead:

```bash
npm uninstall arjuna-cli
npm install -g arjuna-sdk
```

The command name remains the same: arjuna.

A command-line interface to easily scaffold, develop, and publish applications that extend ArjunaCRM CRM (now provided by arjuna-sdk).

## Requirements
- yarn >= 4.9.2
- an `apiKey`. Go to `https://vedpragya.com/settings/api-webhooks` to generate one

## Quick example project

```bash
# Authenticate using your apiKey (CLI will prompt for your <apiKey>)
arjuna auth login

# Init a new application called hello-world
arjuna app init hello-world

# Go to your app
cd hello-world

# Add a serverless function to your application
arjuna app add serverlessFunction

# Add a trigger to your serverless function
arjuna app add trigger

# Add axios to your application
yarn add axios

# Start dev mode: automatically syncs changes to your ArjunaCRM workspace, so you can test new functions/objects instantly.
arjuna app dev

# Or use one time sync (also generates SDK automatically)
arjuna app sync

# List all available commands
arjuna help
```

## Application Structure

Each application in this package follows the standard application structure:

```
app-name/
├── package.json
├── README.md
├── serverlessFunctions  # Custom backend logic (runs on demand)
└── ...
```

## Publish your application

Applications are currently stored in arjuna/packages/arjuna-apps.

You can share your application with all arjuna users.

```bash
# pull arjuna project
git clone https://github.com/vedpragyabharat/arjuna.git
cd arjuna

# create a new branch
git checkout -b feature/my-awesome-app
```

- copy your app folder into arjuna/packages/arjuna-apps
- commit your changes and open a pull request on https://github.com/vedpragyabharat/arjuna

```bash
git commit -m "Add new application"
git push
```

Our team reviews contributions for quality, security, and reusability before merging.

## Contributing

- see our [Hacktoberfest 2025 notion page](https://arjunacrm.notion.site/Hacktoberfest-27711d8417038037a149d4638a9cc510)
- our [Discord](https://discord.gg/cx5n4Jzs57)
