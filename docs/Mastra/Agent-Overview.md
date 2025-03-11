# Agents Overview

**Agents** in Mastra are autonomous entities powered by language models. An agent can decide on a sequence of actions (including calling tools or workflows) to fulfill a task. Agents have a persona (instructions), memory, a set of tools they can use, and an associated LLM model. They behave like knowledgeable assistants or workers in your application, maintaining context over multiple interactions.

## Creating an Agent

To create an agent, use the `Agent` class from `@mastra/core/agent` and provide its configuration. For example:

```ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4o-mini"),
});
```

In this snippet, we define an agent with a **name**, some **instructions** (a system prompt describing its role), and assign it an LLM model (using OpenAI's `gpt-4o-mini` in this case). Ensure you have set your OpenAI API key in the environment so the model call is authorized. Also, make sure the Mastra core package is installed in your project (which it should be if you followed installation steps).

### Registering the Agent

After creating an agent, you must register it with a Mastra instance so it's recognized by the system (and for logging, tool integration, etc.). In `src/mastra/index.ts`:

```ts
import { Mastra } from "@mastra/core";
import { myAgent } from "./agents";

export const mastra = new Mastra({
  agents: { myAgent },
});
```

By adding your agent to the `agents` property of the Mastra constructor, it becomes active. Registration enables the agent to be served via the dev server and have access to configured tools and integrations.

## Generating and Streaming Text

Once an agent is created and registered, you can ask it to generate text responses.

### Generating text

Use the agent's `.generate()` method to get a completion or answer. This method accepts an array of messages (in chat format) or a single string prompt. For example:

```ts
const response = await myAgent.generate([
  { role: "user", content: "Hello, how can you assist me today?" },
]);
console.log("Agent:", response.text);
```

Here we send a user message to the agent and log the `response.text` it produces. The messages array follows the structure of a conversation (each message has a role like "user", "assistant", etc.). The agent uses its model to generate a reply.

### Streaming responses

For real-time or incremental output, Mastra agents support streaming. Instead of waiting for the full response, you can receive chunks of text:

```ts
const stream = await myAgent.stream([
  { role: "user", content: "Tell me a story." },
]);

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
```

This initiates a streaming generation. The `stream.textStream` is an asynchronous iterable of text chunks. The loop writes each chunk to stdout as it arrives, allowing you to output the agent's response progressively (useful for long answers or when integrating with real-time UI updates).

## Structured Output

Agents can return not only plain text but also **structured data**. You can enforce an output format by providing a JSON Schema or a Zod schema as the expected output shape.

### Using JSON Schema

Define a JSON Schema object describing the desired structure and pass it as the `output` option in `generate()`. For example:

```ts
const schema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
  },
  additionalProperties: false,
  required: ["summary", "keywords"],
};

const response = await myAgent.generate(
  [{ role: "user", content: "Provide a summary and keywords for the text..." }],
  { output: schema }
);

console.log("Structured Output:", response.object);
```

In this case, the agent will attempt to format its response as an object with a string `summary` and an array of `keywords`. The `.generate()` call returns `response.object` (the parsed object matching the schema) in addition to `response.text`. We log the structured output.

### Using Zod

Mastra also supports using a **Zod** schema for type-safe outputs. First ensure Zod is installed (`npm install zod`), then:

```ts
import { z } from "zod";

const schema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
});

const response = await myAgent.generate(
  [{ role: "user", content: "Provide a summary and keywords for the text..." }],
  { output: schema }
);

console.log("Structured Output:", response.object);
```

This achieves the same goal, but using Zod schemas gives you compile-time types and convenient validation. The agent's output is automatically validated and parsed into `response.object` as before.

## Running Agents

To run agents (i.e., serve them behind an API or otherwise execute them), Mastra provides the CLI command `mastra dev`. By default, `mastra dev` will look for any exported agents in `src/mastra/agents` and make them available via HTTP endpoints.

### Starting the Server

Simply run:

```sh
mastra dev
```

This starts a local server (on port 4111 by default) and exposes each agent at an endpoint. For example, an agent with name `myAgent` can be accessed at:

```
POST http://localhost:4111/api/agents/myAgent/generate
```

You should see console output from Mastra confirming the server start and available endpoints.

### Interacting with the Agent

With the server running, you can send requests. For instance, using `curl`:

```sh
curl -X POST http://localhost:4111/api/agents/myAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
        "messages": [
          { "role": "user", "content": "Hello, how can you assist me today?" }
        ]
      }'
```

This will get a JSON response from the agent. You can integrate this API into your application or use the provided Mastra client SDK for convenience (see **Local-Dev.md** for client usage).

## Next Steps

Now that you have an agent, you might want to extend its capabilities:

- **Memory**: To give the agent conversation memory or long-term context, see **Agent-Memory.md** for how to use Mastra's memory system.
- **Tools**: To allow the agent to perform actions or use external APIs, see **Agent-Tools.md** on adding and creating tools.
- **Voice**: For speech capabilities (text-to-speech or speech-to-text), refer to **Agent-Voice.md** if needed.

You can also see a full agent example in the guides (e.g., the "Chef Michel" agent example in the Mastra documentation). With the basics in place, an agent can now engage in conversations, use tools, and learn from context as configured.
