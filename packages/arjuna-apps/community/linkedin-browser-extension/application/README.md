# Browser Extension Serverless Functions

Serverless functions for the ArjunaCRM browser extension. These functions handle API interactions between the browser extension and the ArjunaCRM backend.

## Overview

This package contains serverless functions that are deployed to your ArjunaCRM workspace. The browser extension calls these functions to create and retrieve records in ArjunaCRM CRM.

## Functions

### Create Person
**Endpoint:** `/s/create/person`

Creates a new person record in ArjunaCRM from LinkedIn profile data.

**Parameters:**
- `firstName` (string) - Person's first name
- `lastName` (string) - Person's last name

**Response:** Created person object

### Create Company
**Endpoint:** `/s/create/company`

Creates a new company record in ArjunaCRM from LinkedIn company profile data.

**Parameters:**
- `name` (string) - Company name

**Response:** Created company object

### Get Person
**Endpoint:** `/s/get/person`

Retrieves an existing person record from ArjunaCRM (placeholder implementation).

### Get Company
**Endpoint:** `/s/get/company`

Retrieves an existing company record from ArjunaCRM (placeholder implementation).

## Setup

### Prerequisites

- **ArjunaCRM CLI** installed globally:
  ```bash
  npm install -g arjuna-cli
  ```
- **API Key** from your ArjunaCRM workspace:
  - Go to https://vedpragya.com/settings/api-webhooks
  - Generate an API key

### Configuration

1. **Authenticate with ArjunaCRM CLI:**
   ```bash
   arjuna auth login
   ```

2. **Sync serverless functions to your workspace:**
   ```bash
   arjuna app sync
   ```

3. **Configure environment variables:**
   - `ARJUNA_API_URL` - Your ArjunaCRM API URL (e.g., `https://your-workspace.vedpragya.com`)
   - `ARJUNA_API_KEY` - Your ArjunaCRM API key (marked as secret)

Environment variables can be configured via the ArjunaCRM CLI or the ArjunaCRM web interface after syncing.

## How It Works

1. The browser extension extracts data from LinkedIn profiles
2. The extension calls the serverless functions via the background script
3. Serverless functions authenticate with your ArjunaCRM API using the configured API key
4. Functions create or retrieve records in your ArjunaCRM workspace
5. Response is sent back to the extension for user feedback

## File Structure

```
serverlessFunctions/
├── create-person/
│   ├── serverlessFunction.manifest.jsonc  # Function configuration
│   └── src/
│       └── index.ts                        # Function implementation
├── create-company/
│   ├── serverlessFunction.manifest.jsonc
│   └── src/
│       └── index.ts
├── get-person/
│   ├── serverlessFunction.manifest.jsonc
│   └── src/
│       └── index.ts
└── get-company/
    ├── serverlessFunction.manifest.jsonc
    └── src/
        └── index.ts
```

## Development

These functions are managed by the ArjunaCRM CLI and are deployed to your workspace. After making changes:

1. Update the function code in `src/index.ts`
2. Run `arjuna app sync` to deploy changes to your workspace
3. Test the functions via the browser extension or ArjunaCRM API directly

## Related Packages

- **`arjuna-browser-extension`** - The main browser extension that calls these functions
- See `packages/arjuna-browser-extension/README.md` for the complete extension documentation
