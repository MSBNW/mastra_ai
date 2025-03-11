# Project Structure

Mastra does not enforce a rigid project layout, but it provides a default structure and best practices. You can organize your agents, tools, and workflows in separate files or even combine them, but separation is recommended for clarity. The Mastra CLI (`mastra init`) can scaffold a sensible folder structure for you.

## Using the CLI

When you run `mastra init` (or the project creation during installation), it allows you to choose a directory and components to include:

- **Mastra directory**: by default `src/mastra` is suggested as the root for all Mastra files.
- **Components to install**: you can select Agents, Tools, Workflows (any combination) to scaffold.
- **Default LLM provider**: choose a provider (OpenAI, Anthropic, Groq, etc.) for initial setup.
- **Include example code**: optionally include sample agent/tool/workflow code to get started faster.

The CLI will generate files and directories accordingly.

### Example Project Structure

If you select all components with example code, the generated structure might look like this:

- **root folder** (your project)
  - **src**
    - **mastra** (Core Mastra application folder)
      - **agents** (Agent definitions)  
        - `index.ts`
      - **tools** (Tool definitions)  
        - `index.ts`
      - **workflows** (Workflow definitions)  
        - `index.ts`
      - `index.ts` (Main Mastra configuration)
  - **.env** (Environment variables file)

*(In this tree, each subdirectory has its own `index.ts` to register included modules, and `src/mastra/index.ts` pulls everything together into the Mastra instance.)*

### Top-level Folders

- **`src/mastra`** – Core application folder for Mastra components (agents, tools, workflows).
- **`src/mastra/agents`** – Contains agent configuration files (each agent in a separate file).
- **`src/mastra/tools`** – Contains custom tool definition files.
- **`src/mastra/workflows`** – Contains workflow definition files.

You are free to create additional sub-folders (for example, you might group related tools or agents in subdirectories), but the above is a common pattern.

### Top-level Files

- **`src/mastra/index.ts`** – Main configuration file where you import and register all agents, tools, and workflows with the Mastra instance.
- **`.env`** – Environment variable definitions (API keys, config settings) for your application.

Using this structure, Mastra's conventions (like the dev server auto-discovering agents/workflows in the `src/mastra` directory) will work out-of-the-box. While you can organize files differently, following this structure helps maintain consistency and makes it easier to navigate your AI app's code.
