# Workflow Suspension and Resumption

Mastra Workflows support **suspend & resume** functionality for cases where a workflow must wait for external input or a long asynchronous event before continuing. This is crucial for workflows that involve a human-in-the-loop or external triggers.

## Suspending a Workflow

A workflow can be suspended at a specific step. Typically, you'd design a step to call `context.suspend()` or simply not complete until an event is received. In practice, Mastra likely provides a way to mark a step as suspendable. For example, you might have:

```ts
const waitForUser = new Step({
  id: "waitForUser",
  execute: async () => {
    return new Promise(() => {}); // never resolves, placeholder
  }
});
```

This step would never resolve on its own (thus suspending the run). However, Mastra's engine likely detects this and formally marks the workflow as suspended, or you would explicitly call something like `Workflow.suspend()`.

A more structured approach might be:
- The workflow is started and when it hits the suspend step, Mastra returns control to you with a runId and a status "suspended".
- The step may output a token or ID indicating what input is expected next.

## Resuming a Workflow

To resume, Mastra exposes an API endpoint or method to feed the awaited input and continue the run. For example, if the workflow is waiting for user input or an event, you'd call:

```
POST /api/workflows/<workflowName>/<runId>/event
```
with some data, which corresponds to resuming the suspended step.

In code, if using the client SDK:
```ts
myWorkflow.resume(runId, eventData);
```
(This is conceptual; actual API may differ.)

On resume, Mastra will take the provided event data, supply it to the suspended step or the workflow context, and continue executing subsequent steps.

## Example Scenario

Imagine a hiring workflow:
1. Step1: LLM creates a draft email.
2. Step2: Workflow suspends, waiting for a human manager to approve or edit the email.
3. Once approved, the manager triggers resume with their edits.
4. Step3: Workflow sends the email.

In this case:
- Step2 would be a suspend point. Perhaps it outputs a draft and then calls `context.suspend()` (or simply does not call `return`).
- The system shows the draft to the manager (maybe via the UI, using the output from Step1).
- Manager approves and clicks a button which triggers an API call to resume the workflow with, say, `{"approvedDraft": "final text"}`.
- The resume API calls unlock Step2, providing the `"approvedDraft"` as input to Step3.
- Step3 proceeds to send the email using that approved draft.

Mastra's documentation likely covers the exact mechanism (like storing state to restart). Under the hood, the workflow state (all completed steps and their outputs) is stored in a durable store (since process may wait minutes or hours).

## Implementation Details

- **State Persistence**: For suspend/resume to work reliably, you should configure a persistent storage (not just in-memory) for workflows, so that if the server restarts, it can resume. Mastra probably uses the same storage configured for memory or a separate store to save workflow runs.
- **Events**: The resume often called "sending an event" to the workflow. The event is the external data or trigger that unblocks the pause.
- **Timeouts**: You may implement timeouts — if a workflow stays suspended too long, maybe auto-cancel or notify someone.
- **Security**: When exposing resume endpoints, ensure that only authorized sources can trigger them (e.g., require an API key or tie runId to a user session in your app logic).

## API Endpoints

In the dev server, endpoints for workflow control include:
- `POST /api/workflows/<workflowId>/start` – to start a new run (or `/execute` as we used earlier, which implicitly starts).
- `POST /api/workflows/<workflowId>/<runId>/event` – to post an event to a running (likely suspended) workflow.
- `GET /api/workflows/<workflowId>/<runId>/status` – to check if it's running, suspended, completed, etc.

Check Mastra's OpenAPI spec (accessible at `/openapi.json` when running `mastra dev`) for the exact paths.

By using suspend/resume, you enable **long-running processes** with human or external decision points to be handled cleanly by Mastra Workflows. This pattern is powerful for enterprise automation scenarios.
