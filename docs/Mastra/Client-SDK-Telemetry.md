# Telemetry API (Client SDK)

The **Telemetry API** allows retrieval of trace data and performance metrics (traces) from your Mastra application. This helps you monitor and debug your application's behavior and performance by examining detailed trace logs.

## Getting Traces

Retrieve collected traces, with optional filters and pagination:

```ts
const telemetryData = await client.getTelemetry({
  name: "trace-name",    // Optional: filter by trace name
  scope: "scope-name",   // Optional: filter by scope
  page: 1,               // Optional: page number for pagination
  perPage: 10,           // Optional: items per page
  attribute: {           // Optional: filter by custom attributes
    key: "value"
  }
});
```

Parameters (all optional):
- **name:** Filter traces by a specific trace name (e.g., a specific function or operation).
- **scope:** Filter by scope or category of traces.
- **page:** If the trace results are paginated, specify which page of results to retrieve (1-indexed).
- **perPage:** Number of trace records per page.
- **attribute:** An object specifying a key/value to filter traces by a custom attribute (for example, only get traces that have `attributes.key == "value"`).

The result `telemetryData` will typically include trace entries that match the criteria. Each trace entry may include information like start time, duration, involved components, etc., depending on how telemetry is recorded (often using OpenTelemetry under the hood).

Using the Telemetry API, you can programmatically fetch instrumentation data to analyze how your agents and workflows are executing, identify bottlenecks, or ensure correct operation over time.
