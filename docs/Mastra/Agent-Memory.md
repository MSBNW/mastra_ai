# Agent Memory

Mastra provides a built-in memory system for agents to maintain conversational context and store information over time. This memory is used to feed relevant history back into the model, enabling continuity across turns and better long-term coherence.

Key aspects of the memory system:

- **Threads and Resources**: Conversations can be partitioned by a `threadId`, and optionally grouped by a higher-level `resourceId` (for example, a user ID). This allows an agent to handle multiple separate conversation threads and recall each independently. A thread represents a continuous dialogue session.
- **Recent Message History**: By default, Mastra memory keeps the last 40 messages in context. This ensures recent interactions are remembered. The number of messages to retain (`lastMessages`) is configurable if you need more or fewer.
- **Semantic Search**: The memory system can embed messages and perform similarity search to recall older relevant messages beyond the recent window. Mastra includes a default embedder (FastEmbed model) and uses LibSQL for vector storage by default, so semantic memory is on by default unless disabled.
- **Storage Backend**: Memory data (messages and embeddings) can be stored in different backends. By default, Mastra uses an embedded LibSQL (SQLite-based) database for storing conversation logs and vectors. You can configure other stores like Postgres or Upstash for persistence (see **Storage Options** below).

## Memory Configuration

You can configure memory when initializing Mastra. By default, a Memory instance with default settings is created if you include the Memory module. For most use cases, the default (LibSQL + FastEmbed) works out-of-the-box.

For advanced usage, you might customize:
- The database for storing messages (LibSQL by default, but can use Postgres, etc.).
- The vector database for embeddings (LibSQL, Pinecone, etc.).
- Parameters like how many recent messages to keep, whether to enable semantic search, etc.

**Basic Configuration**: When you create the Mastra instance, you can pass a `memory` configuration. For example, to adjust just the message limit:

```ts
import { Memory } from "@mastra/memory";
const memory = new Memory({ lastMessages: 50 });  // keep 50 recent messages
export const mastra = new Mastra({ agents: { myAgent }, memory });
```

This will apply to all agents under this Mastra instance (they share the memory config).

**Custom Configuration**: You can specify a different storage or embedder. For instance:

```ts
import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";
import { OpenAIEmbedding } from "@ai-sdk/openai";

const memory = new Memory({
  storage: new PostgresStore({ /* Postgres connection config */ }),
  embedder: OpenAIEmbedding("text-embedding-ada-002"),
  lastMessages: 30,
});
export const mastra = new Mastra({ agents: { myAgent }, memory });
```

In this example, we use a PostgreSQL storage for messages and an OpenAI embedding model for semantic search, and limit recent messages to 30. (Make sure to install `@mastra/pg` for Postgres support.)

**Storage Options**: Mastra currently supports multiple storage adapters for memory:
- **LibSQL (SQLite)** – Default lightweight embedded database.
- **PostgreSQL** – Using `PostgresStore` from `@mastra/pg` for production-grade DB.
- **Upstash (Redis)** – Using `UpstashStore` from `@mastra/upstash` for serverless Redis-like storage.
- (You can extend or implement your own storage by conforming to the storage interface if needed.)

**Vector Search**: For semantic memory, Mastra can integrate with vector stores (if not using the default LibSQL). For example, you could use Pinecone or pgvector by configuring the embedder and vector store accordingly. By default, if you don't change anything, semantic search is active via the default embedder (bge-small-en model) and LibSQL's vector support.

## Using Memory in Agents

When memory is configured, agents automatically utilize it during `.generate()` and `.stream()` calls as long as you provide a `resourceId` and `threadId` in the generate options. For example:

```ts
const response = await myAgent.generate(
  "What were we discussing earlier about performance?",
  { resourceId: "user_123", threadId: "thread_456" }
);
```

Here `resourceId` might identify the user and `threadId` a specific conversation. Mastra will then:
1. Store this query and response in the storage backend.
2. Retrieve recent messages for thread_456.
3. Use semantic search to find any older messages about "performance" in that thread.
4. Inject the relevant context into the prompt for the agent.

All of this happens automatically. You just need to supply consistent `resourceId`/`threadId` values for related calls.

If you do not specify these IDs, Mastra can treat each call in isolation (no memory) or use a default session, depending on configuration.

## Manually Managing Memory

In most cases, you won't need to directly manipulate memory; using the agent API with thread IDs is sufficient. However, for advanced control, you can use the `Memory` API directly. For example:

```ts
import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

const memory = new Memory({
  storage: new PostgresStore({ /* connection details */ })
});

// Create a new conversation thread
const thread = await memory.createThread({
  resourceId: "user_123",
  title: "Project Discussion",
  metadata: { project: "mastra", topic: "architecture" }
});

// Save a message to the thread
await memory.saveMessages({
  messages: [
    {
      id: "msg_1",
      threadId: thread.id,
      role: "user",
      content: "What's the project status?",
      createdAt: new Date(),
      type: "text",
    },
  ],
});

// Query messages from the thread (e.g., last 10 messages or search by content)
const messages = await memory.query({
  threadId: thread.id,
  selectBy: {
    last: 10,
    vectorSearchString: "performance"
  },
});

// Fetch or update threads if needed
const sameThread = await memory.getThreadById({ threadId: thread.id });
const allUserThreads = await memory.getThreadsByResourceId({ resourceId: "user_123" });
await memory.updateThread({ id: thread.id, title: "Updated Discussion" });
await memory.deleteThread(thread.id);
```

This low-level API lets you create and manage threads and messages manually. For example, you might pre-load some context by creating a thread and saving initial messages, or clean up old data. In typical usage, however, simply relying on the agent methods with thread IDs is easier.

**Note:** All agents under the same Mastra instance share the memory configuration. If you need different memory behavior for different agents, you would currently need separate Mastra instances or custom logic inside your tools/agents to handle memory differently. Mastra's memory system is powerful for maintaining continuity, which is crucial in multi-turn conversations and stateful interactions.
