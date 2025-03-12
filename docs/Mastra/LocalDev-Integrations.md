# Using Mastra Integrations

Mastra **Integrations** are pre-built, type-safe API clients for external services that you can plug into agents or workflows. Essentially, an integration wraps a third-party API (like GitHub, Stripe, etc.) and exposes it as a Mastra tool or client that your agent can call.

Integrations save you from writing boilerplate API calls and ensure consistent types for inputs/outputs.

## Installing an Integration

Each integration is an npm package (prefixed with `@mastra/`). For example, to use the GitHub integration:

```sh
npm install @mastra/github
```

This provides a `GithubIntegration` class within the package.

After installing, import and initialize the integration in your project, typically in an `integrations` directory:

```ts
// src/mastra/integrations/index.ts
import { GithubIntegration } from "@mastra/github";

export const github = new GithubIntegration({
  config: {
    PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PAT!,
  },
});
```

This creates a `github` integration client with your GitHub Personal Access Token (PAT) from environment variables. Ensure you have the PAT in your `.env` (e.g., `GITHUB_PAT=ghp_abc123`).

Mastra's integration classes often require a config object with API keys or tokens.

## Using Integrations in Tools

Once you have an integration client, you typically **use it inside a tool's execute function** to perform actions. For example, using the `github` integration above to get the main branch reference of a repository:

```ts
import { createTool } from "@mastra/core";
import { z } from "zod";
import { github } from "../integrations";

export const getMainBranchRef = createTool({
  id: "getMainBranchRef",
  description: "Fetch the main branch reference from a GitHub repository",
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
  }),
  outputSchema: z.object({
    ref: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const client = await github.getApiClient();
    const mainRef = await client.gitGetRef({
      path: { 
        owner: context.owner, 
        repo: context.repo, 
        ref: "heads/main" 
      },
    });
    return { ref: mainRef.data?.ref };
  },
});
```

In this tool:
- We get a live API client via `github.getApiClient()` (often integrations use this to handle auth and rate limits behind the scenes).
- We call `client.gitGetRef` (one of the GitHub API endpoints provided by the integration) with the required parameters (owner, repo, ref).
- We return the reference string.

Mastra integration clients are usually generated from the service's OpenAPI spec, providing methods for each endpoint (in this case, `gitGetRef` corresponds to GitHub's Git References API). The input is structured (with sub-objects like `path`, `query`, etc., matching API needs) and the output is typed.

By defining this tool, you allow your agent or workflow to retrieve data from GitHub easily.

## Adding Integration Tools to Agents

To enable an agent to use the new tool, include it in the agent's tools:

```ts
import { Agent } from "@mastra/core";
import { openai } from "@ai-sdk/openai";
import { getMainBranchRef } from "../tools";

export const codeReviewAgent = new Agent({
  name: "Code Review Agent",
  instructions: "An agent that reviews GitHub repositories.",
  model: openai("gpt-4o"),
  tools: { getMainBranchRef },
});
```

Now `codeReviewAgent` can call the `getMainBranchRef` tool during its reasoning. For example, if asked *"Does the repository owner/repo have a main branch?"*, the agent might invoke this tool to fetch the ref.

## Environment Configuration

Make sure to set any required environment variables for integrations:
- For GitHub: `GITHUB_PAT` (Personal Access Token) as shown.
- For other services: analogous API keys or tokens (e.g., Stripe API key, etc.).

Store these in `.env` and load them (Mastra uses dotenv by default).

Keep secrets out of source control.

## Available Integrations

Mastra has built-in support for various services, primarily those with simple API key auth (no full OAuth flows in examples, as those are complex to automate). Some noted ones:
- **GitHub** (`@mastra/github`) – for repository data, issues, etc.
- **Stripe** (`@mastra/stripe`) – for payment info.
- **Resend** (perhaps email sending).
- **Firecrawl** (not sure, possibly a crawling service).
- Others may include Slack, Notion, etc., depending on the project.

To see all integrations, check Mastra's GitHub or npm organization. You can search npm for `@mastra/*` packages.

## Conclusion

Integrations extend your agents' reach beyond the LLM:
- They enable agents to fetch real-time or proprietary data (like pulling info from GitHub, querying a database, etc.).
- They come with type definitions to minimize errors.
- They can be used in both agent tools and workflow steps.

By installing and configuring an integration, writing a small wrapper tool, and adding it to an agent, you empower that agent to interact with the outside world reliably. Always refer to each integration's documentation (or source) for specifics on available methods and required config. With integrations, your AI agent can seamlessly operate with external APIs as part of its reasoning process.
