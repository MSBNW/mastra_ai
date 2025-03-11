# Document Chunking and Embedding (RAG)

This section dives deeper into how Mastra handles **chunking** documents and generating **embeddings** for RAG.

## Chunking Strategies

Mastra supports multiple chunking strategies to break documents into pieces suitable for LLM context:
- **Recursive Chunking**: Splits the text recursively by sections (like chapters -> paragraphs -> sentences) until chunks of a target size are obtained. This preserves coherence within chunks.
- **Sliding Window**: Uses a fixed window size (in characters or tokens) and slides with overlap. Ensures coverage of all text, with overlaps to capture context that falls on chunk boundaries.
- **By Delimiter**: Possibly chunk by headings, bullet points, or JSON keys depending on content type.

When calling `doc.chunk({ strategy, size, overlap })`, choose:
- `strategy`: e.g., `"recursive"` (common default).
- `size`: target chunk size (characters or tokens, check docs).
- `overlap`: how much overlap between chunks (for sliding strategy).

If your document is small, one chunk might be the whole thing. If it's large (long article, book), chunks allow partial retrieval.

**Tip**: Aim for chunk size that fits well under your model's context window (e.g., if model can handle 4k tokens, maybe chunks of 500-1000 tokens, retrieving a few chunks per query).

## Embedding Generation

Mastra uses the Vercel AI SDK's embedding functions (or AI SDK integrated providers) to get vector representations. Key functions:
- `embedMany({ values, model })`: embed an array of texts (`values`) using the specified model (e.g., `openai.embedding("text-embedding-ada-002")`). Returns an array of embedding vectors.
- Possibly `embed(text)` for a single string.

You should use a **semantic embedding** model (like OpenAI Ada or Cohere embeddings) for meaningful similarity. Ensure the same model is used for indexing documents and for queries.

Mastra abstracts some of this; for example, Mastra might default to a small embedding model (like bge-small) if you don't specify.

## Using Mastra Tools for RAG

Mastra provides ready-made tools to simplify RAG:
- **Document Chunker Tool**: Likely available via `createDocumentChunkerTool()`. This could automatically chunk input text.
- **Vector Store Tools**: e.g., `createVectorQueryTool()` to query a vector store, or `createGraphRAGTool()` to combine chunking, embedding, and retrieval.

If you use these tools, an agent could call them as needed instead of you writing all logic manually. For example, an agent question could trigger a RAG tool that returns relevant text, which the agent then uses to answer.

Check Mastra's reference for these tool creation functions:
- `createDocumentChunkerTool(options)` – likely returns a tool that takes a document and outputs chunks.
- `createVectorQueryTool(options)` – returns a tool to query a configured vector DB with a query string.

## Managing Metadata

When chunking, it's often useful to attach metadata (like document title, source, section) to each chunk. Mastra's MDocument might support metadata that carries through to embedding and can be stored in vector DB (if the DB supports metadata filtering).

For example:
```ts
const doc = MDocument.fromText(text, { metadata: { source: "FAQ", id: "doc1" } });
const chunks = await doc.chunk({ strategy: "recursive", size: 300 });
chunks[0].metadata  // might include source, id, and maybe positional info.
```

When storing, some vector DBs allow storing metadata alongside vectors (Pinecone, for instance). You could use that to filter results (e.g., only retrieve from certain source).

## Putting it Together

A typical RAG setup sequence:
- Preprocessing (offline or at startup):
  - Load documents.
  - Chunk them with appropriate strategy.
  - Embed each chunk.
  - Store vectors in DB with any needed metadata.
- At query time:
  - Embed the user's query.
  - Query vector DB for similar chunks.
  - Take top K chunks' text.
  - Provide them to the LLM (via agent prompt or workflow step) to generate final answer.

Mastra helps with each step but also lets you plug in custom logic if needed (for example, if you want to combine keyword search with vector search, you could).

By carefully chunking and embedding your documents, you ensure that the retrieval step brings back the most relevant pieces of information for a given question, which the LLM can then use to produce accurate, grounded responses.
