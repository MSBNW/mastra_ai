# Introduction

**Mastra** is an open-source TypeScript agent framework designed to provide the building blocks for AI applications. It allows you to create AI agents with memory and function-execution capabilities, or to chain LLM calls in deterministic workflows. Key features include:

- **Model Routing** – Built on the Vercel AI SDK for a unified interface to various LLM providers (OpenAI, Anthropic, Google Gemini, etc.). This abstraction simplifies switching between models.
- **Agent Memory & Tool Calling** – Agents can use tools (custom functions) and maintain persistent memory. Memories can be retrieved by recency, semantic similarity, or conversation threads.
- **Workflow Graphs** – A graph-based workflow engine for deterministic LLM call sequences. Workflows support discrete steps with control flow (`.step()`, `.then()`, `.after()`, etc.) to allow branching, chaining, and logging at each step.
- **Agent Dev Environment** – A local development UI to chat with agents and inspect their state and memory during development.
- **Retrieval-Augmented Generation (RAG)** – APIs to process documents (text, HTML, Markdown, JSON) into chunks, create vector embeddings, and store/retrieve them via a vector database. Relevant document chunks can be fetched at query time to ground LLM responses in your data.
- **Deployment Support** – Tools to bundle agents/workflows into Node.js servers or serverless functions. Mastra's deploy helpers integrate with platforms like Vercel, Cloudflare Workers, and Netlify.
- **Evals (Evaluation Metrics)** – Automated evaluation metrics (model-graded, rule-based, statistical) to assess LLM outputs for toxicity, bias, relevance, factual accuracy, etc., with the ability to define custom evals.

Mastra is modular: you can use each component independently or together to suit your application needs. It does not enforce a specific project structure, but provides sensible defaults and CLI tools to scaffold a new project for you. In the following sections, we'll cover installation, project setup, core concepts (Agents, Tools, Workflows, RAG), and how to deploy and evaluate your Mastra-based application.
