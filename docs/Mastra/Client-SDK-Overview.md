# Mastra Client SDK (Overview)

The **Mastra Client SDK** provides a simple, type-safe interface to interact with Mastra REST APIs from TypeScript and JavaScript applications. It supports all Mastra features, including **agents**, **vectors**, **memory**, **tools**, and **workflows**.

## Installation

You can install the Mastra Client SDK via npm, Yarn, or pnpm:

```bash
npm install @mastra/client-js

yarn add @mastra/client-js

pnpm add @mastra/client-js
```

### Requirements

- Node.js 16.x or later  
- TypeScript 4.7+ (if using TypeScript)  
- A modern browser environment with Fetch API support (for browser-based usage)

### Local Development

When developing locally, point the client to your Mastra server (by default running on port 4111):

```ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111", // Default Mastra server port
});
```

For more on local development, see the Mastra **Local Development Guide**.

## Basic Configuration

At minimum, you must provide the `baseUrl` of your Mastra API endpoint:

```ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111",
});
```

## Configuration Options

A full configuration example with all options:

```ts
const client = new MastraClient({
  // Required
  baseUrl: "http://localhost:4111",

  // Optional
  retries: 3,         // Number of retry attempts (default: 3)
  backoffMs: 300,     // Initial backoff time in ms (default: 300)
  maxBackoffMs: 5000, // Maximum backoff time in ms (default: 5000)
  headers: {
    // Custom headers to include in all requests
    "Custom-Header": "value",
  },
});
```

**Available configuration options:**

- **baseUrl** (`string`): **Required.** Base URL of your Mastra API endpoint.  
- **retries** (`number`, default `3`): How many times to retry failed requests.  
- **backoffMs** (`number`, default `300`): Initial delay (ms) before retrying a failed request.  
- **maxBackoffMs** (`number`, default `5000`): Maximum backoff delay (ms) between retries.  
- **headers** (`Record<string, string>`, default `{}`): Custom HTTP headers to include with every request.

## Available Resources

The client provides access to the following resources (each documented in its own section):

- **Agents:** Create and manage AI agents, generate responses, and handle streaming interactions.  
- **Memory:** Manage conversation threads and message history.  
- **Tools:** Access and execute tools available to agents.  
- **Workflows:** Create and manage automated workflows.  
- **Vectors:** Perform vector operations for semantic search and similarity matching.  
- **Logs:** Retrieve system logs for debugging.  
- **Telemetry:** Retrieve and analyze application traces.

Each resource's API is detailed in the corresponding section of the documentation.

## Quick Example

Here's a simple example of using the client to interact with an agent:

```ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({ baseUrl: "http://localhost:4111" });

// Get an agent instance by its ID
const agent = client.getAgent("your-agent-id");

// Generate a response from the agent
const response = await agent.generate({
  messages: [
    { role: "user", content: "Hello!" }
  ],
});
```

In this example, we initialize the client, retrieve an agent by ID, and then call `generate()` with a user message to get the agent's response.
