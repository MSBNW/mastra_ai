# Workflows API (Client SDK)

The **Workflows API** allows you to list and interact with automated workflows defined in Mastra. Workflows consist of multiple steps and can be executed to perform complex sequences of actions.

## Getting All Workflows

Retrieve all available workflows:

```ts
const workflows = await client.getWorkflows();
```

This returns all workflow definitions registered on the server (often keyed by name or ID).

## Working with a Specific Workflow

Get an instance of a specific workflow by its ID or name:

```ts
const workflow = client.getWorkflow("workflow-id");
```

With the `workflow` object, you can inspect or execute the workflow.

## Workflow Methods

On a `workflow` instance, you have methods to manage its execution:

### Get Workflow Details

Retrieve information about the workflow (metadata, steps, etc.):

```ts
const details = await workflow.details();
```

This may return a summary of the workflow's structure or configuration.

### Execute Workflow

Start (execute) the workflow to completion and get the final result:

```ts
const result = await workflow.execute({
  input: {
    param1: "value1",
    param2: "value2",
  }
});
```

Parameters:
- **input:** an object containing input values for the workflow's initial step(s). The keys should match what the workflow expects.

This `execute()` call will run the entire workflow synchronously (awaiting each step), and `result` will contain the final output once the workflow finishes.

### Resume Workflow

Resume a previously *suspended* workflow at a certain step:

```ts
const result = await workflow.resume({
  stepId: "step-id",
  runId: "run-id",
  contextData: { key: "value" }
});
```

Parameters:
- **stepId:** The identifier of the step to resume (which was waiting/suspended).
- **runId:** The identifier of the workflow run (the execution instance).
- **contextData:** Any additional data required to resume (this could supply results or inputs needed to continue).

This continues the workflow from where it left off.

### Watch Workflow

Watch the workflow's execution in real-time through an asynchronous iterator:

```ts
// Start a workflow run and get its runId:
const { runId } = await workflow.startRun({ input: { /* ... */ } });

// Watch the workflow transitions for this run:
const workflowWatch = workflow.watch({ runId });

// Iterate over transitions:
for await (const record of workflowWatch) {
  // 'record' contains the latest state of the workflow run at each transition
  console.log({
    activePaths: record.activePaths,
    context: record.context,
    timestamp: record.timestamp,
    runId: record.runId
  });
}
console.log('Workflow done');
```

The `workflow.watch()` method returns an **AsyncGenerator** that yields a **WorkflowRunResult** each time the workflow's state changes (step completion, suspension, etc.). Each result record typically contains:
- **activePaths:** Array of objects indicating current active steps and their status (`completed`, `suspended`, or `pending`).
- **context:** An object representing the workflow's context (state), including status of each step and any data associated with them.
- **timestamp:** A timestamp (Unix epoch) when this transition occurred.
- **runId:** The workflow run's unique identifier.
- **suspendedSteps:** (if any) details of steps that are currently suspended and waiting.

This allows you to monitor progress and react to each step's completion.

*(Under the hood, the workflow runner yields updates until all steps reach a terminal state such as completed or a suspension point.)*

The **Workflows API** gives you full control to start workflows, wait for results, resume paused workflows, and even observe their execution. Use it to orchestrate complex behaviors in your application by delegating tasks to server-defined workflows.
