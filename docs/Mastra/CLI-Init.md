# `mastra init` (CLI Command Reference)

The `mastra init` command creates a new Mastra project scaffold. You can run it in a few different ways depending on how much guidance or customization you need.

## Usage

There are three modes to run `mastra init`:

1. **Interactive Mode (Recommended):** Run `mastra init` with no flags for an interactive prompt. This will guide you through:
   - Choosing a directory for your Mastra files.
   - Selecting which components to set up (Agents, Tools, Workflows).
   - Choosing a default Large Language Model provider (OpenAI, Anthropic, or Groq).
   - Deciding whether to include example code.

2. **Quick Start with Defaults:** Use the `--default` flag to quickly initialize with default settings:
   ```bash
   mastra init --default
   ```
   This sets up a project with:
   - **Source directory:** `src/` (and within it, a `mastra` folder).
   - **Components:** All core components enabled (agents, tools, workflows).
   - **Default LLM provider:** OpenAI.
   - **Example code:** Not included (a minimal setup).

3. **Custom Setup via Flags:** Provide flags to customize all options in one command:
   ```bash
   mastra init --dir src/mastra --components agents,tools --llm openai --example
   ```
   In this example:
   - `--dir src/mastra` sets the Mastra files directory to `src/mastra`.
   - `--components agents,tools` will initialize only **agents** and **tools** (omit workflows in this case).
   - `--llm openai` chooses OpenAI as the default model provider.
   - `--example` includes example code in the generated files.

## Options (Flags)

You can use the following flags with `mastra init` for custom initialization:

- **`-d, --dir <path>`:** Specify the directory for Mastra files (default is `src/mastra`). This is where agent, tool, and workflow code will be placed.
- **`-c, --components <list>`:** Comma-separated list of components to initialize. Options include `agents`, `tools`, `workflows`. By default, all are included if not specified.
- **`-l, --llm <provider>`:** Default LLM provider for the project (e.g., `openai`, `anthropic`, or `groq`).
- **`-k, --llm-api-key <key>`:** Provide an API key for the chosen LLM provider (this key will be stored in an `.env` file for you).
- **`-e, --example`:** Include example code in the generated project (sample agents, tools, workflows).
- **`-ne, --no-example`:** Explicitly skip adding example code.

*(If neither `--example` nor `--no-example` is given in interactive mode, the prompt will ask. In non-interactive default, it omits examples.)*

Running `mastra init` will generate the folder structure and boilerplate files to get you started quickly with a new Mastra project. For instance, in the default case, you might see a structure like:

```
src/mastra/
├── agents/
│   └── exampleAgent.ts   (if example code included)
├── tools/
│   └── exampleTool.ts    (if example code included)
├── workflows/
│   └── exampleWorkflow.ts (if example code included)
└── index.ts              (Mastra initialization file)
```

After initialization, you can run `mastra dev` to start developing your project locally.
