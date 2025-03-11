# Deployment

Once your Mastra application is built and tested locally, you'll want to deploy it to a server or cloud environment. Mastra supports two main approaches for deployment:

1. **Direct Platform Deployment (Using Deployers)** – Platform-specific deployment helpers that configure and upload your app to serverless platforms (Cloudflare Workers, Vercel, Netlify, etc.).
2. **Universal Deployment (Self-Hosted Node.js)** – Build your Mastra app into a Node.js server and run it on any environment that supports Node (could be a VM, Docker container, AWS Lambda, etc.).

Before deploying, ensure you have all environment variables (API keys, etc.) set in the production environment.

## Prerequisites

- A built Mastra project (all agents, workflows defined).
- Node.js environment on the target (if using Node server approach).
- For platform deployers: an account on that platform and any CLI/API keys needed.

## Direct Platform Deployment

Mastra provides **deployer packages** for certain platforms that simplify deployment configuration:
- **Cloudflare Workers** – `@mastra/deployer-cloudflare`
- **Vercel** – `@mastra/deployer-vercel`
- **Netlify** – `@mastra/deployer-netlify`

These deployers handle bundling your Mastra app and deploying it.

**Installing Deployers**: Install the deployer for your platform:

```sh
# For Cloudflare
npm install @mastra/deployer-cloudflare

# For Vercel
npm install @mastra/deployer-vercel

# For Netlify
npm install @mastra/deployer-netlify
```

**Configuring Deployers**: In your `src/mastra/index.ts` (or wherever you initialize Mastra), configure the deployer:

```ts
import { Mastra } from "@mastra/core";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
// or VercelDeployer, NetlifyDeployer accordingly

export const mastra = new Mastra({
  agents: { /* ... */ },
  workflows: { /* ... */ },
  deployer: new CloudflareDeployer({
    scope: "your-cloudflare-account-id",
    // any other Cloudflare-specific options
  })
});
```

For Cloudflare, you might provide an account ID (`scope`); for Vercel, maybe a teamId; for Netlify, a team slug or auth token. Check each deployer's docs:
- CloudflareDeployer expects a `scope` (account) and will infer other settings (likely uses Cloudflare's Wrangler under the hood).
- VercelDeployer might take a `teamId`.
- NetlifyDeployer might take a `scope` or use environment variables (like Netlify auth token).

**Running Deployment**: Mastra's CLI has `mastra deploy` command. After configuring, run:

```sh
mastra deploy
```

This will use the configured deployer to bundle and push the code. For example:
- Cloudflare: likely bundles to a Worker script and publishes it (you might need `wrangler.toml` or environment variables for Cloudflare auth).
- Vercel: might call Vercel's API to deploy as a serverless function.
- Netlify: similar to Vercel.

If you need to set environment variables on the platform (API keys, etc.), do so in the platform's dashboard or via CLI prior to deployment.

## Deployer Configuration Examples

Basic usage was shown above. For completeness, each deployer can have specific options:

- **CloudflareDeployer**:
  ```ts
  new CloudflareDeployer({
    scope: "<CF Account ID>",
    scriptName: "mastra_app",      // optional name for the Worker
    vars: { KEY: "value" }         // environment vars to inject
  });
  ```
  (If not using a .env on Cloudflare, you can pass small secrets via `vars`.)

- **VercelDeployer**:
  ```ts
  new VercelDeployer({
    teamId: "<Vercel Team ID>",
    projectName: "mastra-app"      // ensure a project is set up on Vercel
  });
  ```
  This might assume you have `vc` (Vercel CLI) logged in or an API token set.

- **NetlifyDeployer**:
  ```ts
  new NetlifyDeployer({
    scope: "<Netlify team slug>",
    siteId: "<Site ID>",           // maybe needed if site already exists
  });
  ```

Each deployer's `new ...Deployer({...})` should be adjusted according to that platform's requirements. The Mastra documentation provides "basic examples" and refers to reference docs for details.

## Universal Deployment (Node.js)

If you prefer not to use platform-specific deployers or want to deploy on your own infrastructure:
- Mastra can be built into a standard Node.js Express (or Hono, etc.) server.

The process:
1. **Build** the application:
   ```sh
   mastra build
   ```
   This compiles your TypeScript to JavaScript (in `dist/` folder) and prepares the server bundle. If using the default Hono server bundler, it might output a server file.

2. **Run the Server**:
   After build, you can run:
   ```sh
   node dist/server.js
   ```
   or a similar command (Mastra might output the entry point name or include a script). Alternatively, use:
   ```sh
   mastra start
   ```
   to start the server locally in production mode.

   Ensure the environment variables (like API keys) are set in your production environment (via actual environment or a .env file in the deployed location).

3. **Deploy Node App**:
   - If using Docker, create a Dockerfile that copies your project and runs `mastra build` then `mastra start` or directly `npm run build && node dist/server.js`.
   - If using a PaaS (Heroku, Fly.io, etc.), treat it like a Node web server.
   - If using AWS Lambda or GCP Functions, you might wrap the Hono/Express app with their adapters.

Mastra's universal build by default uses Hono (a small web framework) to serve the endpoints. The result is an HTTP server listening on some port (default 4111 or environment `$PORT`). Make sure to configure the port if required by platform (e.g., Heroku sets `PORT` env var; Hono will use that via `process.env.PORT` typically).

## Environment Variables

When deploying, especially to serverless or cloud environments, set your environment variables (like `OPENAI_API_KEY`, etc.) in those environments. The Mastra deployers and build will not automatically carry over your local `.env` – you need to configure it on the platform or in your deployment pipeline.

For example:
- On Vercel, use `vc env add` commands or the dashboard to add env vars.
- On Netlify, use the UI or CLI to set env vars.
- On Cloudflare Workers, use `wrangler secret put` or `vars` in wrangler.toml for secrets.
- In Docker, you might use an `.env` or pass env on container run.

## Platform Documentation

Each platform has specifics:
- Cloudflare Workers: uses Wrangler. See Cloudflare's docs on publishing Workers and binding KV if needed.
- Vercel: essentially detect a framework. Mastra's Vercel deployer likely packages as a Serverless Function.
- Netlify: might create a Netlify Function or Edge Function.

Mastra's deployers simplify a lot but you may refer to their docs (possibly linked from Mastra docs) for advanced configuration.

## Logging and Tracing in Deployment

In production, consider integrating Observability (see **Deployment-LoggingTracing.md**). Mastra can send logs to services like New Relic, Datadog, etc., to monitor your live agents.

## Summary

You have two deployment paths:
- Use Mastra's built-in deployer for a quick deploy to supported serverless platforms (Cloudflare, Vercel, Netlify). This requires minimal config changes and the `mastra deploy` command.
- Or manually build and deploy as a Node app, giving you more control or ability to deploy elsewhere.

Choose what fits your workflow. For many, deploying to Vercel or Cloudflare Workers will be very convenient, turning your local prototype into a globally accessible service with a single command.
