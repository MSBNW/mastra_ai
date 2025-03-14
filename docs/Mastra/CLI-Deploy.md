# `mastra deploy` (CLI Command Reference)

The `mastra deploy` command packages your application and deploys it to a hosting platform. It leverages the **Deployer** configured in your Mastra project to target a specific environment (such as Vercel, Cloudflare, or Netlify).

Usage generally is:

```bash
mastra deploy <target>
```

where `<target>` is the deployment platform.

Currently supported targets correspond to built-in deployers:

- `mastra deploy vercel` – Deploy to **Vercel**.
- `mastra deploy cloudflare` – Deploy to **Cloudflare Workers**.
- `mastra deploy netlify` – Deploy to **Netlify Functions**.

Each target will execute the appropriate deployment steps for that platform (using the configuration provided when you set up the deployer in code).

For example, if you run `mastra deploy vercel`, the CLI will:
- Use the VercelDeployer (which should be configured in your `Mastra` instance) to bundle the project and deploy it to Vercel.

Similarly, `mastra deploy cloudflare` uses CloudflareDeployer, and `mastra deploy netlify` uses NetlifyDeployer.

## Flags

The deploy command accepts a common flag:

- **`-d, --dir <dir>`:** Path to your Mastra project directory (if not running from project root). Defaults to current directory. Use this if your Mastra setup files are not in the working directory.

*(Other flags for deployment are generally provided via configuration in code rather than CLI flags. For instance, API tokens or project names for the target platform are set in the deployer configuration in your code, not as command-line options.)*

## Example

If your Mastra project's `Mastra` instance was configured with, say, a CloudflareDeployer, you would deploy by running:

```bash
mastra deploy cloudflare
```

This will trigger the Cloudflare deployment process (bundle, then upload to Cloudflare).

Likewise, if configured for Vercel:

```bash
mastra deploy vercel
```

will bundle and deploy to Vercel.

**Note:** Ensure you have set any required environment variables or authentication tokens (e.g., Vercel token, Cloudflare API token/email, Netlify token) either in your environment or configuration. The deployers will use these to authenticate with the respective services.

After running the command, check the output/logs. On success, you should have your application running on the target platform (the CLI may output the URL or site name). On failure, error messages will guide you (for example, missing credentials or misconfiguration).

In summary, `mastra deploy` delegates the heavy lifting to the appropriate deployer based on the target you specify, making deployment as simple as running a single command.
