# `mastra build` (CLI Command Reference)

The `mastra build` command bundles your Mastra project into a production-ready server (using the Hono framework under the hood). This is often used as a step before deployment, preparing the code that will run in production.

## Usage

```bash
mastra build [options]
```

This will produce a bundled output (often in a folder named `.mastra` or similar).

## Options

- **`--dir <path>`:** Specify the directory containing your Mastra project (if not the current directory). Defaults to current directory.

*(Other build configurations are usually auto-detected from your project; the CLI doesn't require many flags for building.)*

## What It Does

When you run `mastra build`, the CLI:
1. **Finds the Mastra entry file:** It looks for either `src/mastra/index.ts` or `src/mastra/index.js` in your project as the entry point.
2. **Creates an output directory:** often a hidden folder like `.mastra` in your project root (or within the specified `--dir`).
3. **Bundles your code using Rollup (or similar):** The build uses a bundler to compile your TypeScript/JavaScript into a single (or set of) JavaScript files suitable for deployment. This includes:
   - Tree-shaking (removing unused code) to minimize bundle size.
   - Targeting a Node.js or appropriate runtime environment (depending on deploy target).
   - Generating source maps (so you can debug the production code if needed).
   - Packaging all dependencies that are required at runtime.

The result of the build is typically an optimized JavaScript bundle plus supporting files.

## Example

Run build from current directory:

```bash
mastra build
```

Or specify a project directory:

```bash
mastra build --dir ./my-mastra-project
```

This will output the bundle to, for instance, `./my-mastra-project/.mastra/` (check the documentation or output logs for exact location).

## Output

The build process generates a `.mastra` directory containing:
- A compiled **Hono-based HTTP server** that encapsulates your Mastra agents/workflows. (Hono is a lightweight web framework used by Mastra to handle HTTP routing.)
- **Bundled JavaScript files** optimized for production (one of which is often an `index.js` or `index.mjs` that starts the server).
- **Source maps** (`.js.map` files) for debugging, if enabled.
- Any **dependencies** packaged with your code (node_modules that were bundled).

The output is ready to be deployed or run in a Node environment, container, or serverless function, depending on your deployment target.

The resulting build artifacts are suitable for:
- **Deploying to server instances** (e.g., running on AWS EC2, DigitalOcean, etc.).
- **Running in a Docker/container environment** (you'd copy the `.mastra` contents into an image).
- **Serverless platforms** (the build may be directly used by deployers for Vercel, Netlify, etc.).

Usually, you don't need to inspect the `.mastra` folder manually — it's an intermediate step. After building, you would run `mastra deploy ...` to actually push to a cloud platform, or you could run the output server locally to test the production build.

Running `mastra build` ensures that your code is compiled and packaged correctly, catching any compile-time errors and giving you an artifact ready for deployment.
