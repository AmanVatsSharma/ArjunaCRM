## 🧠 AI-Powered Meeting Transcript to CRM Data Integration

---

### Overview

This feature automatically transforms meeting transcripts into structured CRM data using AI.
When unstructured meeting notes are received via a **webhook**, the system processes them and creates organized **notes, tasks, and assignments** directly in ArjunaCRM CRM.

---

### Key Features

- 🤖 **AI-Powered Analysis:**
  Extracts summaries, action items, assignees, and due dates from natural language transcripts.

- 🗂 **Smart Task Consolidation:**
  Merges related sub-tasks into unified deliverables
  _(e.g., `"draft"` + `"review"` + `"present"` → one consolidated task)._

- 🧑‍🤝‍🧑 **Intelligent Assignment:**
  Uses GraphQL member lookup to match extracted assignee names to workspace member IDs with flexible string matching.

- 🔗 **Automatic Linking:**
  Links generated **notes** and **tasks** to relevant contacts using `noteTargets` and `taskTargets`.

- 📅 **Date Parsing:**
  Converts relative date expressions (e.g., “next Monday”, “end of week”) into **ISO-formatted dates** for accurate scheduling.

---

## Requirements

- [ArjunaCRM CLI](https://www.npmjs.com/package/arjuna-cli) - Install globally: `npm install -g arjuna-cli`
- ArjunaCRM CRM instance with API access
- API key from [Settings > API & Webhooks](https://vedpragya.com/settings/api-webhooks)
- OpenAI API key or compatible service (Groq, etc.)

## Installation

1. **Authenticate with ArjunaCRM CLI:**
   ```bash
   arjuna auth login
   ```

2. **Configure environment variables:**

   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `AI_PROVIDER_API_KEY`: Your OpenAI or Groq API key
   - `ARJUNA_API_KEY`: Generated from your ArjunaCRM CRM instance
   - `ARJUNA_API_URL`: Your ArjunaCRM CRM instance URL (e.g., https://your-instance.vedpragya.com)
   - `WEBHOOK_SECRET_TOKEN`: Secret token for webhook authentication
   - `AI_PROVIDER_API_BASE_URL`: Base URL for OpenAI-compatible API (defaults to https://api.openai.com/v1)

3. **Install dependencies:**
   ```bash
   yarn install
   ```

4. **Deploy to your ArjunaCRM workspace:**
   ```bash
   arjuna app sync
   ```

## Configuration

### Using Groq Instead of OpenAI

To use Groq's API (which is compatible with OpenAI's SDK), set:
```bash
AI_PROVIDER_API_BASE_URL=https://api.groq.com/openai/v1
AI_PROVIDER_API_KEY=your-groq-api-key
```

### Using OpenAI

To use OpenAI's official API:
```bash
AI_PROVIDER_API_BASE_URL=https://api.openai.com/v1
AI_PROVIDER_API_KEY=your-openai-api-key
```

### 🔗 Webhook Setup (inside ArjunaCRM)

Navigate to:
**ArjunaCRM → Workspace Settings → APIs & Webhook → + New Webhook**

| Field  | Value                                     |
|--------|-------------------------------------------|
| **Method** | `POST`                                 |
| **URL**    | your deployed endpoint URL             |
| **Secret** | Generate one & store same in `.env`   |

## Usage

Send a POST request to your webhook endpoint with the following payload:

```json
{
  "transcript": "During the Project Phoenix Kick-off on November 1st, 2025...",
  "meetingTitle": "Project Phoenix Kick-off",
  "meetingDate": "2025-11-01",
  "participants": [
    "Brian Chesky",
    "Dario Amodei",
    "Iqra Khan"
  ],
  "token": "your-webhook-secret-token",
  "relatedPersonId": "person-uuid-from-crm"
}
```

### Response

```json
{
  "success": true,
  "noteId": "note-uuid",
  "taskIds": ["task-uuid-1", "task-uuid-2"],
  "summary": {
    "noteCreated": true,
    "tasksCreated": 2,
    "actionItemsProcessed": 2,
    "commitmentsProcessed": 0
  },
  "executionLogs": [
    "✅ Validation passed",
    "🤖 Starting transcript analysis...",
    "✅ Analysis complete"
  ]
}
```

## Technical Stack

| Component | Description |
|----------|-------------|
| **AI Provider** | Groq (via OpenAI SDK) using the `GPT-OSS-20B` model |
| **APIs** | ArjunaCRM CRM REST API + GraphQL (for member resolution) |
| **Runtime** | Webhook-triggered serverless function written in **TypeScript** |

---
## Development

### Build
```bash
yarn build
```

### Type Check
```bash
yarn type-check
```


## Environment Variables

| Variable | Required | Secret | Description |
|----------|----------|--------|-------------|
| `AI_PROVIDER_API_KEY` | Yes | Yes | API key for OpenAI-compatible service |
| `ARJUNA_API_KEY` | Yes | Yes | ArjunaCRM CRM API authentication token |
| `ARJUNA_API_URL` | Yes | No | Base URL for ArjunaCRM CRM instance |
| `WEBHOOK_SECRET_TOKEN` | Yes | Yes | Secret for webhook request validation |
| `AI_PROVIDER_API_BASE_URL` | No | No | Base URL for AI service (defaults to OpenAI) |



## Demo Preview

The demo below shows the full workflow where a raw meeting transcript is processed and automatically converted into structured **Notes + Tasks** inside ArjunaCRM CRM.

### Process-Transcript Screenshot
![process](https://drive.google.com/uc?export=view&id=1IMayfb77uAr5lvtY7XLn8Yq-_26pxMCY)

## Demo Video
[Watch Demo Video](https://drive.google.com/file/d/1WpzrNBbKBFD5ztGwNuS_SMi7yJBr5AK8/view?usp=sharing)

