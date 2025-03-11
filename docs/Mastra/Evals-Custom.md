# Custom Evaluation Metrics

If Mastra's built-in evals don't cover a specific requirement, you can create your own **custom eval**. This is done by extending the base `Metric` class.

## Basic Custom Metric Example

A custom metric needs to define a `measure(input: string, output: string) -> MetricResult`. The `MetricResult` typically has:
- `score: number` (0 to 1),
- `info: { ... }` (optional object with additional info about the evaluation).

### Example: Keyword Coverage Metric

Suppose we want to ensure the agent's output contains certain keywords. We can create a `KeywordCoverageMetric`:

```ts
import { Metric, MetricResult } from "@mastra/core/eval";

interface KeywordCoverageResult extends MetricResult {
  info: {
    totalKeywords: number;
    matchedKeywords: number;
  };
}

export class KeywordCoverageMetric extends Metric {
  private referenceKeywords: Set<string>;

  constructor(keywords: string[]) {
    super();
    this.referenceKeywords = new Set(keywords);
  }

  async measure(input: string, output: string): Promise<KeywordCoverageResult> {
    if (!output) {
      // If output is empty, score 0 if any keywords expected
      return {
        score: this.referenceKeywords.size === 0 ? 1 : 0,
        info: { totalKeywords: this.referenceKeywords.size, matchedKeywords: 0 }
      };
    }

    const matched = [...this.referenceKeywords].filter(k => output.includes(k));
    const total = this.referenceKeywords.size;
    const coverage = total > 0 ? matched.length / total : 1;
    return {
      score: coverage,
      info: {
        totalKeywords: total,
        matchedKeywords: matched.length
      }
    };
  }
}
```

In this example:
- We store a set of keywords in the constructor.
- The `measure` function checks how many of those keywords appear in the `output`.
- It returns a score equal to the fraction of keywords present, and info with counts.
- If there are no keywords expected, it returns score 1 (nothing required, nothing missing).
- If output is empty but keywords were expected, score 0.

This metric can then be used like:
```ts
evals: { keywords: new KeywordCoverageMetric(["Mastra", "AI", "framework"]) }
```
to ensure the agent mentions those terms.

## Custom LLM-Judge Metric

For more complex evaluation, you might use an LLM itself as a judge. Mastra has `MastraAgentJudge` class for that:
- This likely allows you to create a hidden agent that evaluates the main agent's output given the input.

For instance, a custom "Recipe Completeness" judge might:
- Take the user's question and the agent's answer (which is a recipe).
- Have an internal prompt that asks "Does this recipe include all necessary steps and ingredients? If not, list missing ones."
- The judge agent (maybe using GPT-4) returns a verdict and missing items.
- The metric then interprets that: if missing list is empty, score 1, otherwise lower.

From the doc snippet, they show a `RecipeCompletenessJudge` extending `MastraAgentJudge` where:
- The judge is initialized with instructions and an LLM model.
- It defines an `evaluate(input, output)` that runs the judge agent to get a result (like missing items, verdict).
- That result can then be converted into a score.

LLM-based metrics are powerful for subjective or complicated evaluations (like "is the explanation correct and clear?") but they rely on another model – keep in mind cost and potential inconsistency.

## Integration of Custom Metrics

Once your custom metric class is defined:
- You can add it to an agent's `evals` just like built-ins.
- Or use it in tests with `evaluate(agent, prompt, new YourMetric())`.

If your metric needs context beyond input/output, you may need to provide that when calling `evaluate`. For example, if evaluating against a reference text, your metric might need that reference. In such cases, you could pass the reference in the agent's prompt or extend `evaluate()` usage accordingly.

## Best Practices for Custom Evals

- **Deterministic vs AI-based**: Prefer deterministic checks (like string contains, regex, calculations) for specific, objective criteria (they are faster and stable). Use AI-based judges for nuanced criteria.
- **Normalize Text**: In measure(), consider normalizing case, removing punctuation, etc., depending on what you evaluate (to avoid missing a keyword due to capitalization, for example).
- **Scaling Score**: Make sure to bound your score 0-1. If you compute some value, clamp or normalize it.
- **Info Field**: Provide helpful details in `info` for debugging. E.g., which keywords were missing, or what issues were found. These can show up in logs or dashboard to understand why a score was not perfect.

Creating custom evals ensures you can test what matters specifically for your application. Whether it's adherence to a format, inclusion of specific content, or some domain-specific correctness measure, you have full control to implement it in Mastra's eval framework.
