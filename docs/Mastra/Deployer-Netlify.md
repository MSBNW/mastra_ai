# NetlifyDeployer (Netlify Deployment)

The **NetlifyDeployer** deploys Mastra applications as Netlify Functions. It handles creating a Netlify site (if needed), configuring functions, and preparing the Netlify-specific files.

## Usage

To use NetlifyDeployer, initialize Mastra with it:

```ts
import { Mastra } from "@mastra/core";
import { NetlifyDeployer } from "@mastra/deployer-netlify";

export const mastra = new Mastra({
  deployer: new NetlifyDeployer({
    scope: 'your-team-slug',      // Netlify Team (account) slug or ID
    projectName: 'your-project-name',
    token: 'your-netlify-auth-token'
  })
  // ... other Mastra config ...
});
```

Configuration:
- **scope** (`string`): Your Netlify team slug or team ID under which to create the site. **Required.**
- **projectName** (`string`): Name of your Netlify site (if it doesn't exist, the deployer will create it with this name).
- **token** (`string`): Your Netlify API token (used to authenticate and perform the deployment).

## What it Does

When `mastra deploy netlify` is executed, the NetlifyDeployer will:
1. Bundle your application (same bundling process as other deployers).
2. Ensure a Netlify site exists for the given `projectName` under your team (`scope`).
3. Upload the function bundle to Netlify.

It also auto-generates a **Netlify configuration file** (`netlify.toml`) with necessary settings:

```toml
[functions]
node_bundler = "esbuild"
directory = "netlify/functions"

[[redirects]]
force = true
from = "/*"
to = "/.netlify/functions/api/:splat"
status = 200
```

- The `[functions]` section configures Netlify to treat the output as Node functions using esbuild bundler.
- The redirect rule routes all requests (`/*`) to the function (`/.netlify/functions/api`), allowing the Mastra server (running as a function named "api") to handle all paths.

## Environment Variables

NetlifyDeployer handles environment variables similarly:
- It loads env variables from `.env.production` and `.env` and bundles them.
- These can be managed on the Netlify dashboard as well (the deployer does not automatically sync them, but you can configure environment variables in Netlify's UI or CLI).

## Project Structure (Output)

When building for Netlify, the deployer creates an output structure like:

```
output-directory/
├── netlify/
│   └── functions/
│       └── api/
│           └── index.mjs    # The bundled Mastra server function
└── netlify.toml             # Netlify configuration file
```

- The `index.mjs` is the server entry point (with the Hono server integrated to handle requests).
- The `netlify.toml` tells Netlify how to use this function.

## Running on Netlify

After deployment, Netlify will:
- Host an API function (usually accessible at `/.netlify/functions/api` on your site).
- The redirect ensures that any request to your site is handled by this function, meaning your Mastra server is effectively serving all routes.

**Note:** The NetlifyDeployer assumes a single function (often named "api") to handle all incoming requests via the redirect rule.

By using NetlifyDeployer, you automate the process of packaging and deploying your Mastra application as a serverless function on Netlify, with minimal manual setup.
