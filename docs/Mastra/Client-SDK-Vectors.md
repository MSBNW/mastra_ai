# Vectors API (Client SDK)

The **Vectors API** enables operations on vector stores (for semantic search, embeddings, similarity matching, etc.). This is useful for Retrieval-Augmented Generation (RAG) and other vector-based features.

## Working with Vectors

First, obtain a handle to a vector store by name:

```ts
const vector = client.getVector("vector-name");
```

This `vector` instance corresponds to a configured vector database or store (e.g., Pinecone, PgVector, Qdrant, etc.) on the server.

## Vector Methods

With the `vector` instance, you can perform various operations:

### Get Vector Index Details

Retrieve info about a specific index in the vector store:

```ts
const details = await vector.details("index-name");
```

This returns metadata about the index `"index-name"` (e.g., dimensions, metric, number of vectors stored, etc.).

### Create Vector Index

Create a new vector index in the store:

```ts
const result = await vector.createIndex({
  indexName: "new-index",
  dimension: 128,
  metric: "cosine" // 'cosine', 'euclidean', or 'dotproduct'
});
```

Parameters:
- **indexName:** Name for the new index.
- **dimension:** Dimension (vector length) for embeddings in this index.
- **metric:** Similarity metric to use (allowed values might include `"cosine"`, `"euclidean"`, `"dotproduct"`).

The call creates the index and returns a result (success confirmation or details of the created index).

### Upsert Vectors

Insert or update vectors in an index:

```ts
const ids = await vector.upsert({
  indexName: "my-index",
  vectors: [
    [0.1, 0.2, 0.3], // First vector embedding
    [0.4, 0.5, 0.6]  // Second vector embedding
  ],
  metadata: [ { label: "first" }, { label: "second" } ],
  ids: ["id1", "id2"] // Optional custom IDs for the vectors
});
```

Parameters:
- **indexName:** Target index to upsert into.
- **vectors:** Array of numerical vectors (arrays of floats) to store.
- **metadata:** (Optional) Array of metadata objects corresponding to each vector (e.g., labels or additional info).
- **ids:** (Optional) Array of custom IDs for each vector. If not provided, IDs might be auto-generated.

Returns an array of IDs for the stored vectors (e.g., the ones you provided or generated IDs).

### Query Vectors

Search for vectors similar to a given query vector:

```ts
const results = await vector.query({
  indexName: "my-index",
  queryVector: [0.1, 0.2, 0.3],
  topK: 10,
  filter: { label: "first" },   // Optional: filter by metadata
  includeVector: true           // Optional: include vectors in results
});
```

Parameters:
- **indexName:** The index to search.
- **queryVector:** The vector to compare against the index.
- **topK:** Number of nearest results to return (e.g., 10 closest vectors).
- **filter:** (Optional) A metadata filter object to restrict search (only consider vectors whose metadata meet certain criteria).
- **includeVector:** (Optional, boolean) If true, include the vector values in the returned results (not just IDs and scores).

The result typically includes an array of matches, each containing at least an `id` and a similarity score, and possibly the stored vector and metadata if requested.

### Get All Indexes

List all vector indexes available:

```ts
const indexes = await vector.getIndexes();
```

Returns a list of index names or detailed info for each index configured in the vector store.

### Delete Index

Delete a vector index and all its data:

```ts
const result = await vector.delete("index-name");
```

Removes the specified index (`"index-name"`) from the vector store. The result usually confirms the deletion.

Using the Vectors API, you can integrate semantic search capabilities into your application, by adding, retrieving, and querying vector embeddings through the Mastra client.
