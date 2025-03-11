# Vector Databases in Mastra

Mastra supports multiple vector database options to store and search embeddings. The choice of vector DB can depend on your scale, performance needs, and infrastructure. Supported options include:

- **Postgres (pgvector)**: Using the `@mastra/pg` package, Mastra can store embeddings in a Postgres table with the pgvector extension. This is convenient if you already use Postgres; it supports similarity search via indexed vectors. In code, use `new PgVector(connectionString)` to create a client.
- **Pinecone**: A managed cloud vector database. Likely Mastra provides a Pinecone client integration (perhaps via `@mastra/pinecone` or similar). Pinecone excels at large scale and easy setup, but is a hosted service.
- **Qdrant**: An open-source vector DB (with a cloud offering as well). Mastra might have an integration for Qdrant to use it similarly.
- **Memory (in-memory)**: Possibly for testing, an in-memory store could be used (this wouldn't persist data, but for small experiments it's fast).

Each integration will typically offer similar methods:
- `upsert({ indexName, vectors })`: to insert or update vectors (and maybe their payloads/metadata).
- `query({ indexName, queryVector, topK })`: to retrieve the closest vectors.

### Postgres (pgvector) Setup

If using Postgres:
1. Install the `@mastra/pg` package.
2. Ensure your Postgres has the pgvector extension installed (`CREATE EXTENSION vector;`).
3. Provide a connection string to `PgVector`. By default, it might create a table for each indexName or a single table with an index column.
4. Use `upsert` to add vectors. For pgvector, indexName might correspond to a table or a namespace in a table.
5. Query as shown in the RAG overview example.

**Example**:
```ts
const pgVector = new PgVector("postgres://user:pass@host:port/db");
await pgVector.upsert({ indexName: "embeddings", vectors: embeddings });
const results = await pgVector.query({ indexName: "embeddings", queryVector, topK: 5 });
```

### Pinecone Integration

For Pinecone:
- You'd have an API key and environment for your Pinecone project.
- The Mastra integration might look like:
```ts
import { PineconeVector } from "@mastra/pinecone";
const pine = new PineconeVector({ apiKey: "XYZ", environment: "us-west1" });
await pine.upsert({ indexName: "my-index", vectors });
const results = await pine.query({ indexName: "my-index", queryVector, topK: 5 });
```
- Ensure the index is created in Pinecone's console (with appropriate dimension matching your embeddings length).

Pinecone handles indexing and similarity search efficiently as a service.

### Qdrant Integration

For Qdrant (self-hosted or cloud):
- Possibly `@mastra/qdrant` package.
- Usage might be similar to Pinecone, with a Qdrant URL and API key if cloud.
- Qdrant supports filtering by metadata too, which could be leveraged if Mastra exposes it.

### Other Stores

Mastra's architecture might allow adding other vector stores. For instance, if using Weaviate or ElasticSearch, you could integrate via tools or by writing custom queries.

The provided default integrations cover common choices. Check Mastra's docs or code for classes like `PineconeStore`, `QdrantStore`, etc., analogous to `LibSQLStore`, `PostgresStore` shown in memory docs.

### Choosing a Store

- Use **Postgres/pgvector** if you want simplicity and your dataset is moderate (thousands to low millions of vectors) and you prefer not to run a separate vector DB.
- Use **Pinecone** for large scale or if you want a fully managed solution without managing your own DB.
- Use **Qdrant** if you prefer open-source and possibly need to run on-prem or at the edge.
- If just prototyping, an in-memory or file-based solution might be enough (though Mastra doesn't explicitly mention a file-based vector store, one could serialize vectors to disk manually if needed).

### Index Names and Multiple Datasets

The `indexName` parameter lets you maintain multiple collections of embeddings (e.g., one for documentation, one for user emails, etc.) in the same vector store. Make sure to use consistent index names between upsert and query.

For Postgres, `indexName` could correspond to different tables or a column value; for Pinecone/Qdrant, it corresponds to actual index/collection names.

### Metadata and Filtering

If your vector store and Mastra integration support metadata:
- When upserting, you might provide metadata per vector (like `{id: ..., values: [...], metadata: {...}}`).
- Query could then include a filter, e.g., `filter: { docType: "FAQ" }` to only retrieve vectors from FAQ documents.

This is advanced usage; refer to the store's integration docs (e.g., Pinecone's filter syntax or Qdrant's payload filtering) and Mastra's capabilities.

In summary, Mastra's vector DB integrations abstract away the differences so you can easily plug one in and use the same Mastra RAG API. Decide based on your project's requirements which backend is most suitable.
