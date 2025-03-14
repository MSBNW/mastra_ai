# The Mastra Class (Core Framework)

The `Mastra` class is the core entry point of a Mastra application. It serves as a top-level orchestrator, managing agents, tools, workflows, and other configurations (like storage and telemetry). Typically, you instantiate a single `Mastra` in your app (for example, in `src/mastra/index.ts`).

## Initialization

To initialize Mastra, import it and create an instance:

```ts
import { Mastra } from "@mastra/core";
import { createLogger } from "@mastra/core/logger";

// Basic initialization
export const mastra = new Mastra({});

// Full initialization with all options
export const mastra = new Mastra({
  agents: [ /* Agent instances */ ],
  workflows: [ /* Workflow instances */ ],
  integrations: [ /* Integration instances */ ],
  logger: createLogger({ name: "My Project", level: "info" }),
  storage: /* MastraStorage instance */,
  tools: { /* custom toolName: toolFunction pairs */ },
  vectors: { /* custom vectorName: MastraVector instances */ }
});
```

You can think of `Mastra` as a registry:
- When you register **tools** with Mastra, all agents and workflows can use those tools.
- When you register **integrations** with Mastra, agents, workflows, and tools can use them.

## Constructor Options

When creating `new Mastra(options)`, you can pass:

- **agents?** (`Agent[]`, default `[]`): An array of Agent instances to register at startup.
- **tools?** (`Record<string, ToolApi>`, default `{}`): Custom tools to register. The object keys are tool names, and values are the tool implementation (Tool API object or function).
- **storage?** (`MastraStorage`): A storage engine instance for persisting data (if using a database or file storage for memory, etc.).
- **vectors?** (`Record<string, MastraVector>`): Vector store instances for semantic search or vector-based tools (e.g., Pinecone, PgVector, Qdrant). Keys identify the vector store name.
- **logger?** (`Logger`, default: a console logger at INFO level): Logger instance (often created via `createLogger`) to be used by all components (agents, workflows, etc.).
- **workflows?** (`Record<string, Workflow>`, default `{}`): Workflows to register. Keys are workflow names (IDs) and values are Workflow instances.
- **serverMiddleware?** (Array of `{ handler: (c, next) => Promise<Response|void>, path?: string }`, default `[]`): Server middleware functions to apply to API routes. Each middleware can optionally specify a path pattern (default is `/api/*` if not provided). This allows custom Express-style middleware on the Mastra server.

*(Additional properties like **integrations** or **telemetry** can also be passed if supported, although those may be set via separate methods as shown below.)*

## Methods

Once you have a `mastra` instance, it provides methods to access the registered components:

- **getAgent(name: string):** Returns the Agent instance with the given name/ID. Throws an error if not found.
- **getAgents():** Returns an object containing all agents, keyed by their names/IDs.
- **getWorkflow(id: string, options?: { serialized: boolean }):** Returns a Workflow instance by ID. If `serialized` is true (default false), it may return a simplified representation instead of the full instance (e.g., just name).
- **getWorkflows(options?: { serialized: boolean }):** Returns all registered workflows. If `serialized` is true, returns simplified representations.
- **getVector(name: string):** Returns a MastraVector instance by name. Throws if not found.
- **getVectors():** Returns all registered vector stores as an object (keyed by name).
- **getDeployer():** Returns the configured Deployer instance (if any) that will handle deployments. (This is set if you initialized Mastra with a deployer or via CLI).
- **getStorage():** Returns the configured MastraStorage instance (if any).
- **getMemory():** *(Deprecated)* Returns the configured MastraMemory instance. (Note: using `Mastra.getMemory()` is deprecated; memory should be attached to agents directly instead.)
- **getServerMiddleware():** Returns the array of server middleware functions that have been configured.
- **setStorage(storage: MastraStorage):** Assigns a storage engine instance to the Mastra app (if you need to set or replace it after initialization).
- **setLogger({ logger: Logger }):** Sets the logger for all components. This overrides the logger if you need to change logging behavior at runtime.
- **setTelemetry(telemetry: TelemetryConfig):** Sets the telemetry configuration for all components (to adjust tracing/metrics behavior).
- **getLogger():** Gets the current Logger instance in use.
- **getTelemetry():** Gets the current telemetry configuration (if any).

- **getLogsByRunId({ runId, transportId? }):** Returns a Promise that resolves with logs for a specific run ID (and optionally filtered by a specific log transport).
- **getLogs(transportId?: string):** Returns a Promise resolving to all logs (optionally for a specific transport) from the Mastra logging system.

## Error Handling

Methods of the Mastra class will throw **typed errors** when something goes wrong (for example, trying to retrieve an agent or tool that doesn't exist). You can catch these errors and handle them appropriately. For instance:

```ts
try {
  const tool = mastra.getTool("nonexistentTool");
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
    // e.g., "Tool with name nonexistentTool not found"
  }
}
```

By organizing your application around a single `Mastra` instance, you centralize the configuration and lifecycle of your AI agents and workflows. This makes it easier to manage and deploy the system as a whole.
