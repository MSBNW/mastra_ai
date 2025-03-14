# `mastra dev` (CLI Command Reference)

The `mastra dev` command starts a local development server for your Mastra project. This server exposes REST endpoints for your agents, tools, and workflows so you can interact with them during development (for example, via HTTP requests or a front-end application).

Running `mastra dev` essentially launches your Mastra application in a local server mode.

## Usage

```bash
mastra dev [options]
```

Without options, it will look for your Mastra project in the current working directory and start the server on the default port (4111).

## Options

- **`--dir <path>`:** Path to your Mastra directory (if your Mastra files are not in the current directory). Defaults to the current working directory. For example, `mastra dev --dir src/mastra` if your agents/tools are under `src/mastra`.
- **`--tools <paths>`:** Comma-separated additional tool directories to load. If you have tools defined outside the main Mastra folder, you can specify them. Example: `--tools src/tools/dbTools,src/tools/scraperTools` to include those directories.
- **`--port <number>`:** Port number for the dev server (default is `4111`).

## Endpoints and Routes

When you run `mastra dev`, it will compile your Mastra application and start a local HTTP server. By default, the following endpoints are available:

### Agent Routes

*(Agents should be exported from `src/mastra/agents` for auto-discovery.)*

- **GET `/api/agents`:** Returns a list of all registered agents.
- **POST `/api/agents/:agentId/generate`:** Sends a prompt to the agent with ID `:agentId` and returns the agent's response. (The request body should contain the message(s) or conversation for the agent.)

### Tool Routes

*(Tools should be exported from `src/mastra/tools` or any additional directories specified.)*

- **POST `/api/tools/:toolName`:** Invokes the tool named `:toolName`. The request body should contain any inputs the tool requires. The response will be the tool's output.

### Workflow Routes

*(Workflows should be exported from `src/mastra/workflows`.)*

- **POST `/api/workflows/:workflowName/start`:** Starts the workflow named `:workflowName`. The request body can include input data for the workflow. Returns an identifier or result for the started workflow.
- **POST `/api/workflows/:workflowName/:instanceId/event`:** Sends an event or trigger to a running workflow instance (`instanceId`) of the given workflow. Use this to push new data or signals into a workflow that supports external events.
- **GET `/api/workflows/:workflowName/:instanceId/status`:** Gets the current status/state of a running workflow instance.

### OpenAPI Specification

- **GET `/openapi.json`:** Returns an auto-generated OpenAPI (Swagger) JSON specification describing the API endpoints (agents, tools, workflows) exposed by the dev server. This is helpful for documentation or integrating with tools that accept OpenAPI specs.

(The OpenAPI spec will include definitions for the generate and tool endpoints, etc., reflecting your project's capabilities.)

## Additional Notes

- **Default Port:** If you don't specify `--port`, the server listens on **4111**. Open [http://localhost:4111](http://localhost:4111) to verify it's running (it might show a simple welcome or a 404 for root path, but the `/api/...` routes will be active).
- **Environment Variables:** Make sure you have a `.env` or `.env.development` file set up for any API keys or config your agents/tools need (e.g., `OPENAI_API_KEY`). The dev server will load these.
- **Auto-reload:** Currently, `mastra dev` will need a restart if you change code. (Depending on Mastra's tooling, it may watch files, but if not, you can stop and restart to pick up changes.)

### Example Request

After starting the dev server, you can test an agent via `curl` or similar:

```bash
curl -X POST http://localhost:4111/api/agents/myAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "Hello, how can you assist me today?" }
    ]
  }'
```

This will send a user message to the agent with ID `"myAgent"` and should return the agent's generated response as JSON.

## Related Documentation

- The **REST Endpoints Overview** (in Mastra docs) provides more details on how to use these endpoints.
- Use `mastra deploy` (after developing) to deploy your project to an environment like Vercel or Cloudflare (see `mastra deploy` reference for details).

`mastra dev` is your go-to for local testing and development, giving you a local server to interact with all parts of your Mastra application in real time.
