# Deployer (Mastra Deployment System)

The **Deployer** in Mastra is an abstraction that handles packaging and deploying your Mastra application. It manages bundling code, preparing environment variables, and serving the application (often using the Hono framework as the server). Specific deployer implementations exist for different platforms (Cloudflare Workers, Netlify, Vercel, etc.), each implementing the `deploy()` method for that target.

## Usage Example

You can create a custom deployer by extending the base `Deployer` class:

```ts
import { Deployer } from "@mastra/deployer";

// Create a custom deployer by extending the abstract Deployer class
class CustomDeployer extends Deployer {
  constructor() {
    super({ name: 'custom-deployer' });
  }

  // Implement the abstract deploy method
  async deploy(outputDirectory: string): Promise<void> {
    // Prepare the output directory (bundling prerequisites)
    await this.prepare(outputDirectory);

    // Bundle the application (packages code into outputDirectory)
    await this._bundle('server.ts', 'mastra.ts', outputDirectory);

    // Custom deployment logic...
    // e.g., upload files to hosting, etc.
  }
}
```

In practice, you usually use one of the provided deployers for major platforms rather than writing a custom one, but this example shows the structure.

## Configuration Parameters

When instantiating a Deployer (or a subclass):

- **name** (`string`): A unique name for the deployer instance (used internally to identify it).

Platform-specific deployers (like Cloudflare, Netlify, Vercel) take additional configuration; see their documentation for details.

## Key Methods

The `Deployer` base class provides several methods, including:

- **getEnvFiles():** Returns a Promise that resolves to an array of environment file paths. By default, it looks for files like `.env.production`, `.env.local`, and `.env`. The deployer will include these env files during deployment if they exist.
- **deploy(outputDirectory: string):** *(abstract)* The method to implement in subclasses to perform the actual deployment steps. This must be overridden by each specific deployer (CloudflareDeployer, etc.).
- **prepare(outputDirectory: string):** *(inherited from Bundler)* Prepares the output directory: cleans it and sets up necessary subdirectories.
- **writeInstrumentationFile(outputDirectory):** *(inherited)* Writes a telemetry instrumentation file into the output (for collecting metrics/traces in deployment).
- **writePackageJson(outputDirectory, dependenciesMap):** *(inherited)* Generates a `package.json` in the output directory with the given dependencies (used to ensure deployed code knows its dependencies).
- **_bundle(serverFile, mastraEntryFile, outputDir, bundleLocation?):** *(inherited)* Bundles the application code using specified entry files (`server.ts` and `mastra.ts` by default) into the output directory. This is typically called within the deploy process to produce the final bundle.

## Deployment Lifecycle (How Deployer Works)

1. **Initialization:** A deployer instance is initialized with a name, and it sets up internal dependency management (via a `Deps` instance).
2. **Environment Setup:** It identifies relevant env files via `getEnvFiles()` (e.g., finds `.env.production` or `.env`).
3. **Preparation:** `prepare(outputDir)` is called to ready the directory (clean it, create subfolders).
4. **Bundling:** The `_bundle()` method is used to package the code (combining your Mastra server and entry files into a deployable bundle).
5. **Deployment:** The subclass's `deploy()` method runs, using the above steps and then adding platform-specific logic (for example, deploying to a cloud service).

## Environment File Management

The Deployer automatically handles environment variables:
- It searches for `.env.production`, then `.env.local`, then `.env` (in that order).
- It uses a file service to find the first existing env file and includes it.
- If found, those env variables are bundled into the deployment (or made available to the deployed service). If none are found, it proceeds without env files.

## Relationship to Bundler

`Deployer` extends a Bundler class, so deploying inherently includes bundling:
- **Bundling as Prerequisite:** The application must be bundled (packaged) before it can be deployed. The deployer ensures this by calling `_bundle()` internally.
- **Shared Infrastructure:** Both bundling and deployment share logic for managing dependencies and filesystem operations.
- **Extensibility:** By overriding `deploy()`, new deployers can be created for any environment (the bundling logic remains consistent, while deployment specifics vary).
- **Error Handling:** The deployer (and bundler) will throw meaningful errors if something goes wrong (e.g., missing entry files, bundling issues) so you can catch and handle them.

In summary, the Deployer coordinates the steps to turn your Mastra project into a running service on various platforms. Use a provided deployer (or create your own) and integrate it when initializing Mastra (see platform-specific sections below for Cloudflare, Netlify, and Vercel deployment details).
