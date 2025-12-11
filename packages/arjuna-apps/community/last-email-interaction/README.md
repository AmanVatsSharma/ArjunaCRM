# Last email interaction

Updates Last interaction and Interaction status fields based on last email date

## Requirements
- arjuna-cli `npm install -g arjuna-cli`
- an `apiKey`. Go to `https://vedpragya.com/settings/api-webhooks` to generate one

## Setup
1. Add and synchronize app
```bash
arjuna auth login
cd last_email_interaction
arjuna app sync
```
2. Go to Settings > Integrations > Last email interaction > Settings and add required variables

## Flow
- Checks if fields are created, if not, creates them on fly
- Extracts the datetime of message and calculates the last interaction status
- Fetches all users and companies connected to them and updates their Last interaction and Interaction status fields