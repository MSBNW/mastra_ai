# Retrieval-Augmented Generation (RAG) Overview

Retrieval-Augmented Generation (RAG) is a technique to enhance LLM responses with relevant information fetched from an external knowledge source (your documents, databases, etc.). Mastra provides standardized APIs to implement RAG workflows: chunking documents, embedding them into a vector store, and retrieving them for queries.

In Mastra, RAG involves these steps:
1. **Document Processing (Chunking)** – Breaking documents into smaller pieces.
2. **Embedding** – Converting those chunks into vector embeddings.
3. **Vector Storage** – Storing embeddings in a vector database.
4. **Retrieval** – Given a user query, embedding the query and finding similar chunks.
5. **Augmentation** – Supplying retrieved text chunks to the LLM as context for generation.

Mastra supports multiple document types and vector stores, making RAG implementation consistent across different backends.

## Example Pipeline

Below is a simplified example of using Mastra's RAG API to process a document and perform a query:

```ts
import { embedMany } from "ai";                   // from Vercel AI SDK
import { openai } from "@ai-sdk/openai";
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import { z } from "zod";

// 1. Initialize a document from text
const doc = MDocument.fromText("Your document text here...");

// 2. Chunk the document
const chunks = await doc.chunk({
  strategy: "recursive",  // or "sliding" etc.
  size: 512,
  overlap: 50,
});

// 3. Generate embeddings for chunks
const { embeddings } = await embedMany({
  values: chunks,
  model: openai.embedding("text-embedding-3-small"),
});

// 4. Store embeddings in a vector database
const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING);
await pgVector.upsert({
  indexName: "embeddings",
  vectors: embeddings,
});  // indexName is like a collection name

// 5. Query similar chunks for a new query vector
const queryVector = /* embed the query "..." using same model */;
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: queryVector,
  topK: 3,
});
console.log("Similar chunks:", results);
```

This pipeline shows:
- Using `MDocument.fromText` to create a document object.
- `doc.chunk(...)` to break it into `chunks` (each chunk perhaps 512 characters with 50 char overlap).
- `embedMany` to get embeddings for all chunks using an OpenAI embedding model.
- Initializing a `PgVector` (Postgres vector store, here using pgvector via `@mastra/pg`) and upserting the embeddings.
- Querying the store with a query vector to get the top 3 similar chunks.

This example uses PostgreSQL with pgvector extension; Mastra also supports Pinecone, Qdrant, and others similarly.

## Document Processing

Mastra's `MDocument` class and related functions handle different document formats:
- Text documents can be split by paragraphs, sentences, tokens, etc.
- HTML/Markdown may be parsed and chunked appropriately.
- JSON could be chunked by fields.

Chunking strategies:
- **Recursive**: Recursively split by sections (good for structured text).
- **Sliding Window**: Fixed-size overlapping windows (ensures every part gets in a chunk, often used to maximize context use).
- Possibly others like by semantic boundaries.

You can also enrich chunks with metadata (e.g., source filename, section titles) to assist in later filtering or identify where an answer came from.

For more details on chunking and embedding strategies, see **RAG-ChunkingEmbedding.md**.

## Vector Storage

Mastra abstracts vector databases so you can switch between:
- **Postgres (pgvector)** – as shown above, storing vectors in a Postgres table.
- **Pinecone** – a managed vector DB.
- **Qdrant** – an open-source vector DB.
- **Memory vector store** – perhaps an in-memory or local one for quick testing.

Each has its own class (e.g., `PgVector`, `PineconeVector`, etc.) and usage but all implement a common interface with methods like `upsert` and `query`.

The `indexName` (or similar concept) is used to namespace vectors (like a collection). Ensure consistent use of the same embedding model for both indexing and querying.

See **RAG-VectorDatabases.md** for specifics on each supported store.

## Retrieval and Augmentation

To use retrieved chunks in generation:
- Take the `results` from the vector query (which likely include the stored chunk text or an id you can map back to text).
- Construct a prompt for the LLM that includes these chunks. For example: *"Using the following documents, answer the question... [doc snippets]"*.
- Use `agent.generate()` or workflow steps to have the LLM produce the final answer.

Mastra might provide higher-level utilities to do this in one go (like a RAG tool that encapsulates query + generation). The **createGraphRAGTool** or **createVectorQueryTool** in references suggests some built-in tools for RAG.

## Observability and Debugging

RAG can be tricky – you want to know if relevant info was retrieved. Mastra includes observability features:
- Logging of embedding operations (maybe how many tokens, time taken).
- Logging of retrieved chunk IDs and similarity scores.
- Optionally caching results for repeated queries.

These help you tune chunk sizes or decide if your vector search is returning good hits. For instance, if you see low similarity scores or irrelevant chunks, you might need a different embedding model or better preprocessing.

Mastra encourages monitoring embedding generation performance and retrieval relevance. You can integrate with tools like OpenTelemetry (OTel) for tracking these metrics (Mastra has an OTel config for logging events of chunking/queries).

## More Resources

Mastra's documentation and examples include:
- Chain-of-Thought RAG example (perhaps showing an agent reasoning step-by-step with retrieved info).
- Various example projects demonstrating chunking strategies and using different vector stores.

By leveraging RAG with Mastra, your agents can provide up-to-date, specific answers drawn from your private data, rather than relying solely on the static training data of the base model. This is critical for applications like documentation Q&A, knowledge base assistants, or any domain-specific expert system.
