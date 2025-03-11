# Workflow Variables

Workflow variables are a mechanism to pass data between steps that isn't strictly part of a single step's output. They allow you to set and get shared values accessible in the workflow context.

For example, suppose you want to store an intermediate value that multiple later steps need, or you want to map an output of one step to a differently named input for another. Variables provide that flexibility.

## Setting Variables

During workflow execution, you can set variables in the context. One way is via a step's output or a special step type. However, Mastra likely provides a method to define variables when linking steps.

Some patterns:
- Use a special step to produce a variable (e.g., a step that just outputs a value that is then treated as a workflow variable).
- Or assign part of a step's output to a variable name when linking.

Hypothetical example:
```ts
myWorkflow
  .step(stepGetData)
  .then(stepProcess, { mapInput: ctx => ({ data: ctx.steps.stepGetData.output }) })
  .commit();
```
In this pseudo-syntax, `mapInput` could be used to map the previous output to the next step's input. Alternatively, one could do:
```ts
myWorkflow.setVariable("data", ctx => ctx.steps.stepGetData.output);
```
which would store stepGetData's output in a variable named "data", accessible via `context.variables.data` in subsequent steps.

## Using Variables in Steps

Within a step's execute, you can access `context.variables`. For example, if a previous step or a mapping stored `context.variables.userId = 123`, a later step can read that.

Consider:
- Step1 retrieves a user profile and you store the user's id in a variable.
- Step2 might not directly follow Step1 (maybe it's in a different branch), but it can still access `context.variables.userId`.

**Note:** The trigger data of the workflow could also be considered an implicit variable for the whole run (accessible as `context.triggerData`). Use variables for anything that gets computed along the way and needs to be referenced globally in the workflow.

## Example

Imagine a workflow where:
- Step A fetches some data (no direct output needed by next step, but later step needs it).
- Step B makes a decision that doesn't need Step A's data.
- Step C uses data from Step A.

We can do:
```ts
// After Step A executes:
myWorkflow.setVariable("fetchedData", ctx => ctx.steps.stepA.output.data);
// Now Step C can use context.variables.fetchedData
```
This way, Step C's execute can do:
```ts
const data = context.variables.fetchedData;
```
even if Step B happened in between and didn't use that data.

## Passing Data Between Non-Adjacent Steps

Without variables, you typically pass data by chaining outputs to inputs through adjacent steps. But if Step C is not directly after Step A, variables or a global context is needed. Variables fill that role elegantly by decoupling data storage from step ordering.

## Best Practices

- Use variables sparingly. If data naturally flows from one step to the next, just use step outputs and inputs.
- Use descriptive variable names to avoid confusion.
- Clean up or overwrite variables if they won't be used later to avoid carrying large data unnecessarily (though in practice, it's fine as the scope is just one workflow run).
- Understand that variables are per-run and not shared between separate runs of the workflow.

Workflow variables provide a powerful way to handle complex data flow in your LLM applications, ensuring each step has access to the information it needs.
