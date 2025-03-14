# Tools API (Client SDK)

The **Tools API** allows you to list and use the tools that are available to your agents via the Mastra platform. Tools are functions or actions that an agent can execute (e.g., calling an external API or performing a calculation).

## Getting All Tools

Retrieve a list of all available tools:

```ts
const tools = await client.getTools();
```

This returns a collection (e.g., array or object) of all tools registered on the server.

## Working with a Specific Tool

Get an instance/reference to a specific tool by name or ID:

```ts
const tool = client.getTool("tool-id");
```

Now `tool` can be used to inspect or invoke that particular tool.

## Tool Methods

Once you have a `tool` object, you can perform actions like:

### Get Tool Details

Retrieve detailed information about a tool (such as its name, description, input/output schema):

```ts
const details = await tool.details();
```

This returns the tool's metadata and definition (for example, the input schema it expects, description, etc.).

### Execute Tool

Execute a tool with specific arguments:

```ts
const result = await tool.execute({
  args: {
    param1: "value1",
    param2: "value2",
  },
  threadId: "thread-1",   // Optional: Provide a thread context (conversation ID)
  resourceId: "resource-1"// Optional: Provide a resource/user context
});
```

Parameters for `tool.execute()`:
- **args:** An object containing the arguments required by the tool. The keys and values must conform to the tool's input schema.
- **threadId** (optional): If the tool needs context of a conversation thread (e.g., to access conversation history), provide the thread's ID.
- **resourceId** (optional): If the tool usage is tied to a particular user or resource, provide that ID.

The `execute()` call returns the tool's result (whatever the tool is programmed to return, e.g., some data or confirmation).

Using the Tools API, your client-side code can query what tools exist and trigger those tools as needed. Each tool's functionality and usage will depend on how it was defined on the server.
