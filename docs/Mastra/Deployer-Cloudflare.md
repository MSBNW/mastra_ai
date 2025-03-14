# CloudflareDeployer (Cloudflare Deployment)

The **CloudflareDeployer** deploys Mastra applications to Cloudflare Workers. It handles project configuration, environment variables, and route setup specific to Cloudflare. CloudflareDeployer extends the base `Deployer` class with Cloudflare-specific deployment logic.

## Usage

When initializing Mastra, you can use the CloudflareDeployer:

```ts
import { Mastra } from "@mastra/core";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";

export const mastra = new Mastra({
  deployer: new CloudflareDeployer({
    scope: 'your-account-id',
    projectName: 'your-project-name',
    routes: [
      {
        pattern: 'example.com/*',
        zone_name: 'example.com',
        custom_domain: true,
      }
    ],
    workerNamespace: 'your-namespace',
    auth: {
      apiToken: 'your-api-token',
      apiEmail: 'your-email'
    }
    // ...other Mastra config...
  })
});
```

In this configuration:
- The **CloudflareDeployer** is created with Cloudflare-specific settings (account, project, routes, etc.).
- It is passed to Mastra so that `mastra deploy` will use it.

## Configuration Options

The CloudflareDeployer accepts an object with the following properties:

- **scope** (`string`): Your Cloudflare **Account ID** (also called "scope" in this context). **Required.**
- **projectName** (`string`, default `"mastra"`): Name of your Cloudflare Worker project.
- **routes** (`CFRoute[]`): An array of route configurations, each defining where your worker will be accessible. Each route object can include:
  - **pattern** (`string`): URL pattern to match (e.g., `"example.com/*"`).
  - **zone_name** (`string`): The domain zone (e.g., `"example.com"`).
  - **custom_domain** (`boolean`, default `false`): Whether this route is for a custom domain (true) or a workers.dev subdomain (false).
- **workerNamespace** (`string`): Namespace for your worker (used for isolating environment or binding names, if needed).
- **env** (`Record<string, any>`): Key-value pairs of environment variables to include in the worker environment (these will be set in the Cloudflare Worker).
- **auth** (`object`): Cloudflare authentication details:
  - **apiToken** (`string`): Your Cloudflare API token (with permissions to create and deploy workers).
  - **apiEmail** (`string`, optional): Your Cloudflare account email (sometimes used with API token if required).

## How it Works

When you run the deployment for Cloudflare:
- The CloudflareDeployer will bundle your project (via inherited methods) and then use Cloudflare's API or CLI (wrangler) to upload the worker.
- It automatically generates a `wrangler.json` configuration for you with the given settings:
  - **name:** set to your `projectName`.
  - **main:** entry point set to the output bundle (e.g., `"./output/index.mjs"`).
  - **compatibility_date:** set (e.g., to the current date or a specific date ensuring compatibility).
  - **compatibility_flags:** includes `"nodejs_compat"` to enable NodeJS compatibility in Workers.
  - **observability.logs:** enabled (so logs from the Worker can be captured).
  - **vars:** includes environment variables from your `.env` files and anything in the `env` config.
  - **routes:** the routes array you provided (to automatically route requests to your worker).

Example snippet of the auto-generated `wrangler.json`:
```json
{
  "name": "your-project-name",
  "main": "./output/index.mjs",
  "compatibility_date": "2024-12-02",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "logs": { "enabled": true }
  },
  "vars": {
    // Your environment variables go here
  },
  "routes": [
    // Your route configurations
  ]
}
```

## Route Configuration

You can specify multiple routes to direct traffic to your Cloudflare Worker:
```ts
const routes = [
  {
    pattern: 'api.example.com/*',
    zone_name: 'example.com',
    custom_domain: true
  },
  {
    pattern: 'example.com/api/*',
    zone_name: 'example.com'
  }
];
```
In this example, the worker will respond to any path under `api.example.com` (using a custom domain) and also to any path under `example.com/api/`.

## Environment Variables

CloudflareDeployer handles environment variables from multiple sources:
1. **Environment Files:** It will load variables from files like `.env.production` or `.env` (if present, via the base Deployer logic).
2. **Config `env` object:** Any variables you provide in the `env` option are also included.
3. These become `vars` in the Cloudflare Worker configuration (so they're available as environment variables in your worker code).

By using CloudflareDeployer, you can seamlessly deploy your Mastra agent server as a Cloudflare Worker, with your routes and environment configured, without having to manually manage wrangler configuration or bundling.
