# Workflows Overview

Workflows in Mastra orchestrate complex sequences of LLM calls and function executions with deterministic control flow. While an agent is autonomous and reactive, a **workflow** is a predefined chain of steps you design. Workflows support branching, looping, parallel execution, pausing/resuming, and more, which is useful for multi-step tasks (e.g., a form-filling assistant or a research pipeline).

## When to Use Workflows

Use a workflow when your AI task involves multiple steps or decisions that must follow a specific logic. For example:
- Running multiple prompts in sequence (where each uses the result of the previous).
- If/then branching based on content of responses.
- Parallel calls to different models or tools and then merging results.
- Long processes that might need to pause for external input (human approval, etc.) and resume later.

Agents could handle some of these via the model's logic, but workflows give you **explicit control** and reliability for critical logic.

## Creating a Workflow

To create a workflow, use the `Workflow` class from `@mastra/core/workflow`. A workflow consists of:
- A **name** (used for identification and API endpoint).
- An optional **trigger schema** defining input data that triggers the workflow.

For example:

```ts
import { Workflow } from "@mastra/core/workflow";
import { z } from "zod";

const myWorkflow = new Workflow({
  name: "my-workflow",
  triggerSchema: z.object({ inputValue: z.number() }),
});
```

This defines a workflow named `"my-workflow"` which expects an object with `inputValue` (number) as input when started. The `name` also determines the endpoint (`/api/workflows/my-workflow/...`).

### Defining Steps

After creating a Workflow instance, define one or more **Step**s. Steps represent individual units of work (which could be an LLM call, a tool execution, or any function).

Example steps:

```ts
import { Step } from "@mastra/core/workflow";

const stepOne = new Step({
  id: "stepOne",
  outputSchema: z.object({ doubledValue: z.number() }),
  execute: async ({ context }) => {
    const input = context.triggerData.inputValue;
    return { doubledValue: input * 2 };
  },
});

const stepTwo = new Step({
  id: "stepTwo",
  execute: async ({ context }) => {
    if (context.steps.stepOne.status !== "success") {
      return { incrementedValue: 0 };
    }
    const prev = context.steps.stepOne.output.doubledValue;
    return { incrementedValue: prev + 1 };
  },
});
```

In this simplified example:
- `stepOne` takes the trigger input and doubles it.
- `stepTwo` waits for stepOne's result and then adds 1, but only if stepOne succeeded. (Each step's execution context can access prior steps' outputs and statuses via `context.steps`.)

### Linking Steps (Control Flow)

Once steps are defined, you link them into the workflow's execution order and then finalize (commit) the workflow:

```ts
myWorkflow
  .step(stepOne)      // first step
  .then(stepTwo)      // next step after stepOne
  .commit();
```

Here we say `stepOne` is the start, and then `.then(stepTwo)` means stepTwo runs after stepOne completes successfully. We call `.commit()` to finalize the structure. After committing, no more steps can be added (it's locked in for execution).

If you had branching or parallelism, you might use different linking methods (see **Workflows-ControlFlow.md** for advanced patterns). For linear flows, `.then()` is sufficient.

### Register the Workflow

Just like agents, workflows must be registered with Mastra to be active. In `src/mastra/index.ts`:

```ts
export const mastra = new Mastra({
  workflows: { myWorkflow },
  // ... (agents, memory, etc.)
});
```

Registering makes the workflow discoverable by `mastra dev` and accessible via API.

### Executing the Workflow

You can start a workflow either programmatically or via the HTTP API.

**Programmatically**: Use the `createRun()` method to initialize a run, then call `start()`:

```ts
const { runId, start } = myWorkflow.createRun();
await start({ triggerData: { inputValue: 45 } });
```

This kicks off the workflow with `inputValue = 45`. The steps will execute in order. The `runId` can be used to track or query the run's status later.

**Via API**: Once running `mastra dev`, you can trigger via an endpoint:

```
POST http://localhost:4111/api/workflows/my-workflow/execute
Content-Type: application/json

{ "inputValue": 45 }
```

This will start the workflow similarly. The response will typically contain a runId or the result if it finishes quickly.

If the workflow is long-running or has async steps, you might retrieve status via:
```
GET /api/workflows/my-workflow/<runId>/status
```
(And if waiting for external events, there are event endpoints—see suspend/resume.)

### Example Recap

In our example, triggering with 45:
- `stepOne` outputs `{ doubledValue: 90 }`.
- `stepTwo` sees stepOne succeeded and outputs `{ incrementedValue: 91 }`.
- The workflow result would collect outputs (often the last step's output is the result, or you can design a specific result aggregation).

This simple workflow didn't involve any LLM calls, but you could incorporate them by calling `agent.generate()` or similar inside a step's execute, or by using special LLM step types.

## Further Workflow Concepts

Workflows can do much more:
- **Parallel Steps**: You can run steps in parallel branches and then join results.
- **Conditional Branching**: Use `.after(condition, step)` or `.if(predicate).step(step)` patterns to run steps only if certain conditions are met (success/failure of previous steps, or custom logic).
- **Loops**: Methods like `.while(condition).step(step)` and `.until(condition)` allow repeating steps until a condition changes.
- **Suspend & Resume**: A workflow can pause (suspend) at a step waiting for an external event or manual input, then resume when that event is supplied. This is done by marking a step as suspendable and using the API to send an event to resume (see **Workflows-SuspendResume.md** for details).
- **Variables**: Workflow variables allow you to store intermediate values and pass data between steps more flexibly than just through outputs (see **Workflows-Variables.md**).
- **Observability**: Mastra logs each step's input, output, and status. You can forward these logs to monitoring systems (e.g., Logflare, Datadog) for debugging or analysis.

Workflows thus give you a structured way to implement multi-step AI logic that might be too complex for a single agent prompt. They are particularly useful for ensuring certain operations happen or for integrating deterministic logic with LLM calls (like "call API A, then summarize the result with LLM, then if condition X, call API B," etc.).

In the following topics, we'll dive into specific workflow features like control flow, variables, and suspension.
