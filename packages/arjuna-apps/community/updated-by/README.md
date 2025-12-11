# Updated by

Updates Updated by field with details of person behind newest update

## Requirements
- arjuna-cli `npm install -g arjuna-cli`
- an `apiKey`. Go to `https://vedpragya.com/settings/api-webhooks` to generate one

## Quick start

1. Add application
```bash
arjuna auth login
cd packages/arjuna-apps/updated-by
arjuna app sync
```

2. Configure **ARJUNA_API_KEY**

Go to Settings > Applications > Updated by > Settings and add ArjunaCRM API key used to
send requests to ArjunaCRM. 

**If you're using self-hosted instance, you have to add also URL to your workspace.**

## Flow

1. Check if ArjunaCRM API key is added, if not, exit
2. Check if updated record belongs to an object which shouldn't have a `updatedBy` field (like blocklists or messages), if yes, exit
3. Check if updated record has updatedBy field, if not, create it
4. Check if updated field in record is updatedBy field, if yes, return preemptively
5. Update record with workspace member ID

## Notes

- Updated by field shouldn't be changed by users, only by extension 
- Amount of API requests is reduced to possible minimum
