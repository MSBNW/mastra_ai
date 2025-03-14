# VercelDeployer (Vercel Deployment)

The **VercelDeployer** deploys Mastra applications to Vercel. It configures your project for Vercel's serverless environment, synchronizing environment variables and ensuring the correct build output for Vercel's platform.

## Usage

Set up Mastra with VercelDeployer:

```ts
import { Mastra } from "@mastra/core";
import { VercelDeployer } from "@mastra/deployer-vercel";

export const mastra = new Mastra({
  deployer: new VercelDeployer({
    teamId: 'your-team-id',        // Optional: Vercel team ID if deploying under a team
    projectName: 'your-project-name',
    token: 'your-vercel-auth-token'
  })
  // ... other config ...
});
```

Configuration:
- **teamId** (`string`): Your Vercel team ID (if you want to deploy under a specific team; leave undefined for personal account).
- **projectName** (`string`): Name of your Vercel project. If it doesn't exist, one will be created with this name.
- **token** (`string`): Your Vercel API token for authentication.

## Vercel Configuration

The VercelDeployer automatically generates a `vercel.json` configuration file optimized for Mastra:

```json
{
  "version": 2,
  "installCommand": "npm install --omit=dev",
  "builds": [
    {
      "src": "index.mjs",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["**"]
      }
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index.mjs" }
  ]
}
```

Key points:
- It sets the build to use the Node runtime (`@vercel/node`) on the output `index.mjs` file (which is the bundled server).
- `includeFiles: ["**"]` ensures all files in the output are included in the deployment bundle.
- The route configuration catches all requests (`/(.*)`) and directs them to `index.mjs`, meaning the Mastra server code will handle all incoming requests on Vercel.

## Environment Variables Synchronization

VercelDeployer ensures environment variables are consistent:
- It loads env variables from `.env.production` or `.env` during bundling.
- It can automatically sync these environment variables to your Vercel project using Vercel's APIs, so that at runtime the variables are set (ensuring consistency across local dev and deployed environment).

Specifically, on deployment it updates:
- **Production** env vars (and possibly Preview/Development env vars) on Vercel with those found locally, if needed, so that values like API keys (`OPENAI_API_KEY`, etc.) are present.

## Project Structure (Output)

The output for Vercel will include:
```
output-directory/
├── vercel.json     # Vercel configuration (as above)
└── index.mjs       # The bundled application (entry point for server)
```

(Vercel's platform doesn't need a specific subfolder like Netlify; the config file and entry file at root suffice given the `vercel.json`.)

## Environment and Deployment

After running `mastra deploy vercel`, VercelDeployer will:
- Bundle your project.
- Create or update the Vercel project (using `projectName` and `teamId` if provided).
- Upload the bundle.
- Set environment variables on Vercel (if the deployer is designed to do so).
- The application will run on Vercel's serverless infrastructure, accessible via the URL of your Vercel project.

While running on Vercel:
- All requests to the project's domains are handled by the `index.mjs` (Mastra's Hono server).
- Because the deployer uses `includeFiles: ["**"]`, any additional files (like vector data, etc., in the output directory) will be deployed if needed.

### Note on Environment Sync:
The deployer's synchronization of environment variables means you don't have to manually set variables in the Vercel dashboard; it will push your local env config (though you should ensure not to push secrets you don't want in Vercel). This keeps the development and production configurations aligned.

## Project Structure on Vercel

When deployed, Vercel will treat `index.mjs` as a Serverless Function entry point:
- The route config ensures all paths go to this function.
- The Mastra server (with Hono) will parse the incoming request path and route it internally (to agent endpoints, tool endpoints, etc.).

By using VercelDeployer, you automate deploying to Vercel with minimal setup—just provide your token, project name, and (if applicable) team, and the deployer handles building, configuration, and launch of your Mastra app on Vercel's infrastructure.
