# Workflow Control Flow

Workflows allow sophisticated control flow mechanisms to handle branching, parallel execution, and conditional paths. Here's how you can manage different execution patterns:

## Sequential vs Parallel

By default, using `.then(stepB)` after `.step(stepA)` links steps sequentially (B runs after A completes). If you want two steps to run in parallel (concurrently), you can initiate them from the same preceding step:

```ts
myWorkflow.step(stepStart);
myWorkflow.then(stepBranch1, { parallel: true });
myWorkflow.then(stepBranch2, { parallel: true }).commit();
```

In this hypothetical API, if `parallel: true` is set, `stepBranch1` and `stepBranch2` both receive `stepStart` as their predecessor and can execute simultaneously. (The exact API for parallel may differ; some frameworks use `.branch()` or adding multiple steps in an array.)

Mastra's documentation suggests support for parallel and advanced flows, so consult the reference for the precise syntax. The key is: parallel steps share the same parent in the execution graph.

## Conditional Branching (If/Else)

To execute steps conditionally, you can use conditions on workflow links. Mastra provides an `.after()` method that can take a condition (like run on success or failure of previous step), and likely an `.if()`/`.else()` API for explicit conditions.

Example pattern:
```ts
myWorkflow
  .step(stepA)
  .then(stepB)
  .after(
    context => context.steps.stepB.output.value > 0, 
    stepC
  )
  .after(
    context => context.steps.stepB.output.value <= 0, 
    stepD
  )
  .commit();
```

In this pseudo-code:
- After stepB, if the output `value` is positive, stepC runs; if not, stepD runs. Only one of C or D will execute depending on the condition outcome.

Mastra likely has a more structured way (like `Workflow.if(condition).step(stepC).else().step(stepD)` etc., as hinted by references). The effect is to create an if/else branch in the workflow.

## Merging Branches

If you had parallel or conditional branches that should converge later, ensure subsequent steps have all required data. You might design the steps such that both branches set some workflow variable or produce outputs needed by the merging step.

For example, you might have:
```ts
// After stepC or stepD, both lead to stepE
myWorkflow.after("success", stepE);
```
By using `.after("success", stepE)` on both C and D, you indicate stepE should wait until any preceding branch that succeeded calls it. StepE can then use context to see which branch provided data.

Mastra's workflow engine handles tracking which steps are complete. The general approach is:
- Use unique IDs for steps.
- In a merge step, check context for outputs from possibly multiple predecessors (some might not exist if their branch didn't run).

## Loops (While/Until)

If you need to repeat steps, Mastra supports loop constructs:
- `.while(condition).step(stepX)` repeats stepX while condition holds.
- `.until(condition)` similar but runs until condition is true.

For example, to loop a step until it returns a certain result:
```ts
myWorkflow.step(stepCheck).while(ctx => ctx.steps.stepCheck.output.needsRetry).step(stepCheck);
```
This is a simplified idea: `stepCheck` might set `needsRetry` in its output, and the loop will repeat it until `needsRetry` is false. Careful with loops to ensure termination.

## Error Handling (after Error)

Control flow can branch not only on custom conditions but also on step success/failure. `.after("error", stepX)` means execute stepX if the previous step failed. Similarly, `.after("success", stepY)` ensures stepY only runs if previous succeeded (this is default behavior of `.then`, effectively).

Using these, you can create try/catch-like flows:
```ts
myWorkflow.step(stepMain)
  .after("error", stepOnError)
  .after("success", stepOnSuccess)
  .commit();
```

If `stepMain` throws or returns an error, `stepOnError` executes; if it succeeds, `stepOnSuccess` executes.

## Example: Branching Path

Imagine a workflow that asks a question to an agent and then either follows up or ends based on the answer:
- Step1: Agent generates an answer.
- If answer is incomplete, Step2: Agent clarifies or retries.
- If answer is good, end workflow.

This could be implemented with a condition evaluating the answer quality:
```ts
workflow
  .step(generateAnswer)
  .after(ctx => ctx.steps.generateAnswer.output.complete === false, clarifyAnswer)
  .commit();
```
In this, `clarifyAnswer` runs only if `generateAnswer` output indicated incomplete answer.

## Summary

Mastra's workflow control flow features let you construct complex logic flows similar to a flowchart:
- Sequence (`.then`)
- Parallel (perhaps via `.step(...).then(step1, step2)` or an option)
- Branching (`.after(condition, step)` or `.if/else`)
- Loops (`.while`/`.until`)
- Error-specific branches (`.after("error", ...)`)

All these help to ensure the workflow covers different scenarios explicitly, rather than leaving it purely to the AI's discretion. For precise syntax and more examples, refer to the official docs or **Reference** pages like `Workflow.if()` and `Workflow.else()`.
