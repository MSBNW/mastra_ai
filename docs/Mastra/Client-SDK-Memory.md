# Memory API (Client SDK)

The **Memory API** allows you to manage conversation memory (threads and messages) for agents. This includes creating threads, retrieving and updating them, and storing messages.

## Memory Thread Operations

### Get All Threads

Retrieve all memory threads (conversation histories) for a specific resource (user or context):

```ts
const threads = await client.getMemoryThreads({
  resourceId: "resource-1"
});
```

This returns all threads associated with the `resourceId` (e.g., all conversation histories for a particular user or context).

### Create a New Thread

Start a new conversation thread:

```ts
const thread = await client.createMemoryThread({
  title: "New Conversation",
  metadata: { category: "support" },
  resourceId: "resource-1",
});
```

Parameters:
- **title:** Human-friendly title for the thread.
- **metadata:** Optional metadata (e.g., category, tags).
- **resourceId:** The associated resource/user for the thread.

This returns the newly created thread object (including an ID).

### Working with a Specific Thread

Get an instance of a specific memory thread by its ID:

```ts
const thread = client.getMemoryThread("thread-id");
```

This `thread` object can then be used to access or modify that thread's data (messages, etc).

## Thread Methods

Once you have a `thread` object (from `getMemoryThread` or after creating one), you can:

### Get Thread Details

Retrieve details about the thread:

```ts
const details = await thread.get();
```

This typically returns thread information (e.g., title, metadata, messages count).

### Update Thread

Update thread properties (like title or metadata):

```ts
const updated = await thread.update({
  title: "Updated Title",
  metadata: { status: "resolved" },
  resourceId: "resource-1"
});
```

This updates the thread's title and metadata. (The `resourceId` can be included if needed for context.)

### Delete Thread

Delete a thread and all its messages:

```ts
await thread.delete();
```

Use this with caution, as it will remove the entire conversation history for that thread.

## Message Operations

### Save Messages

Append messages to memory (store conversation messages in a thread):

```ts
const savedMessages = await client.saveMessageToMemory({
  messages: [
    {
      id: "1",
      role: "user",
      content: "Hello!",
      threadId: "thread-1",
      createdAt: new Date(),
      type: "text"
    }
  ]
});
```

Parameters:
- **messages:** An array of message objects to save. Each message can include:
  - `id`: unique message ID (string or number).
  - `role`: `"user"`, `"assistant"`, etc.
  - `content`: the text content of the message.
  - `threadId`: which thread this message belongs to.
  - `createdAt`: timestamp of the message.
  - `type`: message type (e.g., "text", could be used for distinguishing text vs other content).

The call returns the saved message(s), possibly with additional info (like confirmation or IDs).

### Get Memory Status

Check the status/health of the memory system:

```ts
const status = await client.getMemoryStatus();
```

This might return information such as whether the memory store is reachable, how many threads/messages exist, etc., depending on implementation.

Using the Memory API, you can effectively manage how agents remember past interactions, group conversations into threads, and maintain state between calls.
