# Logs API (Client SDK)

The **Logs API** provides methods to retrieve system logs and debugging information from your Mastra server (if logging is enabled on the server side). This can be useful for debugging or monitoring.

## Getting Logs

Retrieve logs, with optional filtering:

```ts
const logs = await client.getLogs({
  transportId: "transport-1"
});
```

Parameters:
- **transportId** (optional): If your logging system uses multiple transports or channels, you can specify which transport's logs to fetch. (For example, `transportId` might correspond to a specific logging provider or stream.)

Without any filter, `getLogs()` may return all available logs. With a `transportId`, it returns logs from that specific logging output.

## Getting Logs for a Specific Run

Retrieve logs associated with a specific execution run (identified by a run ID):

```ts
const runLogs = await client.getLogForRun({
  runId: "run-1",
  transportId: "transport-1"
});
```

Parameters:
- **runId:** The ID of the run/execution you want logs for (for instance, a workflow run or agent interaction run identifier).
- **transportId** (optional): As above, specify if you only want logs from a particular transport or logging system.

This returns logs that match the given run (and transport, if provided).

Both methods return log data (likely an array or object of log entries). The structure of log entries might include timestamps, log levels, messages, etc., depending on how Mastra's logging is configured.

Use the Logs API to fetch diagnostic information from your Mastra server, which can help in understanding what happened during agent executions, tool calls, workflow runs, etc.
