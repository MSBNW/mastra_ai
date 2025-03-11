# Agent Tools

**Tools** in Mastra are functions that agents (or workflows) can call to perform specific tasks or integrate with external services. Tools are defined with schemas for inputs and outputs, which ensures the agent knows how to use them and what to expect in return. This section covers creating tools and enabling them for agents.

## Creating Tools

To create a tool, use the `createTool` function from `@mastra/core` (or specific tool helpers). A basic example is a tool that fetches weather info (similar to the one in installation):

```ts
import { createTool } from "@mastra/core";
import { z } from "zod";

export const weatherInfo = createTool({
  id: "getWeather",
  description: "Fetches current weather for a given city",
  inputSchema: z.object({ city: z.string() }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
  }),
  execute: async ({ context }) => {
    const city = context.city;
    // ... call weather API ...
    return { temperature: 72, conditions: "Sunny" };
  },
});
```

Here, `id` is a unique identifier for the tool, and `description` explains its purpose in simple terms (for the agent's understanding). We use Zod to define that the tool expects a `city` string and returns an object with a temperature and conditions. The `execute` function contains the logic (e.g., API calls) and returns a result matching the output schema.

The schemas inform the LLM how to call the tool (what arguments to provide) and interpret the results, making tool use much more reliable.

## Adding Tools to an Agent

After defining a tool, you need to allow an agent to use it. When creating an agent, include a `tools` property listing the tool(s). For example:

```ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { weatherInfo } from "../tools";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: "You can answer weather questions using a tool.",
  model: openai("gpt-4"),
  tools: { weatherInfo },
});
```

Now `weatherAgent` has access to the `weatherInfo` tool. The agent's LLM can decide to call `getWeather` (the tool's id) when needed. During a conversation, if the agent's prompt suggests a tool action (based on the underlying chain-of-thought or function-calling logic of the model), Mastra will execute the `weatherInfo.execute` function and feed the result back to the agent.

## Registering the Agent (with Tools)

Make sure to register the agent in `mastra = new Mastra({ agents: { weatherAgent } })` as usual so that it's active. There's nothing extra needed for tools beyond including them in the agent definition. Once the agent is running, tools are automatically available for it to call.

## Debugging Tools

When you create tools, it's good practice to test them in isolation. You can write unit tests for tool functions (since `execute` is a regular async function). Using a testing framework like Vitest or Jest, you could call `weatherInfo.execute({ context: { city: "London" } })` and verify the output is as expected.

Mastra tools are plain functions at their core, so standard debugging (like using console logs or a debugger) inside the `execute` function works. Also, when running `mastra dev`, any errors thrown by `execute` will be logged to the console for troubleshooting.

## Calling an Agent with a Tool

From the developer's perspective, calling an agent that uses tools is the same as any other agent call (you still use `agent.generate()` or via API). The model (if it supports function calling, like OpenAI GPT-4) will determine when to invoke the tool. Mastra handles the actual function call behind the scenes. For example:

```ts
const response = await weatherAgent.generate("What's the weather in Paris?");
console.log(response.text);
```

If using OpenAI function-calling under the hood, the agent might choose to call `getWeather` with `{"city": "Paris"}`. Mastra will execute `weatherInfo` and inject the result (e.g., `{"temperature": 75, "conditions": "Clear"}`) into the conversation, and the final answer might be, *"It's 75°F and clear in Paris."*.

No special code is required to trigger the tool; it's all about the agent's prompt design and the model's decision. Ensure your agent's instructions or system message encourage tool use when appropriate (e.g., *"Use available tools for information."*).

## Example: Interacting with the Agent

Suppose we have a running dev server with `weatherAgent` registered. You can test its tool usage via the API:

```sh
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role":"user","content":"What is the weather in Paris?"}]}'
```

The agent will respond with an answer, likely using the tool internally to fetch data.

## Vercel AI SDK Tool Format

Mastra also supports tools created using the Vercel AI SDK conventions. If you have an existing tool defined via the Vercel AI SDK (which might include its own schema and function), you can integrate it by importing it and including it in an agent's tools. This means Mastra is compatible with a wider ecosystem of function-calling tools.

For example, if `someTool` was defined with Vercel's format, you could do:

```ts
import { someTool } from "./vercel-tools";
export const agent = new Agent({
  ...,
  tools: { someTool },
});
```

Mastra will treat it similarly to a tool made with `createTool`, as long as the interfaces align.

## Tool Design Best Practices

When writing tool definitions, consider the following guidelines:

- **Clear Descriptions**: Keep the tool's `description` focused on its purpose. The agent sees this description, so it should convey what the tool does, not how it does it. (Example: "Fetch the main branch reference from a GitHub repo" is clear and concise.)
- **Schema Usage**: Put any needed technical constraints or data specifications in the `inputSchema` and `outputSchema`. This helps the agent and Mastra validate usage. (For instance, if an input must be an email address, the schema can enforce a string pattern.)
- **Simplicity**: Aim for each tool to do one thing well. Complex operations can be broken into multiple tools or steps in a workflow. This makes it easier for the LLM to decide on actions.
- **Error Handling**: In `execute`, handle errors gracefully. Throw errors with meaningful messages for invalid inputs or failures (Mastra will relay this back to the agent's output so you know what went wrong).
- **Security**: Be mindful of what your tool does, especially if it executes system commands or accesses external services. Validate inputs if necessary to avoid injection or misuse.

By following these practices, your agents will use tools more effectively and you'll reduce unexpected behavior.
