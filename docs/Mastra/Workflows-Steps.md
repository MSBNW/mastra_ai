# Workflow Steps

A **Step** is the fundamental unit of a Mastra workflow. Each step has defined inputs, outputs, and an execution function. Steps can be linked together to form the overall workflow.

When building a workflow, you have two ways to create steps:

## Inline Step Creation

You can define and add steps in one fluent sequence using the Workflow's chaining methods `.step()` and `.then()`. For example:

```ts
const myWorkflow = new Workflow({ name: "example" });

myWorkflow
  .step(new Step({
    id: "first",
    outputSchema: z.object({ result: z.number() }),
    execute: async ({ context }) => {
      // ... do something ...
      return { result: 42 };
    }
  }))
  .then(new Step({
    id: "second",
    execute: async ({ context }) => {
      const prev = context.steps.first.output.result;
      // ... do something with prev ...
      return {};
    }
  }))
  .commit();
```

In this style, we directly create `Step` instances inside the workflow chaining. The first step is added with `.step()`, subsequent steps with `.then()` to indicate order. This is concise for simple linear flows and keeps the definition close together.

## Creating Steps Separately

For better modularity or reusability, you can define steps as separate constants and then add them:

```ts
const stepA = new Step({ id: "A", execute: async () => { /* ... */ } });
const stepB = new Step({ id: "B", execute: async () => { /* ... */ } });

// Later on, in workflow definition:
myWorkflow.step(stepA).then(stepB).commit();
```

This approach separates the step logic from the linking. It's useful if:
- You want to reuse the same `Step` in multiple workflows.
- You want to keep each step's code isolated for clarity or testing.

Either approach is fine; Mastra doesn't differentiate beyond how you organize your code.

## Step Execution Context

Within a step's `execute` function, you have access to a `context` object. Important parts of `context`:
- `context.triggerData` – the initial input to the workflow (matching the triggerSchema).
- `context.steps` – an object containing the outputs and statuses of previously executed steps in this run. For example, `context.steps.first.output` gives you step "first"'s output, and `context.steps.first.status` gives its status ("success" or "error").
- `context.variables` – workflow variables (if any are set; see **Workflows-Variables.md**).
- You also have access to any Mastra instance or environment config if needed (not usually needed inside steps unless interacting with outside world).

By using `context.steps`, a step can make decisions based on prior results (as shown with checking `context.steps.first.output` above). This is how data flows between steps without global variables.

## Step Input/Output Schemas

Defining `inputSchema` or `outputSchema` on a Step is optional but recommended for complex steps:
- `inputSchema` (not shown in examples above) would validate any data passed *into* this step from a previous step via variables or mappings.
- `outputSchema` validates what the step returns.

In practice, many steps might not need explicit input schemas because they rely on `context` for input. But output schemas are great for ensuring the step's result is structured (especially if a later step expects certain fields to exist).

## Error Handling in Steps

If a step throws an error or returns a rejected Promise, Mastra will mark that step as "error". You can design workflows to handle errors:
- If a step errors out and there's no special handling, the workflow run might stop (unless you have an `.after()` chain for errors).
- You can use `.after("error", stepX)` to run a recovery step if a particular step fails (see **Workflows-ControlFlow.md** for branching by status).
- Each `context.steps.stepName.status` can be checked; in our earlier example, stepTwo checked if stepOne was success before using its output.

## Testing Steps

Since a Step's `execute` is just a function, you can test it independently. For example:

```ts
const result = await stepOne.execute({ context: { triggerData: { inputValue: 5 }, steps: {} } });
expect(result.doubledValue).toBe(10);
```

Providing a mock `context` with the data needed (triggerData or previous step outputs) allows unit testing of the step logic outside the full workflow environment.

In summary, Steps break down your workflow into manageable pieces, each with a single responsibility. This modularity makes complex workflows easier to reason about and maintain.
