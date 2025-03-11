# Evals Overview

**Evals** in Mastra are automated tests or evaluations for your agents' outputs. They help quantify qualities like correctness, consistency, or toxicity of the responses. Mastra provides built-in evaluation metrics (called **metrics** or **evals**) and allows custom ones.

Each eval metric produces a score (0 to 1) where 1 is best/passing and 0 is worst/failing. These scores can be logged to track your agent's performance over time or used in CI to ensure changes don't degrade responses.

## How to Use Evals

To use evals, you add them to an agent's configuration. Mastra has default metrics you can import from `@mastra/evals`. For example, to evaluate an agent's consistency of tone:

```ts
import { ToneConsistencyMetric } from "@mastra/evals/nlp";

export const myAgent = new Agent({
  /* ... other config ... */
  evals: {
    tone: new ToneConsistencyMetric()
  }
});
```

Here we added an eval metric named "tone" for the agent. The `ToneConsistencyMetric` might check if the agent's replies maintain a consistent tone given a system instruction.

Mastra's built-in metrics cover areas like:
- Tone consistency
- Toxicity detection
- Bias detection
- Relevance/faithfulness (if a reference text is provided)
- Factual accuracy (likely via a model judge)

After adding evals, whenever the agent generates output (in the dev environment dashboard), Mastra will compute these evals on the output. Also, these evals become available to use in tests.

You can view eval results in the Mastra dev UI (there may be a section showing scores for each message).

## Running Evals in CI/CD

To integrate evals into automated testing (CI pipeline), you can use a test framework like **Vitest**, **Jest**, or **Mocha**. Mastra provides an `evaluate()` helper function to run a metric on a given input/output pair.

Example with Vitest (similar for Jest):

```ts
import { evaluate } from "@mastra/core/eval";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";
import { myAgent } from "./index";

describe('My Agent', () => {
  it('should maintain tone consistency', async () => {
    const metric = new ToneConsistencyMetric();
    const result = await evaluate(myAgent, "Hello, world!", metric);
    expect(result.score).toBe(1);
  });
});
```

In this test:
- We create an instance of the metric we want to test.
- Use `evaluate(agent, prompt, metric)` which likely calls the agent to generate a response for the prompt and then computes the metric's score.
- We then assert something about `result.score`. Here we expect 1 (perfect score), but in real scenarios you might set a threshold, e.g., `toBeGreaterThan(0.8)`.

This approach allows automated regression testing of agent outputs. Keep in mind:
- The test will actually call the model (which could be slow and consume tokens). To mitigate, you might use a shorter prompt or a local model for CI, or run these tests less frequently.
- Ensure API keys are available in CI environment for the model (if needed).

Mastra can capture and display eval results in its dashboard if you set up the global listeners.

## Capturing CI Eval Results

Mastra's eval system can output results to the dashboard even from CI runs. To enable this, they suggest adding a global setup in tests that attaches listeners:

- **globalSetup.ts** (run once):
  ```ts
  import { globalSetup } from '@mastra/evals';
  export default function() {
    globalSetup();
  }
  ```
  This might initialize a connection to a results service.

- **testSetup.ts** (run before all tests):
  ```ts
  import { beforeAll } from 'vitest';
  import { attachListeners } from '@mastra/evals';
  import { mastra } from './your-mastra-setup';

  beforeAll(async () => {
    await attachListeners(mastra);
  });
  ```
  This attaches event listeners to capture eval events during tests. If you pass `mastra` (Mastra instance), it might store results in the configured storage.

By doing this, eval outcomes from tests are saved to Mastra's storage (if you configured one, like LibSQL or file). Then, when you run `mastra dev` locally, you might see historical eval scores for each test run.

If you want persistent storage of evals, ensure your Mastra instance in tests uses a file or database storage (not just memory).

## Supported Evals

Mastra comes with a variety of built-in metrics (see **Evals-Supported.md** for a comprehensive list). They cover:
- **Accuracy & Reliability**: e.g., `HallucinationMetric`, `FaithfulnessMetric`, etc., to judge if the answer is grounded or contains made-up info.
- **Context Usage**: e.g., metrics to evaluate how well the agent used provided context or followed instructions.
- **Output Quality**: e.g., `ToneConsistencyMetric`, `ToxicityMetric`, `BiasMetric`, `PromptAlignmentMetric`, etc., checking style, harmful content, bias, adherence to instructions.

You can choose which metrics are relevant to your application and attach them to agents.

## Custom Evals

If the default metrics don't cover a specific quality you care about, you can create your own metric by extending the `Metric` class. See **Evals-Custom.md** for details, but in short:
- Create a class extending `Metric` with a `measure(input, output)` method that returns a `MetricResult` (with a `score` and optional `info`).
- For complex evaluation, you might implement an LLM-based judge or special logic.

Once created, you can use your custom eval in the same way (add to agent's `evals` or use in tests).

## Using Evals Effectively

- During development, run your agent on sample queries and observe eval scores in the dev UI. This can highlight issues (e.g., a high toxicity score for certain prompts).
- In CI, set up tests for critical behaviors. For example, if your agent should never output something toxic when asked innocuous questions, add a test with the `ToxicityMetric` score expected to be 1.
- Use eval results to track progress when refining your agent or comparing different model choices.
- Possibly integrate evals as a gating mechanism: e.g., if an answer's score is below a threshold, you could have the agent try a different approach or flag the response.

Evals bring quantitative rigor to LLM development, which is often qualitative. By leveraging Mastra's eval framework, you can catch regressions and ensure your AI meets certain standards consistently.
