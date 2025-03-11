# Local Development

Mastra provides tools to streamline local development of your AI application. The key components are the **Mastra CLI** for project setup and a **development server** (`mastra dev`) that includes a UI and APIs for interactive debugging.

## Creating Projects (CLI)

To start a new project or add Mastra to an existing one, use the Mastra CLI:
- **`npm create mastra`** (or `mastra init`) for new projects: This interactive command scaffolds the project structure (as described in Installation). You can also provide flags to automate the setup.
- **`mastra init` in existing project**: Adds a `src/mastra` directory, config files, and optional components to your current project, without overwriting other files. It's useful if you want to integrate Mastra into an app you already have (e.g., a Next.js app).

The CLI also offers flags (listed under **Command Arguments**):
- `--components <list>`: choose components to include (agents, memory, storage, etc.).
- Running `mastra init` with no arguments will launch the interactive prompt (choose directory, components, provider, etc.).

After initialization, run `npm install` to install dependencies, then you can directly start development.

## Mastra Dev Server

Running `mastra dev` starts a local development server that serves your Mastra app on a port (default 4111). This server provides multiple features:

### REST API Endpoints

All registered agents and workflows are exposed as RESTful endpoints:
- `POST /api/agents/:agentId/generate` – Generate a response from agent `agentId`.
- `POST /api/agents/:agentId/stream` – Stream a response (for agents' streaming).
- `POST /api/workflows/:workflowId/execute` – Start a workflow execution.
- `POST /api/workflows/:workflowId/:instanceId/event` – Send an event to a suspended workflow.
- `GET /api/workflows/:workflowId/:instanceId/status` – Get status of a workflow run.

By default the server runs at `http://localhost:4111`. You can change the port with the `--port` flag (e.g., `mastra dev --port 3000` to use 3000).

These endpoints allow you to integrate or test agents using tools like curl or Postman easily.

### UI Playground

When `mastra dev` is running, it also serves a web UI (playground) at the same address:
- **Agent Chat Interface**: A simple chat UI to talk to each agent. You can select an agent and exchange messages, which is very useful for testing prompts, seeing how memory and tools are used, etc.
- **Workflow Visualizer**: A UI that shows your workflow graph, steps, and their statuses as you execute them (so you can trace the execution flow).
- **Tool Playground**: Possibly an interface to test tools individually (sending inputs to a tool and seeing outputs).

Using the playground, you can iterate quickly: tweak an agent's instructions or a workflow step in your code, refresh the UI, and test again.

### OpenAPI Specification

Mastra dev server provides an OpenAPI (Swagger) spec at `GET /openapi.json`. This is useful for:
- Viewing all available endpoints and their schemas.
- Generating API clients if needed.
- Understanding the expected request/response formats for each route.

You could load this JSON in Swagger UI to visualize or share the API spec for your Mastra app.

### Live Reload

If you edit your agent/tool/workflow code, the dev server will typically auto-reload to pick up changes (the scaffold uses `tsx watch` or similar under the hood). Check the console output in your terminal running `mastra dev` to see if it restarts on file changes.

### Logging and State Inspection

While running, the server logs actions:
- Agent calls (and any tool function calls invoked).
- Workflow step transitions.
- Errors or exceptions in tools/steps.

Additionally, the playground UI may show agent state (like memory contents or last tool used). This helps debug what the AI is "thinking" or why it produced a certain output.

## Using the Client SDK

For programmatic interactions, Mastra offers a JavaScript client SDK (`@mastra/client-js`) to connect to the dev server.

Install it in your front-end or integration environment:
```sh
npm install @mastra/client-js
```

Then use it as:
```ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({ baseUrl: "http://localhost:4111" });
const agent = client.getAgent("myAgent");
const response = await agent.generate({ messages: [{ role: "user", content: "Hello!" }] });
```
This calls your local agent easily, without manually constructing fetch requests. The client SDK provides methods corresponding to the API (e.g., `getWorkflow`, `agent.generate()`, `agent.stream()`, etc.), and handles details like URL construction.

## Integration with Frameworks

While developing locally, you might also integrate with a web framework. For instance, if building a Next.js app, you could:
- Run `mastra dev` alongside `next dev`.
- Use the client SDK in your Next.js frontend to query the local Mastra server.
There's also a guide for Next.js integration (see **Frameworks: Next.js** docs) which shows how to embed Mastra directly into a Next.js API route or as middleware.

But for most cases, keeping Mastra dev server separate during development is fine.

## Summary

Mastra's local development tools (CLI, dev server with UI, client SDK) make it convenient to build and test your LLM application:
- Scaffold the project, 
- Code your agents/tools/workflows,
- Run `mastra dev` and interact in real-time,
- Iterate quickly based on agent responses and logs.

Use these resources to refine prompts, fix bugs in tools, and ensure your workflows and agents behave as expected before deploying.
