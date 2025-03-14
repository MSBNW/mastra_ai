# Agents API (Client SDK)

The **Agents API** in the client SDK provides methods to list and interact with Mastra AI agents, including generating responses, streaming interactions, and accessing agent-specific tools.

## Getting All Agents

Retrieve a list of all available agents:

```ts
const agents = await client.getAgents();
```

This returns an object or array containing all agents registered on the server.

## Working with a Specific Agent

Get an instance of a specific agent by its ID:

```ts
const agent = client.getAgent("agent-id");
```

You can then call methods on this `agent` object to interact with it.

## Agent Methods

Once you have an `agent` instance, you can use the following methods:

### Get Agent Details

Retrieve detailed information about an agent:

```ts
const details = await agent.details();
```

This might return metadata or configuration about the agent.

### Generate Response

Ask the agent to generate a response (e.g. from a conversation prompt):

```ts
const response = await agent.generate({
  messages: [
    { role: "user", content: "Hello, how are you?" }
  ],
  threadId: "thread-1",    // Optional: specify a thread for context
  resourceId: "resource-1",// Optional: specify a resource ID
  output: {}              // Optional: output configuration (e.g. schema)
});
```

- `messages`: conversation messages (at minimum a user prompt).
- `threadId` (optional): provide a thread ID to include conversation context.
- `resourceId` (optional): identify the user/resource, for context or logging.
- `output` (optional): specify expected output structure or schema.

The `generate()` method returns the agent's answer (and possibly structured data if an `output` schema was provided).

### Stream Response

Stream a response from the agent for real-time interaction:

```ts
const streamResponse = await agent.stream({
  messages: [
    { role: "user", content: "Tell me a story" }
  ],
});
```

The returned `streamResponse` is typically a stream (for example, an async iterable) of chunks. You can read it as follows:

```ts
// Example of reading streamed chunks
const reader = streamResponse.body.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(new TextDecoder().decode(value));
}
```

This will output each chunk of the agent's response as it streams. (In Node/browser environments, you might iterate using `for await...of` if the library supports it.)

### Get Agent Tool

Retrieve a specific **tool** available to the agent:

```ts
const tool = await agent.getTool("tool-id");
```

This returns an object or definition for the tool identified by `"tool-id"` (assuming the agent has a tool with that ID).

### Get Agent Evaluations

Retrieve evaluation results (tests/metrics) for the agent:

```ts
// Get continuous integration (CI) evaluation results:
const evals = await agent.evals();

// Get live (runtime) evaluations:
const liveEvals = await agent.liveEvals();
```

These methods may provide performance metrics or evaluation outcomes for the agent's behavior.

Each of the above agent methods returns a `Promise` that resolves to the requested data. Use `await` (or promise `.then()` syntax) to handle the asynchronous results.
