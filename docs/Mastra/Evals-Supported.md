# Supported Evaluation Metrics

Mastra provides a set of **pre-built evaluation metrics** (evals) to assess various aspects of agent outputs. These are grouped by the aspect they measure:

### Accuracy and Reliability

- **Hallucination** – Detects if the response contains fabricated or unsupported information.
- **Faithfulness** – Checks whether the response stays faithful to provided source material or facts.
- **Content Similarity** – Compares the similarity between the output and expected text (useful if you have a reference answer).
- **Textual Difference** – Measures how much the output text differs from some reference (inverse of similarity).
- **Completeness** – Checks if the output includes all required pieces of information.
- **Answer Relevancy** – Measures how directly the answer addresses the user's question.

### Understanding Context

- **Context-Position** – Evaluates if the agent appropriately placed or utilized provided context in its answer (e.g., citing at the right time).
- **Context-Precision** – Assesses accuracy in using context (no extraneous info beyond context).
- **Context-Relevancy** – Measures relevance of the context used in the answer.
- **Contextual-Recall** – Checks if important info from context was recalled/included.

*(These metrics are especially relevant when using RAG or giving the agent documents to refer to.)*

### Output Quality

- **Tone** – Analyzes the style/tone of the output. For instance, ToneConsistencyMetric ensures the tone matches the desired one (e.g., polite, formal).
- **Toxicity** – Detects harmful, offensive, or toxic content in the output.
- **Bias** – Detects presence of sensitive biases in the output (e.g., inappropriate generalizations).
- **Prompt-Alignment** – Checks if the output follows the instructions or prompt (i.e., did it answer the question or go off-track).
- **Summarization** – If the task was to summarize, evaluates the quality of the summary.
- **Keyword-Coverage** – Checks if certain key terms are present in the output when they should be.

Each of these metrics is implemented as a class (likely in `@mastra/evals`). For example:
- `HallucinationMetric`, `ToxicityMetric`, `BiasMetric`, etc.

They might use different methods:
- Some are rule-based or use simple heuristics (keyword coverage, possibly prompt-alignment).
- Others might use an LLM themselves (hallucination or faithfulness might compare output to source via an LLM judge, or use embedding similarity).
- Toxicity and bias might use pre-trained classifiers or model-graded via an AI.

### Using Supported Metrics

To use any of these, import from `@mastra/evals`. E.g.:
```ts
import { ToxicityMetric, BiasMetric } from "@mastra/evals/nlp";
```
(*the exact import path may vary – possibly `@mastra/evals` or submodules like `nlp` or `openai`.*)

Then add to agent's evals:
```ts
evals: {
  toxic: new ToxicityMetric(),
  bias: new BiasMetric()
}
```

Naming the keys is up to you; here "toxic" and "bias" keys will hold the scores.

### Interpreting Scores

- Score **1.0** generally means the output passed the check fully (no issues).
- Score **0.0** means it failed completely (e.g., definitely toxic or completely hallucinated).
- Values in between indicate partial compliance or severity.

For example, a ToxicityMetric might output 0.0 for a highly toxic phrase, 0.5 for a mildly offensive term, and 1.0 for no toxic content.

### Combining Metrics

You can use multiple metrics to get a well-rounded evaluation. For instance, to enforce quality, you might include:
- `HallucinationMetric`
- `ToxicityMetric`
- `ToneConsistencyMetric`
So you ensure factual accuracy, safety, and style.

Each metric will produce its score; you can look at them individually or average them for an overall score, depending on your needs.

### Extensibility

If you need a metric that isn't listed (for example, checking numerical accuracy or format compliance), you may implement a custom metric (see **Evals-Custom.md**).

Mastra's supported evals provide a good starting coverage for common concerns in LLM outputs such as truthfulness, completeness, and safety. Use them to automatically test your agent and maintain quality as you iterate.
