# Retrieval in RAG

The retrieval step is where we take a user's query or context and fetch relevant stored information (chunks) to augment the generation.

## Query Embedding

To retrieve, first embed the query using the **same embedding model** used for the document chunks. For example:

```ts
const query = "What does the document say about pricing?";
const queryEmbedding = await embedMany({
  values: [query],
  model: openai.embedding("text-embedding-3-small"),
});
```

This yields a vector (`queryEmbedding[0]`) representing the query in the semantic space.

If using the Mastra RAG tool flow, this might be handled for you – e.g., a `queryVector` might be generated internally by `createVectorQueryTool` given a query string.

## Similarity Search

Using the vector DB client (PgVector, Pinecone, etc.), perform a similarity search:

```ts
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: queryEmbedding[0],
  topK: 3
});
```

`topK` is how many similar chunks to retrieve. You might adjust this based on how much context you want to feed the LLM (common values are 3-5).

The `results` typically include:
- The IDs or references of the matching chunks.
- Possibly the chunk text itself (depending on the integration; some return only IDs and you must fetch the text via an ID->text mapping you stored).
- Similarity scores (how close the match is).

If `results` only have references, you'll need to map those to the actual chunk content. Make sure when inserting you kept track of which chunk corresponds to which ID.

## Using Retrieved Chunks

Once you have the relevant chunks:
- Concatenate or summarize them if needed.
- Construct the prompt for the LLM.

**Direct inclusion**: You might do something like:
```ts
const contextText = results.map(r => r.text).join("\n---\n");
const prompt = `You are an assistant with access to documents. 
Here are some relevant excerpts:
${contextText}

Question: ${userQuestion}
Answer:`;
const answer = await agent.generate(prompt);
```
This inlines the text. Ensure the combined length is within model limits.

**As context in structured way**: If using an agent with tools, you might instead feed the chunks as part of memory or a special system message.

Mastra's RAG examples might show providing the retrieved text in the agent's context (for example, using an in-context instruction "You have the following information from documents: ...").

If using a workflow, one step could fetch chunks and the next step could be an LLM call that gets those chunks via `context`.

## Ranking or Filtering Results

Sometimes you might get chunks that are somewhat relevant but not exactly. You can refine:
- Increase `topK` and then apply a second layer of filtering (maybe via a keyword match or asking an LLM to pick which chunks are truly relevant).
- Use metadata filters in the query if you only want certain sources.

Mastra's straightforward approach is just similarity, but you have the flexibility to add logic if needed.

## Example Integration in Agent

Mastra could allow an agent to do RAG by calling a tool that returns a piece of text, which the agent then incorporates in its answer. For example:
- Agent gets user question.
- Agent calls `vectorSearchTool` with that question (as if it were a function call).
- Tool returns a snippet of document text.
- Agent then continues answering using that snippet.

This requires a prompt style or model that can handle multi-turn reasoning (like OpenAI GPT-4 with function calling or chain-of-thought prompting).

If not using that, the simpler method is the workflow or manual prompt assembly as described.

## Ensuring Correctness

Remember that retrieved text may need slight preprocessing:
- If chunks cut off mid-sentence, maybe include an indicator (like "..." or try to chunk by sentence boundaries).
- If multiple chunks come from different parts, the assistant should not assume they are from one continuous source if they're not.

It's often helpful to include citations or source info in the final answer for user clarity, but for code generation we focus on providing the text.

## Putting RAG into Production

After validating that retrieval finds relevant info and the LLM uses it correctly:
- Keep your vector index updated if documents change (you might re-run chunk & embed on updates).
- Monitor cases where the LLM responds with "I don't know" or hallucinations; perhaps the retrieval didn't find what was needed (you might need to ingest more data or tune chunk sizes).
- Use evals (like a hallucination metric) to catch if the agent's answer includes unsupported info.

RAG, when configured properly in Mastra, significantly boosts an agent's ability to give factual, up-to-date answers grounded in your private data. It requires extra setup (the whole pipeline above), but Mastra's abstractions make it manageable to implement.
