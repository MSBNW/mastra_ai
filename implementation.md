# Mastra Agent Implementation Guide

## Setup

1. First, install the required packages:

```bash
npm install @mastra/core @mastra/memory
```

2. Configure your environment variables:

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=file:example.db  # For local development
```

## Agent Configuration

Create your agent configuration file:

```typescript:src/mastra/agents/index.ts
import { Agent } from "@mastra/core";
import { Memory } from "@mastra/memory";
import { MastraStorageLibSql } from '@mastra/core/storage';

// Configure storage for conversation history
const storage = new MastraStorageLibSql({
  config: {
    url: process.env.DATABASE_URL || 'file:example.db',
  },
});

// Initialize memory system
const memory = new Memory({
  storage
});

// Create your agent
export const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4-turbo-preview",
  },
  memory
});
```

## Register Agent with Mastra

```typescript:src/mastra/index.ts
import { Mastra } from "@mastra/core";
import { myAgent } from "./agents";

export const mastra = new Mastra({
  agents: { myAgent },
});
```

## Starting the Server

Run the Mastra development server:

```bash
mastra dev --dir src
```

Your agent will be available at: `http://localhost:4111/api/agents/myAgent/generate`

## Using the API with Thread Management

### 1. Create a New Thread

First, create a conversation thread:

```bash
curl -X POST http://localhost:4111/api/memory/threads \
  -H "Content-Type: application/json" \
  -d '{
    "resourceId": "my_conversation_context"
  }'
```

Response will include a `threadId` that you'll use for subsequent requests.

### 2. Generate Responses with History

Use the thread ID to maintain conversation context:

```bash
curl -X POST http://localhost:4111/api/agents/myAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What can you help me with?"
      }
    ],
    "threadId": "your_thread_id",
    "resourceId": "my_conversation_context"
  }'
```

### 3. Continue the Conversation

For follow-up messages, use the same thread ID:

```bash
curl -X POST http://localhost:4111/api/agents/myAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Tell me more about that."
      }
    ],
    "threadId": "your_thread_id",
    "resourceId": "my_conversation_context"
  }'
```

### 4. Retrieve Conversation History

Get all messages from a specific thread:

```bash
curl -X GET http://localhost:4111/api/memory/messages?threadId=your_thread_id
```

### 5. Delete a Thread

When you're done with a conversation:

```bash
curl -X DELETE http://localhost:4111/api/memory/threads/your_thread_id
```

## Important Notes

1. The `resourceId` helps organize different conversation contexts.
2. Messages are automatically saved to memory when using the generate endpoint.
3. The memory system maintains conversation history in chronological order.
4. You can optionally configure token limits for context windows to manage memory usage.

## Advanced Features

### Configure Context Window Size

If you need to limit the context window size:

```typescript
const memory = new Memory({
  storage,
  maxTokens: 4000 // Limits total tokens in context window
});
```

### Add Vector Search (Optional)

For semantic search capabilities across conversation history:

```typescript
import { LibSQLVector } from '@mastra/vector-libsql';

const vector = new LibSQLVector({
  connectionUrl: process.env.DATABASE_URL
});

const memory = new Memory({
  storage,
  vector,
  embedding: {
    provider: "OPEN_AI",
    model: "text-embedding-3-small",
    maxRetries: 3,
  },
});
``` 