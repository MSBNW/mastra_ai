# Introduction

**Mastra** is an open-source TypeScript agent framework designed to provide the building blocks for AI applications ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=About%20Mastra)). It allows you to create AI agents with memory and function-execution capabilities, or to chain LLM calls in deterministic workflows ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=You%20can%20use%20Mastra%20to,their%20outputs%20with%20Mastra%E2%80%99s%20evals)). Key features include ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=The%20main%20features%20include%3A)):

- **Model Routing** – Built on the Vercel AI SDK for a unified interface to various LLM providers (OpenAI, Anthropic, Google Gemini, etc.) ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=,You%20can%20define%20discrete)). This abstraction simplifies switching between models.
- **Agent Memory & Tool Calling** – Agents can use tools (custom functions) and maintain persistent memory. Memories can be retrieved by recency, semantic similarity, or conversation threads ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=,you%E2%80%99re%20developing%20an%20agent%20locally)).
- **Workflow Graphs** – A graph-based workflow engine for deterministic LLM call sequences ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=based%20on%20recency%2C%20semantic%20similarity%2C,in%20Mastra%E2%80%99s%20agent%20development%20environment)). Workflows support discrete steps with control flow (`.step()`, `.then()`, `.after()`, etc.) to allow branching, chaining, and logging at each step.
- **Agent Dev Environment** – A local development UI to chat with agents and inspect their state and memory during development ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=,OpenAI%2C%20Cohere%2C%20etc)).
- **Retrieval-Augmented Generation (RAG)** – APIs to process documents (text, HTML, Markdown, JSON) into chunks, create vector embeddings, and store/retrieve them via a vector database ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=environment.%20%2A%20Retrieval,easily%20bundle%20agents%20and%20workflows)). Relevant document chunks can be fetched at query time to ground LLM responses in your data.
- **Deployment Support** – Tools to bundle agents/workflows into Node.js servers or serverless functions. Mastra’s deploy helpers integrate with platforms like Vercel, Cloudflare Workers, and Netlify ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=,also%20define%20your%20own%20evals)).
- **Evals (Evaluation Metrics)** – Automated evaluation metrics (model-graded, rule-based, statistical) to assess LLM outputs for toxicity, bias, relevance, factual accuracy, etc., with the ability to define custom evals ([Introduction | Mastra Docs](https://mastra.ai/docs#:~:text=into%20a%20Node,also%20define%20your%20own%20evals)).

Mastra is modular: you can use each component independently or together to suit your application needs ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=This%20page%20provides%20a%20guide,the%20modules%20separately%20or%20together)). It does not enforce a specific project structure, but provides sensible defaults and CLI tools to scaffold a new project for you. In the following sections, we’ll cover installation, project setup, core concepts (Agents, Tools, Workflows, RAG), and how to deploy and evaluate your Mastra-based application.
```

**Installation.md**  
```markdown
# Installation

To build and run a Mastra application, you need an environment with Node.js and access to an LLM provider (or a local LLM). Below are instructions for setting up Mastra either automatically using the CLI or manually.

## Prerequisites

- Node.js **v20.0** or higher ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Prerequisites))  
- Access to a **supported LLM provider** (e.g., OpenAI, Anthropic, Google Gemini, or a local LLM via Ollama) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=To%20run%20Mastra%2C%20you%20need,a%20local%20LLM%20using%20Ollama)). Obtain an API key for your chosen provider.

## Automatic Installation

Mastra provides a CLI tool to scaffold a new project quickly.

### Create a New Project

We recommend starting with the interactive initializer `create-mastra`, which sets up a new Mastra project with your chosen options ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Create%20a%20New%20Project)). Run one of the following commands (choose your package manager):

```sh
# Using npx
npx create-mastra@latest

# Using npm
npm create mastra

# Using yarn
yarn create mastra

# Using pnpm
pnpm create mastra
``` 

This will launch an interactive prompt ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=On%20installation%2C%20you%E2%80%99ll%20be%20guided,through%20the%20following%20prompts)):

```
What do you want to name your project? my-mastra-app
Choose components to install:
  ◯ Agents (recommended)
  ◯ Tools
  ◯ Workflows
Select default provider:
  ◯ OpenAI (recommended)
  ◯ Anthropic
  ◯ Groq
Would you like to include example code? No / Yes
``` 

You will be asked to name your project, select which Mastra components to include (Agents, Tools, Workflows), choose a default LLM provider, and optionally include example code ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=What%20do%20you%20want%20to,example%20code%3F%20No%20%2F%20Yes)). Based on your choices, `create-mastra` will set up a project directory with TypeScript configuration, install the necessary dependencies, and scaffold the selected components and provider integration ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=After%20the%20prompts%2C%20%60create,selected%20components%20and%20LLM%20provider)).

### Set Up Your API Key

After project creation, add your LLM API key to the new project’s environment file. For example, in the `.env` file add ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Set%20Up%20your%20API%20Key)):

```dotenv
OPENAI_API_KEY=<your-openai-key>
``` 

Replace `<your-openai-key>` with your actual API key ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Create%20a%20,and%20add%20your%20API%20key)). This key will be used by the Mastra framework to authenticate LLM calls.

**Note:** You can also run the `create-mastra` command in a non-interactive mode using flags. For instance, to include agents and tools with OpenAI as provider and example code, run: 

```sh
npx create-mastra@latest --components agents,tools --llm openai --example
``` 

If the installation is slow, a `--timeout` flag is available to set a timeout ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Extra%20Notes%3A)).

## Manual Installation

If you prefer to set up a Mastra project from scratch, follow these steps.

### Create a New Project

First, create a project directory and initialize an NPM project:

```sh
mkdir hello-mastra
cd hello-mastra
npm init -y
``` 

### Install Mastra and Dependencies

Install TypeScript, Node types, the Mastra core package, and any required dependencies. For example:

**Using npm:** ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Create%20a%20project%20directory%20and,navigate%20into%20it)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=npm%20init%20,init)) 

```sh
npm install typescript tsx @types/node mastra@alpha --save-dev
npm install @mastra/core@alpha zod
npx tsc --init
``` 

**Using pnpm:** ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=npm%20init%20,init))

```sh
pnpm add typescript tsx @types/node mastra@alpha --save-dev
pnpm add @mastra/core@alpha zod
pnpm dlx tsc --init
``` 

**Using yarn:** ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=yarn%20init%20,init))

```sh
yarn add typescript tsx @types/node mastra@alpha --dev
yarn add @mastra/core@alpha zod
yarn dlx tsc --init
``` 

**Using bun:** ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=yarn%20init%20,init))

```sh
bun add typescript tsx @types/node mastra@alpha --dev
bun add @mastra/core@alpha zod
bunx tsc --init
``` 

These commands initialize a Node.js project with TypeScript support, install the latest Mastra packages (using the `@alpha` tag for the newest version), and generate a `tsconfig.json`.

### Initialize TypeScript Configuration

Create a `tsconfig.json` file (if not already created by `tsc --init`) or verify it has the following configuration optimized for Mastra projects ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Create%20a%20,root%20with%20the%20following%20configuration)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=,node_modules)):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    ".mastra"
  ]
}
``` 

This ensures modern ECMAScript support, proper module resolution, strict type checking, and output files in a `dist` folder ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=%7B%20,true)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=,mastra)).

### Set Up Your API Key

Just like the automatic setup, create a `.env` file in the project root and add your LLM provider API key ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Set%20Up%20your%20API%20Key)):

```dotenv
OPENAI_API_KEY=<your-openai-key>
``` 

Ensure the key is valid and keep this file secure (consider adding `.env` to `.gitignore`).

### Create a Tool

Next, create a custom **tool** that an agent can use. Tools in Mastra are essentially functions with defined input/output schemas that the agent can call.

1. Make a tools directory and file:

    ```sh
    mkdir -p src/mastra/tools 
    touch src/mastra/tools/weather-tool.ts
    ``` 

2. Open `src/mastra/tools/weather-tool.ts` and add the following code (an example tool that fetches current weather data) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Create%20a%20Tool)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=import%20,zod)):

    ```ts
    import { createTool } from "@mastra/core/tools";
    import { z } from "zod";

    interface WeatherResponse {
      current: {
        time: string;
        temperature_2m: number;
        apparent_temperature: number;
        relative_humidity_2m: number;
        wind_speed_10m: number;
        wind_gusts_10m: number;
        weather_code: number;
      };
    }

    export const weatherTool = createTool({
      id: "get-weather",
      description: "Get current weather for a location",
      inputSchema: z.object({
        location: z.string().describe("City name"),
      }),
      outputSchema: z.object({
        temperature: z.number(),
        feelsLike: z.number(),
        humidity: z.number(),
        windSpeed: z.number(),
        windGust: z.number(),
        conditions: z.string(),
        location: z.string(),
      }),
      execute: async ({ context }) => {
        return await getWeather(context.location);
      },
    });
    ``` 

    This defines a tool with an `id` and description that explains its purpose. It uses **Zod** schemas for input (`location` string) and output (various weather fields) to enforce correct types ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=import%20,zod)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=export%20const%20weatherTool%20%3D%20createTool%28,temperature%3A%20z.number%28%29%2C%20feelsLike%3A%20z.number)). The `execute` function calls an internal helper `getWeather` to retrieve data for the given location.

3. Implement the helper function and any needed logic below the tool definition:

    ```ts
    const getWeather = async (location: string) => {
      const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
      const geocodingResponse = await fetch(geocodingUrl);
      const geocodingData = await geocodingResponse.json();

      if (!geocodingData.results?.[0]) {
        throw new Error(`Location '${location}' not found`);
      }

      const { latitude, longitude, name } = geocodingData.results[0];

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,weather_code`;
      const response = await fetch(weatherUrl);
      const data: WeatherResponse = await response.json();

      return {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windGust: data.current.wind_gusts_10m,
        conditions: getWeatherCondition(data.current.weather_code),
        location: name,
      };
    };

    function getWeatherCondition(code: number): string {
      const conditions: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall",
        73: "Moderate snow fall",
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };
      return conditions[code] || "Unknown";
    }
    ``` 

    The helper performs geocoding to get coordinates for the city, then calls a weather API. It returns an object matching the `outputSchema` with fields like `temperature`, `humidity`, etc. ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=const%20response%20%3D%20await%20fetch,json)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=function%20getWeatherCondition%28code%3A%20number%29%3A%20string%20,Moderate%20drizzle)). The `getWeatherCondition` function maps weather codes to human-readable descriptions ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=function%20getWeatherCondition%28code%3A%20number%29%3A%20string%20,Moderate%20drizzle)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=55%3A%20,Slight%20snow%20fall)).

### Create an Agent

Now create an **agent** that will use the tool. Agents encapsulate a language model plus tools and memory.

1. Make an agents directory and file:

    ```sh
    mkdir -p src/mastra/agents 
    touch src/mastra/agents/weather.ts
    ``` 

2. Open `src/mastra/agents/weather.ts` and define the agent ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Create%20an%20Agent)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=import%20,tool)):

    ```ts
    import { openai } from "@ai-sdk/openai";
    import { Agent } from "@mastra/core/agent";
    import { weatherTool } from "../tools/weather-tool";

    export const weatherAgent = new Agent({
      name: "Weather Agent",
      instructions: `You are a helpful weather assistant that provides accurate weather information.

    Your primary function is to help users get weather details for specific locations. When responding:
    - Always ask for a location if none is provided
    - Include relevant details like humidity, wind conditions, and precipitation
    - Keep responses concise but informative

    Use the weatherTool to fetch current weather data.`,
      model: openai("gpt-4o-mini"),
      tools: { weatherTool },
    });
    ``` 

    Here we import a model provider (`openai`) and the `Agent` class, as well as our `weatherTool`. We then instantiate a new `Agent` with a name and **instructions** (a system prompt guiding the agent’s behavior) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=export%20const%20weatherAgent%20%3D%20new,that%20provides%20accurate%20weather%20information)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=,informative)). We specify the model (`gpt-4o-mini` via the OpenAI provider) and attach the `weatherTool` in the agent’s tools list. This agent will be able to call `weatherTool` when needed to fulfill user requests.

### Register the Agent

Finally, register your agent with the Mastra application. In the Mastra entry point file (commonly `src/mastra/index.ts`), add the agent to the Mastra configuration ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Register%20Agent)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=import%20,agents%2Fweather)):

```ts
import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents/weather";

export const mastra = new Mastra({
  agents: { weatherAgent },
});
``` 

This creates a Mastra instance and registers the `weatherAgent` under its `agents` property ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Finally%2C%20create%20the%20Mastra%20entry,and%20register%20agent)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=export%20const%20mastra%20%3D%20new,weatherAgent%20%7D%2C)). By registering, you ensure that when you run the development server, Mastra will discover the agent and expose it via the API.

## Existing Projects

To add Mastra to an **existing Node.js project** instead of creating a new one, you can use the same CLI initializer: run `mastra init` in your project directory to interactively add the `src/mastra` scaffold and dependencies ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Existing%20Project%20Installation)). See the Local Development documentation for more on `mastra init` if needed.

Framework-specific integration guides (e.g., for Next.js) are also available if you want to embed Mastra into an existing app’s context ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=To%20add%20Mastra%20to%20an,dev%20docs%20on%20mastra%20init)).

## Starting the Mastra Server

Mastra provides a development server to host your agents (and workflows) with a REST API.

### Development Server

To start the local server, run the following command in your project:

```sh
npm run dev
``` 

*(This assumes the project’s `package.json` has a script for starting the dev server. If you used the CLI scaffolding, it should.)* 

Alternatively, if you have Mastra installed globally or as an npx command, simply run:

```sh
mastra dev
``` 

This launches a local server (by default on **http://localhost:4111**) and sets up REST endpoints for each agent and workflow ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Start%20the%20Mastra%20Server)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=If%20you%20have%20the%20mastra,CLI%20installed%2C%20run)). For example, an agent named “weatherAgent” will be served at: 

```
POST http://localhost:4111/api/agents/weatherAgent/generate
``` 

(Mastra will automatically create endpoints like `/api/agents/<agentId>/generate` and `/stream`.)

### Test the Endpoint

You can test that your agent is working by calling its endpoint with a tool like `curl` or using `fetch` in JavaScript ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Test%20the%20Endpoint)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=fetch%28%27http%3A%2F%2Flocalhost%3A4111%2Fapi%2Fagents%2FweatherAgent%2Fgenerate%27%2C%20,)).

**Using cURL:**

```sh
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages": ["What is the weather in London?"]}'
``` 

**Using Fetch (Node.js or browser):**

```js
fetch('http://localhost:4111/api/agents/weatherAgent/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: ['What is the weather in London?'],
  }),
})
  .then(response => response.json())
  .then(data => {
    console.log('Agent response:', data.text);
  })
  .catch(error => console.error('Error:', error));
``` 

In both cases, we send a JSON payload with a `messages` array (here using a simplified format where the message content is provided directly). The agent should respond with weather information for London, retrieved via the `weatherTool`.

## Running from the Command Line

Besides the REST API, you can invoke agents programmatically. For example, you might create a script to call an agent directly from Node.js:

In `src/index.ts` (or another script file outside `src/mastra`):

```ts
import { mastra } from "./mastra";

async function main() {
  const agent = await mastra.getAgent("weatherAgent");
  const result = await agent.generate("What is the weather in London?");
  console.log("Agent response:", result.text);
}

main();
``` 

Run this script with ts-node or tsx:

```sh
npx tsx src/index.ts
``` 

This will initialize the Mastra instance, retrieve the `weatherAgent` by name, and call its `generate()` method with a user query ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=async%20function%20main%28%29%20,weatherAgent)) ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=Then%2C%20run%20the%20script%20to,everything%20is%20set%20up%20correctly)). The response’s text is then printed to the console. This is a quick way to test your agent logic end-to-end without using the HTTP interface.

```  

**Project-Structure.md**  
```markdown
# Project Structure

Mastra does not enforce a rigid project layout, but it provides a default structure and best practices. You can organize your agents, tools, and workflows in separate files or even combine them, but separation is recommended for clarity ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=You%20could%20write%20everything%20in,workflow%20into%20their%20own%20files)) ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=We%20don%E2%80%99t%20enforce%20a%20specific,project%20with%20a%20sensible%20structure)). The Mastra CLI (`mastra init`) can scaffold a sensible folder structure for you.

## Using the CLI

When you run `mastra init` (or the project creation during installation), it allows you to choose a directory and components to include ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Using%20the%20CLI)):

- **Mastra directory**: by default `src/mastra` is suggested as the root for all Mastra files ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=,to%20include%20in%20your%20project)).
- **Components to install**: you can select Agents, Tools, Workflows (any combination) to scaffold ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=,to%20help%20you%20get%20started)).
- **Default LLM provider**: choose a provider (OpenAI, Anthropic, Groq, etc.) for initial setup ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=,code%20to%20help%20you%20get)).
- **Include example code**: optionally include sample agent/tool/workflow code to get started faster ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=,to%20help%20you%20get%20started)).

The CLI will generate files and directories accordingly.

### Example Project Structure

If you select all components with example code, the generated structure might look like this ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Example%20Project%20Structure)) ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=,.env)):

- **root folder** (your project)
  - **src**
    - **mastra** (Core Mastra application folder) ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Top))
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

- **`src/mastra`** – Core application folder for Mastra components (agents, tools, workflows) ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Top)).
- **`src/mastra/agents`** – Contains agent configuration files (each agent in a separate file) ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Top)).
- **`src/mastra/tools`** – Contains custom tool definition files.
- **`src/mastra/workflows`** – Contains workflow definition files.

You are free to create additional sub-folders (for example, you might group related tools or agents in subdirectories), but the above is a common pattern.

### Top-level Files

- **`src/mastra/index.ts`** – Main configuration file where you import and register all agents, tools, and workflows with the Mastra instance ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Top)).
- **`.env`** – Environment variable definitions (API keys, config settings) for your application ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Top)).

Using this structure, Mastra’s conventions (like the dev server auto-discovering agents/workflows in the `src/mastra` directory) will work out-of-the-box. While you can organize files differently, following this structure helps maintain consistency and makes it easier to navigate your AI app’s code.
```

**Agent-Overview.md**  
```markdown
# Agents Overview

**Agents** in Mastra are autonomous entities powered by language models. An agent can decide on a sequence of actions (including calling tools or workflows) to fulfill a task ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Agents%20in%20Mastra%20are%20systems,have%20access%20to%20tools%2C%20workflows)). Agents have a persona (instructions), memory, a set of tools they can use, and an associated LLM model. They behave like knowledgeable assistants or workers in your application, maintaining context over multiple interactions ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Agents%20in%20Mastra%20are%20systems,knowledge%20bases%20you%20have%20built)).

## Creating an Agent

To create an agent, use the `Agent` class from `@mastra/core/agent` and provide its configuration ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=1)). For example:

```ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";

export const myAgent = new Agent({
  name: "My Agent",
  instructions: "You are a helpful assistant.",
  model: openai("gpt-4o-mini"),
});
``` 

In this snippet, we define an agent with a **name**, some **instructions** (a system prompt describing its role), and assign it an LLM model (using OpenAI’s `gpt-4o-mini` in this case) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=src%2Fmastra%2Fagents%2Findex)). Ensure you have set your OpenAI API key in the environment so the model call is authorized ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Note%3A%20Ensure%20that%20you%20have,file)). Also, make sure the Mastra core package is installed in your project (which it should be if you followed installation steps) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=OPENAI_API_KEY%3Dyour_openai_api_key)).

### Registering the Agent

After creating an agent, you must register it with a Mastra instance so it’s recognized by the system (and for logging, tool integration, etc.) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Registering%20the%20Agent)). In `src/mastra/index.ts`:

```ts
import { Mastra } from "@mastra/core";
import { myAgent } from "./agents";

export const mastra = new Mastra({
  agents: { myAgent },
});
``` 

By adding your agent to the `agents` property of the Mastra constructor, it becomes active. Registration enables the agent to be served via the dev server and have access to configured tools and integrations ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=src%2Fmastra%2Findex)).

## Generating and Streaming Text

Once an agent is created and registered, you can ask it to generate text responses.

### Generating text

Use the agent’s `.generate()` method to get a completion or answer. This method accepts an array of messages (in chat format) or a single string prompt. For example:

```ts
const response = await myAgent.generate([
  { role: "user", content: "Hello, how can you assist me today?" },
]);
console.log("Agent:", response.text);
``` 

Here we send a user message to the agent and log the `response.text` it produces ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Generating%20text)). The messages array follows the structure of a conversation (each message has a role like "user", "assistant", etc.). The agent uses its model to generate a reply.

### Streaming responses

For real-time or incremental output, Mastra agents support streaming. Instead of waiting for the full response, you can receive chunks of text:

```ts
const stream = await myAgent.stream([
  { role: "user", content: "Tell me a story." },
]);

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk);
}
``` 

This initiates a streaming generation ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Streaming%20responses)). The `stream.textStream` is an asynchronous iterable of text chunks. The loop writes each chunk to stdout as it arrives, allowing you to output the agent’s response progressively (useful for long answers or when integrating with real-time UI updates) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=const%20stream%20%3D%20await%20myAgent.stream%28,%7D%2C)).

## Structured Output

Agents can return not only plain text but also **structured data**. You can enforce an output format by providing a JSON Schema or a Zod schema as the expected output shape ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=3)).

### Using JSON Schema

Define a JSON Schema object describing the desired structure and pass it as the `output` option in `generate()`. For example:

```ts
const schema = {
  type: "object",
  properties: {
    summary: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
  },
  additionalProperties: false,
  required: ["summary", "keywords"],
};

const response = await myAgent.generate(
  [{ role: "user", content: "Provide a summary and keywords for the text..." }],
  { output: schema }
);

console.log("Structured Output:", response.object);
``` 

In this case, the agent will attempt to format its response as an object with a string `summary` and an array of `keywords` ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Agents%20can%20return%20structured%20data,or%20using%20a%20Zod%20schema)) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=const%20response%20%3D%20await%20myAgent,%7D%2C%20%5D%2C)). The `.generate()` call returns `response.object` (the parsed object matching the schema) in addition to `response.text`. We log the structured output.

### Using Zod

Mastra also supports using a **Zod** schema for type-safe outputs. First ensure Zod is installed (`npm install zod`) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=First%2C%20install%20Zod%3A)), then:

```ts
import { z } from "zod";

const schema = z.object({
  summary: z.string(),
  keywords: z.array(z.string()),
});

const response = await myAgent.generate(
  [{ role: "user", content: "Provide a summary and keywords for the text..." }],
  { output: schema }
);

console.log("Structured Output:", response.object);
``` 

This achieves the same goal, but using Zod schemas gives you compile-time types and convenient validation ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=import%20,zod)) ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=%5B%20%7B%20role%3A%20,output%3A%20schema%2C)). The agent’s output is automatically validated and parsed into `response.object` as before.

## Running Agents

To run agents (i.e., serve them behind an API or otherwise execute them), Mastra provides the CLI command `mastra dev` ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=match%20at%20L396%204,Agents)). By default, `mastra dev` will look for any exported agents in `src/mastra/agents` and make them available via HTTP endpoints.

### Starting the Server

Simply run:

```sh
mastra dev
``` 

This starts a local server (on port 4111 by default) and exposes each agent at an endpoint. For example, an agent with name `myAgent` can be accessed at:

```
POST http://localhost:4111/api/agents/myAgent/generate
``` 

 ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Starting%20the%20Server)). You should see console output from Mastra confirming the server start and available endpoints.

### Interacting with the Agent

With the server running, you can send requests. For instance, using `curl`:

```sh
curl -X POST http://localhost:4111/api/agents/myAgent/generate \
  -H "Content-Type: application/json" \
  -d '{
        "messages": [
          { "role": "user", "content": "Hello, how can you assist me today?" }
        ]
      }'
``` 

This will get a JSON response from the agent ([Creating and Calling Agents | Agent Documentation | Mastra](https://mastra.ai/docs/agents/00-overview#:~:text=Interacting%20with%20the%20Agent)). You can integrate this API into your application or use the provided Mastra client SDK for convenience (see **Local-Dev.md** for client usage).

## Next Steps

Now that you have an agent, you might want to extend its capabilities:

- **Memory**: To give the agent conversation memory or long-term context, see **Agent-Memory.md** for how to use Mastra’s memory system.
- **Tools**: To allow the agent to perform actions or use external APIs, see **Agent-Tools.md** on adding and creating tools.
- **Voice**: For speech capabilities (text-to-speech or speech-to-text), refer to **Agent-Voice.md** if needed.

You can also see a full agent example in the guides (e.g., the “Chef Michel” agent example in the Mastra documentation). With the basics in place, an agent can now engage in conversations, use tools, and learn from context as configured.
```

**Agent-Memory.md**  
```markdown
# Agent Memory

Mastra provides a built-in memory system for agents to maintain conversational context and store information over time ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Agents%20in%20Mastra%20have%20a,memory%20system%20supports%20both%20traditional)). This memory is used to feed relevant history back into the model, enabling continuity across turns and better long-term coherence.

Key aspects of the memory system:

- **Threads and Resources**: Conversations can be partitioned by a `threadId`, and optionally grouped by a higher-level `resourceId` (for example, a user ID). This allows an agent to handle multiple separate conversation threads and recall each independently ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Threads%20and%20Resources)). A thread represents a continuous dialogue session.
- **Recent Message History**: By default, Mastra memory keeps the last 40 messages in context ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Recent%20Message%20History)). This ensures recent interactions are remembered. The number of messages to retain (`lastMessages`) is configurable if you need more or fewer.
- **Semantic Search**: The memory system can embed messages and perform similarity search to recall older relevant messages beyond the recent window ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Semantic%20Search)). Mastra includes a default embedder (FastEmbed model) and uses LibSQL for vector storage by default, so semantic memory is on by default unless disabled ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Semantic%20Search)).
- **Storage Backend**: Memory data (messages and embeddings) can be stored in different backends. By default, Mastra uses an embedded LibSQL (SQLite-based) database for storing conversation logs and vectors ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Memory%20Configuration)). You can configure other stores like Postgres or Upstash for persistence (see **Storage Options** below).

## Memory Configuration

You can configure memory when initializing Mastra. By default, a Memory instance with default settings is created if you include the Memory module. For most use cases, the default (LibSQL + FastEmbed) works out-of-the-box ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=The%20Mastra%20memory%20system%20is,storage%20and%20vector%20search%2C%20and)).

For advanced usage, you might customize:
- The database for storing messages (LibSQL by default, but can use Postgres, etc.).
- The vector database for embeddings (LibSQL, Pinecone, etc.).
- Parameters like how many recent messages to keep, whether to enable semantic search, etc. ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Custom%20Configuration)) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Overriding%20Memory%20Settings)).

**Basic Configuration**: When you create the Mastra instance, you can pass a `memory` configuration. For example, to adjust just the message limit:

```ts
import { Memory } from "@mastra/memory";
const memory = new Memory({ lastMessages: 50 });  // keep 50 recent messages
export const mastra = new Mastra({ agents: { myAgent }, memory });
``` 

This will apply to all agents under this Mastra instance (they share the memory config) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Overriding%20Memory%20Settings)).

**Custom Configuration**: You can specify a different storage or embedder. For instance:

```ts
import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";
import { OpenAIEmbedding } from "@ai-sdk/openai";

const memory = new Memory({
  storage: new PostgresStore({ /* Postgres connection config */ }),
  embedder: OpenAIEmbedding("text-embedding-ada-002"),
  lastMessages: 30,
});
export const mastra = new Mastra({ agents: { myAgent }, memory });
``` 

In this example, we use a PostgreSQL storage for messages and an OpenAI embedding model for semantic search, and limit recent messages to 30. (Make sure to install `@mastra/pg` for Postgres support.) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Custom%20Configuration)) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=%2F%2F%20Initialize%20memory%20const%20memory,))

**Storage Options**: Mastra currently supports multiple storage adapters for memory ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Storage%20Options)) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=PostgreSQL%20Storage)):
- **LibSQL (SQLite)** – Default lightweight embedded database ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Mastra%20currently%20supports%20several%20storage,backends)).
- **PostgreSQL** – Using `PostgresStore` from `@mastra/pg` for production-grade DB ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=match%20at%20L455%20PostgreSQL%20Storage)).
- **Upstash (Redis)** – Using `UpstashStore` from `@mastra/upstash` for serverless Redis-like storage ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=match%20at%20L467%20Upstash%20KV,Storage)).
- (You can extend or implement your own storage by conforming to the storage interface if needed.)

**Vector Search**: For semantic memory, Mastra can integrate with vector stores (if not using the default LibSQL). For example, you could use Pinecone or pgvector by configuring the embedder and vector store accordingly. By default, if you don’t change anything, semantic search is active via the default embedder (bge-small-en model) and LibSQL’s vector support ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Semantic%20Search)) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Mastra%20supports%20semantic%20search%20through,historical%20messages%20based%20on%20semantic)).

## Using Memory in Agents

When memory is configured, agents automatically utilize it during `.generate()` and `.stream()` calls as long as you provide a `resourceId` and `threadId` in the generate options ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=%2F%2F%20Memory%20is%20automatically%20used,)). For example:

```ts
const response = await myAgent.generate(
  "What were we discussing earlier about performance?",
  { resourceId: "user_123", threadId: "thread_456" }
);
``` 

Here `resourceId` might identify the user and `threadId` a specific conversation. Mastra will then:
1. Store this query and response in the storage backend.
2. Retrieve recent messages for thread_456.
3. Use semantic search to find any older messages about "performance" in that thread.
4. Inject the relevant context into the prompt for the agent ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=The%20memory%20system%20will%20automatically%3A)).

All of this happens automatically. You just need to supply consistent `resourceId`/`threadId` values for related calls.

If you do not specify these IDs, Mastra can treat each call in isolation (no memory) or use a default session, depending on configuration.

## Manually Managing Memory

In most cases, you won’t need to directly manipulate memory; using the agent API with thread IDs is sufficient. However, for advanced control, you can use the `Memory` API directly ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Manually%20Managing%20Threads)). For example:

```ts
import { Memory } from "@mastra/memory";
import { PostgresStore } from "@mastra/pg";

const memory = new Memory({
  storage: new PostgresStore({ /* connection details */ })
});

// Create a new conversation thread
const thread = await memory.createThread({
  resourceId: "user_123",
  title: "Project Discussion",
  metadata: { project: "mastra", topic: "architecture" }
});

// Save a message to the thread
await memory.saveMessages({
  messages: [
    {
      id: "msg_1",
      threadId: thread.id,
      role: "user",
      content: "What's the project status?",
      createdAt: new Date(),
      type: "text",
    },
  ],
});

// Query messages from the thread (e.g., last 10 messages or search by content)
const messages = await memory.query({
  threadId: thread.id,
  selectBy: {
    last: 10,
    vectorSearchString: "performance"
  },
});

// Fetch or update threads if needed
const sameThread = await memory.getThreadById({ threadId: thread.id });
const allUserThreads = await memory.getThreadsByResourceId({ resourceId: "user_123" });
await memory.updateThread({ id: thread.id, title: "Updated Discussion" });
await memory.deleteThread(thread.id);
``` 

This low-level API lets you create and manage threads and messages manually ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=Here%E2%80%99s%20how%20to%20manually%20work,with%20threads)) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=%2F%2F%20Manually%20save%20messages%20to,createdAt%3A%20new%20Date)). For example, you might pre-load some context by creating a thread and saving initial messages, or clean up old data. In typical usage, however, simply relying on the agent methods with thread IDs is easier.

**Note:** All agents under the same Mastra instance share the memory configuration. If you need different memory behavior for different agents, you would currently need separate Mastra instances or custom logic inside your tools/agents to handle memory differently. Mastra’s memory system is powerful for maintaining continuity, which is crucial in multi-turn conversations and stateful interactions.
```

**Agent-Tools.md**  
```markdown
# Agent Tools

**Tools** in Mastra are functions that agents (or workflows) can call to perform specific tasks or integrate with external services ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Tools%20are%20typed%20functions%20that,Each%20tool%20has%20a%20schema)). Tools are defined with schemas for inputs and outputs, which ensures the agent knows how to use them and what to expect in return. This section covers creating tools and enabling them for agents.

## Creating Tools

To create a tool, use the `createTool` function from `@mastra/core` (or specific tool helpers). A basic example is a tool that fetches weather info (similar to the one in installation):

```ts
import { createTool } from "@mastra/core";
import { z } from "zod";

export const weatherInfo = createTool({
  id: "getWeather",
  description: "Fetches current weather for a given city",
  inputSchema: z.object({ city: z.string() }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
  }),
  execute: async ({ context }) => {
    const city = context.city;
    // ... call weather API ...
    return { temperature: 72, conditions: "Sunny" };
  },
});
``` 

Here, `id` is a unique identifier for the tool, and `description` explains its purpose in simple terms (for the agent’s understanding) ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Tool%20Descriptions)). We use Zod to define that the tool expects a `city` string and returns an object with a temperature and conditions. The `execute` function contains the logic (e.g., API calls) and returns a result matching the output schema.

The schemas inform the LLM how to call the tool (what arguments to provide) and interpret the results, making tool use much more reliable.

## Adding Tools to an Agent

After defining a tool, you need to allow an agent to use it. When creating an agent, include a `tools` property listing the tool(s). For example:

```ts
import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { weatherInfo } from "../tools";

export const weatherAgent = new Agent({
  name: "Weather Agent",
  instructions: "You can answer weather questions using a tool.",
  model: openai("gpt-4"),
  tools: { weatherInfo },
});
``` 

Now `weatherAgent` has access to the `weatherInfo` tool ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Adding%20Tools%20to%20an%20Agent)). The agent’s LLM can decide to call `getWeather` (the tool’s id) when needed. During a conversation, if the agent’s prompt suggests a tool action (based on the underlying chain-of-thought or function-calling logic of the model), Mastra will execute the `weatherInfo.execute` function and feed the result back to the agent.

## Registering the Agent (with Tools)

Make sure to register the agent in `mastra = new Mastra({ agents: { weatherAgent } })` as usual so that it’s active ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Now%20we%E2%80%99ll%20add%20the%20tool,tool)). There’s nothing extra needed for tools beyond including them in the agent definition. Once the agent is running, tools are automatically available for it to call.

## Debugging Tools

When you create tools, it’s good practice to test them in isolation. You can write unit tests for tool functions (since `execute` is a regular async function). Using a testing framework like Vitest or Jest, you could call `weatherInfo.execute({ context: { city: "London" } })` and verify the output is as expected ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Debugging%20Tools)).

Mastra tools are plain functions at their core, so standard debugging (like using console logs or a debugger) inside the `execute` function works. Also, when running `mastra dev`, any errors thrown by `execute` will be logged to the console for troubleshooting.

## Calling an Agent with a Tool

From the developer’s perspective, calling an agent that uses tools is the same as any other agent call (you still use `agent.generate()` or via API). The model (if it supports function calling, like OpenAI GPT-4) will determine when to invoke the tool. Mastra handles the actual function call behind the scenes. For example:

```ts
const response = await weatherAgent.generate("What's the weather in Paris?");
console.log(response.text);
``` 

If using OpenAI function-calling under the hood, the agent might choose to call `getWeather` with `{"city": "Paris"}`. Mastra will execute `weatherInfo` and inject the result (e.g., `{"temperature": 75, "conditions": "Clear"}`) into the conversation, and the final answer might be, *"It's 75°F and clear in Paris."*.

No special code is required to trigger the tool; it’s all about the agent’s prompt design and the model’s decision. Ensure your agent’s instructions or system message encourage tool use when appropriate (e.g., *“Use available tools for information.”*).

## Example: Interacting with the Agent

Suppose we have a running dev server with `weatherAgent` registered. You can test its tool usage via the API:

```sh
curl -X POST http://localhost:4111/api/agents/weatherAgent/generate \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role":"user","content":"What is the weather in Paris?"}]}'
``` 

The agent will respond with an answer, likely using the tool internally to fetch data.

## Vercel AI SDK Tool Format

Mastra also supports tools created using the Vercel AI SDK conventions ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Vercel%20AI%20SDK%20Tool%20Format)). If you have an existing tool defined via the Vercel AI SDK (which might include its own schema and function), you can integrate it by importing it and including it in an agent’s tools. This means Mastra is compatible with a wider ecosystem of function-calling tools.

For example, if `someTool` was defined with Vercel’s format, you could do:

```ts
import { someTool } from "./vercel-tools";
export const agent = new Agent({
  ...,
  tools: { someTool },
});
``` 

Mastra will treat it similarly to a tool made with `createTool`, as long as the interfaces align.

## Tool Design Best Practices

When writing tool definitions, consider the following guidelines ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Tool%20Design%20Best%20Practices)) ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Parameter%20Schemas)):

- **Clear Descriptions**: Keep the tool’s `description` focused on its purpose. The agent sees this description, so it should convey what the tool does, not how it does it ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Tool%20Descriptions)). (Example: “Fetch the main branch reference from a GitHub repo” is clear and concise.)
- **Schema Usage**: Put any needed technical constraints or data specifications in the `inputSchema` and `outputSchema`. This helps the agent and Mastra validate usage. (For instance, if an input must be an email address, the schema can enforce a string pattern.)
- **Simplicity**: Aim for each tool to do one thing well. Complex operations can be broken into multiple tools or steps in a workflow. This makes it easier for the LLM to decide on actions.
- **Error Handling**: In `execute`, handle errors gracefully. Throw errors with meaningful messages for invalid inputs or failures (Mastra will relay this back to the agent’s output so you know what went wrong).
- **Security**: Be mindful of what your tool does, especially if it executes system commands or accesses external services. Validate inputs if necessary to avoid injection or misuse.

By following these practices, your agents will use tools more effectively and you’ll reduce unexpected behavior ([Agent Tool Selection | Agent Documentation | Mastra](https://mastra.ai/docs/agents/02-adding-tools#:~:text=Agent%20Interaction%20Patterns)).
```

**Agent-Voice.md**  
```markdown
# Adding Voice to Agents

Mastra agents can be extended with voice capabilities – meaning they can **speak** responses (text-to-speech) and **listen** to user audio (speech-to-text) ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=Mastra%20agents%20can%20be%20enhanced,agent%20to%20use%20either%20a)). This is useful for building voice assistants or phone-based agents. Mastra integrates with third-party voice providers to achieve this.

## Using a Single Provider

The simplest way to give an agent voice is to use one provider for both TTS (text-to-speech) and ASR (automatic speech recognition). For example, you might use OpenAI’s Whisper for transcription and a single TTS engine for output.

In Mastra, voice is configured when creating an Agent by specifying a `voice` property. For a single provider case:

```ts
import { Agent } from "@mastra/core/agent";
import { Voice } from "@mastra/core/voice";
import { openai } from "@ai-sdk/openai";

export const myVoiceAgent = new Agent({
  name: "Voice Agent",
  instructions: "You can speak your answers.",
  model: openai("gpt-4"),
  voice: Voice.fromProvider(openai.voice({ voiceId: "Joanna" }))
});
``` 

*(Pseudo-code example: actual provider usage may vary)*

Here, `Voice.fromProvider(...)` might wrap a TTS/ASR provider into a Mastra Voice interface. The agent would then use that for speaking and listening. The specifics depend on the provider integration (Mastra may provide helpers for supported voice APIs, such as AWS Polly or Google Cloud TTS).

Using a single provider is straightforward but may be limited in flexibility.

## Using Multiple Providers

For more flexibility, Mastra offers a `CompositeVoice` class to mix and match providers for input vs. output ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=Using%20Multiple%20Providers)). For instance, you could use one service for speech synthesis and another for speech recognition.

Example setup:

```ts
import { Agent } from "@mastra/core/agent";
import { CompositeVoice } from "@mastra/core/voice";
import { ElevenLabsVoice } from "@mastra/voice-elevenlabs";
import { OpenAITranscription } from "@mastra/voice-openai"; 

const compositeVoice = new CompositeVoice({
  speech: new ElevenLabsVoice({ apiKey: process.env.ELEVENLABS_KEY }),
  transcription: new OpenAITranscription({ apiKey: process.env.OPENAI_API_KEY })
});

export const myVoiceAgent = new Agent({
  name: "Voice Agent",
  instructions: "You can speak and listen.",
  model: openai("gpt-4"),
  voice: compositeVoice
});
``` 

In this imaginary setup, ElevenLabs is used for generating spoken audio from text, and OpenAI’s Whisper (via OpenAITranscription) is used for transcribing user audio to text.

## Working with Audio Streams

When an agent has voice enabled, you can call special methods to **speak** or **listen**. The `agent.speak(text)` method will return a readable stream of audio (the spoken form of the text) ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=Working%20with%20Audio%20Streams)), and `agent.listen(audioStream)` would convert an audio stream to text.

For example, to **save speech output** to a file:

```ts
import { createWriteStream } from 'fs';

const audioStream = await myVoiceAgent.speak("Hello, how are you?");
const writeStream = createWriteStream("output.wav");
audioStream.pipe(writeStream);
``` 

This will generate speech for the given text and pipe the audio data into a WAV file ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=The%20,save%20and%20load%20audio%20files)).

Similarly, for **transcribing audio input** from a file:

```ts
import { createReadStream } from 'fs';

const readStream = createReadStream("question.wav");
const text = await myVoiceAgent.listen(readStream);
console.log("Transcribed text:", text);
``` 

Here, an audio file (`question.wav`) is fed into the agent’s listen function, which returns the recognized text ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=match%20at%20L312%20Transcribing%20Audio,Input)).

## Saving Speech Output

If you want to programmatically handle the audio stream from `speak()`, as shown above, you can use Node’s fs streams to save it or process it further. The audio format and encoding depend on the provider (could be WAV, MP3, etc., typically PCM stream for TTS). Always check provider documentation for how audio is returned ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=match%20at%20L295%20Saving%20Speech,Output)).

## Transcribing Audio Input

The `listen()` method can take a stream of audio data (e.g., microphone input or a file stream) and returns a Promise for the transcribed text ([Adding Voice to Agents](https://mastra.ai/docs/agents/03-adding-voice#:~:text=Transcribing%20Audio%20Input)). Under the hood, this will use the configured transcription provider (like Whisper) to decode the audio.

## Voice Integration Providers

Mastra’s voice integration relies on external services. Some providers and integrations include:
- **OpenAI Whisper** for transcription.
- **ElevenLabs** or **Azure Cognitive Services** for text-to-speech.
- **Google Cloud Speech** / **Text-to-Speech**.
- **AWS Polly** for TTS and **Transcribe** for STT.

These are not built into Mastra core, but Mastra provides wrapper classes or guidelines to use them (as seen with `CompositeVoice`). You’ll need to install the corresponding integration packages (e.g., `@mastra/voice-elevenlabs`) and provide API keys.

## Usage Considerations

- **Latency**: Converting text to speech or vice versa takes time and might not be instant. Design your interactions knowing there may be a delay for speaking or listening.
- **Audio Formats**: Ensure the audio stream you provide to `listen()` matches what the transcription service expects (correct sample rate, encoding).
- **Threading**: Voice input can be part of a conversation thread. If you transcribe user speech and then call `agent.generate` with that text, the memory thread continues normally.
- **Error Handling**: If a voice service fails (e.g., network error, unclear audio), handle exceptions from `speak()` or `listen()` accordingly (wrap calls in try/catch).

By leveraging voice, your Mastra agents can go beyond text chatbots to become full voice assistants, which can be integrated into phone lines, voice apps, or hardware devices.
```

**Workflows-Overview.md**  
```markdown
# Workflows Overview

Workflows in Mastra orchestrate complex sequences of LLM calls and function executions with deterministic control flow. While an agent is autonomous and reactive, a **workflow** is a predefined chain of steps you design ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Workflows%20in%20Mastra%20help%20you,execution%2C%20resource%20suspension%2C%20and%20more)). Workflows support branching, looping, parallel execution, pausing/resuming, and more, which is useful for multi-step tasks (e.g., a form-filling assistant or a research pipeline).

## When to Use Workflows

Use a workflow when your AI task involves multiple steps or decisions that must follow a specific logic ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=When%20to%20use%20workflows)). For example:
- Running multiple prompts in sequence (where each uses the result of the previous).
- If/then branching based on content of responses.
- Parallel calls to different models or tools and then merging results.
- Long processes that might need to pause for external input (human approval, etc.) and resume later.

Agents could handle some of these via the model’s logic, but workflows give you **explicit control** and reliability for critical logic.

## Creating a Workflow

To create a workflow, use the `Workflow` class from `@mastra/core/workflow`. A workflow consists of:
- A **name** (used for identification and API endpoint).
- An optional **trigger schema** defining input data that triggers the workflow.

For example:

```ts
import { Workflow } from "@mastra/core/workflow";
import { z } from "zod";

const myWorkflow = new Workflow({
  name: "my-workflow",
  triggerSchema: z.object({ inputValue: z.number() }),
});
``` 

This defines a workflow named `"my-workflow"` which expects an object with `inputValue` (number) as input when started ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=)) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=triggerSchema%3A%20z.object%28,)). The `name` also determines the endpoint (`/api/workflows/my-workflow/...`).

### Defining Steps

After creating a Workflow instance, define one or more **Step**s. Steps represent individual units of work (which could be an LLM call, a tool execution, or any function).

Example steps:

```ts
import { Step } from "@mastra/core/workflow";

const stepOne = new Step({
  id: "stepOne",
  outputSchema: z.object({ doubledValue: z.number() }),
  execute: async ({ context }) => {
    const input = context.triggerData.inputValue;
    return { doubledValue: input * 2 };
  },
});

const stepTwo = new Step({
  id: "stepTwo",
  execute: async ({ context }) => {
    if (context.steps.stepOne.status !== "success") {
      return { incrementedValue: 0 };
    }
    const prev = context.steps.stepOne.output.doubledValue;
    return { incrementedValue: prev + 1 };
  },
});
``` 

In this simplified example:
- `stepOne` takes the trigger input and doubles it ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Now%2C%20we%E2%80%99ll%20define%20the%20workflow%E2%80%99s,LLM%20calls%20in%20this%20example)) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=outputSchema%3A%20z.object%28,)).
- `stepTwo` waits for stepOne’s result and then adds 1, but only if stepOne succeeded ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=)). (Each step’s execution context can access prior steps’ outputs and statuses via `context.steps`.)

### Linking Steps (Control Flow)

Once steps are defined, you link them into the workflow’s execution order and then finalize (commit) the workflow:

```ts
myWorkflow
  .step(stepOne)      // first step
  .then(stepTwo)      // next step after stepOne
  .commit();
``` 

Here we say `stepOne` is the start, and then `.then(stepTwo)` means stepTwo runs after stepOne completes successfully ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=)) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=myWorkflow%20)). We call `.commit()` to finalize the structure. After committing, no more steps can be added (it’s locked in for execution).

If you had branching or parallelism, you might use different linking methods (see **Workflows-ControlFlow.md** for advanced patterns). For linear flows, `.then()` is sufficient.

### Register the Workflow

Just like agents, workflows must be registered with Mastra to be active. In `src/mastra/index.ts`:

```ts
export const mastra = new Mastra({
  workflows: { myWorkflow },
  // ... (agents, memory, etc.)
});
``` 

Registering makes the workflow discoverable by `mastra dev` and accessible via API ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Register%20the%20Workflow)) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=import%20,mastra%2Fcore)).

### Executing the Workflow

You can start a workflow either programmatically or via the HTTP API.

**Programmatically**: Use the `createRun()` method to initialize a run, then call `start()`:

```ts
const { runId, start } = myWorkflow.createRun();
await start({ triggerData: { inputValue: 45 } });
``` 

This kicks off the workflow with `inputValue = 45` ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=import%20,index)). The steps will execute in order. The `runId` can be used to track or query the run’s status later.

**Via API**: Once running `mastra dev`, you can trigger via an endpoint:

```
POST http://localhost:4111/api/workflows/my-workflow/execute
Content-Type: application/json

{ "inputValue": 45 }
```

This will start the workflow similarly ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Or%20use%20the%20API%20,mastra%20dev)). The response will typically contain a runId or the result if it finishes quickly.

If the workflow is long-running or has async steps, you might retrieve status via:
```
GET /api/workflows/my-workflow/<runId>/status
```
(And if waiting for external events, there are event endpoints—see suspend/resume.)

### Example Recap

In our example, triggering with 45:
- `stepOne` outputs `{ doubledValue: 90 }`.
- `stepTwo` sees stepOne succeeded and outputs `{ incrementedValue: 91 }`.
- The workflow result would collect outputs (often the last step’s output is the result, or you can design a specific result aggregation).

This simple workflow didn’t involve any LLM calls, but you could incorporate them by calling `agent.generate()` or similar inside a step’s execute, or by using special LLM step types.

## Further Workflow Concepts

Workflows can do much more:
- **Parallel Steps**: You can run steps in parallel branches and then join results.
- **Conditional Branching**: Use `.after(condition, step)` or `.if(predicate).step(step)` patterns to run steps only if certain conditions are met (success/failure of previous steps, or custom logic) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=match%20at%20L301%20,Linking%20Steps)).
- **Loops**: Methods like `.while(condition).step(step)` and `.until(condition)` allow repeating steps until a condition changes ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Workflows%20let%20you%20define%20a,steps%2C%20branching%20paths%2C%20and%20more)).
- **Suspend & Resume**: A workflow can pause (suspend) at a step waiting for an external event or manual input, then resume when that event is supplied ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Suspend%20and%20Resume)). This is done by marking a step as suspendable and using the API to send an event to resume (see **Workflows-SuspendResume.md** for details).
- **Variables**: Workflow variables allow you to store intermediate values and pass data between steps more flexibly than just through outputs (see **Workflows-Variables.md**) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Workflow%20Variables)).
- **Observability**: Mastra logs each step’s input, output, and status. You can forward these logs to monitoring systems (e.g., Logflare, Datadog) for debugging or analysis ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Observability%20and%20Debugging)) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=You%20can%3A)).

Workflows thus give you a structured way to implement multi-step AI logic that might be too complex for a single agent prompt. They are particularly useful for ensuring certain operations happen or for integrating deterministic logic with LLM calls (like “call API A, then summarize the result with LLM, then if condition X, call API B,” etc.).

In the following topics, we’ll dive into specific workflow features like control flow, variables, and suspension.
```

**Workflows-Steps.md**  
```markdown
# Workflow Steps

A **Step** is the fundamental unit of a Mastra workflow. Each step has defined inputs, outputs, and an execution function. Steps can be linked together to form the overall workflow.

When building a workflow, you have two ways to create steps:

## Inline Step Creation

You can define and add steps in one fluent sequence using the Workflow’s chaining methods `.step()` and `.then()`. For example:

```ts
const myWorkflow = new Workflow({ name: "example" });

myWorkflow
  .step(new Step({
    id: "first",
    outputSchema: z.object({ result: z.number() }),
    execute: async ({ context }) => {
      // ... do something ...
      return { result: 42 };
    }
  }))
  .then(new Step({
    id: "second",
    execute: async ({ context }) => {
      const prev = context.steps.first.output.result;
      // ... do something with prev ...
      return {};
    }
  }))
  .commit();
``` 

In this style, we directly create `Step` instances inside the workflow chaining. The first step is added with `.step()`, subsequent steps with `.then()` to indicate order ([Creating Steps and Adding to Workflows | Mastra Docs](https://mastra.ai/docs/workflows/steps#:~:text=Inline%20Step%20Creation)). This is concise for simple linear flows and keeps the definition close together.

## Creating Steps Separately

For better modularity or reusability, you can define steps as separate constants and then add them:

```ts
const stepA = new Step({ id: "A", execute: async () => { /* ... */ } });
const stepB = new Step({ id: "B", execute: async () => { /* ... */ } });

// Later on, in workflow definition:
myWorkflow.step(stepA).then(stepB).commit();
``` 

This approach separates the step logic from the linking. It’s useful if:
- You want to reuse the same `Step` in multiple workflows.
- You want to keep each step’s code isolated for clarity or testing.

Either approach is fine; Mastra doesn’t differentiate beyond how you organize your code.

## Step Execution Context

Within a step’s `execute` function, you have access to a `context` object. Important parts of `context`:
- `context.triggerData` – the initial input to the workflow (matching the triggerSchema).
- `context.steps` – an object containing the outputs and statuses of previously executed steps in this run. For example, `context.steps.first.output` gives you step “first”’s output, and `context.steps.first.status` gives its status ("success" or "error").
- `context.variables` – workflow variables (if any are set; see **Workflows-Variables.md**).
- You also have access to any Mastra instance or environment config if needed (not usually needed inside steps unless interacting with outside world).

By using `context.steps`, a step can make decisions based on prior results (as shown with checking `context.steps.first.output` above). This is how data flows between steps without global variables.

## Step Input/Output Schemas

Defining `inputSchema` or `outputSchema` on a Step is optional but recommended for complex steps:
- `inputSchema` (not shown in examples above) would validate any data passed *into* this step from a previous step via variables or mappings.
- `outputSchema` validates what the step returns.

In practice, many steps might not need explicit input schemas because they rely on `context` for input. But output schemas are great for ensuring the step’s result is structured (especially if a later step expects certain fields to exist).

## Error Handling in Steps

If a step throws an error or returns a rejected Promise, Mastra will mark that step as "error". You can design workflows to handle errors:
- If a step errors out and there’s no special handling, the workflow run might stop (unless you have an `.after()` chain for errors).
- You can use `.after("error", stepX)` to run a recovery step if a particular step fails (see **Workflows-ControlFlow.md** for branching by status).
- Each `context.steps.stepName.status` can be checked; in our earlier example, stepTwo checked if stepOne was success before using its output.

## Testing Steps

Since a Step’s `execute` is just a function, you can test it independently. For example:

```ts
const result = await stepOne.execute({ context: { triggerData: { inputValue: 5 }, steps: {} } });
expect(result.doubledValue).toBe(10);
``` 

Providing a mock `context` with the data needed (triggerData or previous step outputs) allows unit testing of the step logic outside the full workflow environment.

In summary, Steps break down your workflow into manageable pieces, each with a single responsibility. This modularity makes complex workflows easier to reason about and maintain.
```

**Workflows-ControlFlow.md**  
```markdown
# Workflow Control Flow

Workflows allow sophisticated control flow mechanisms to handle branching, parallel execution, and conditional paths ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Most%20AI%20applications%20need%20more,certain%20paths%2C%20or%20even%20pause)). Here’s how you can manage different execution patterns:

## Sequential vs Parallel

By default, using `.then(stepB)` after `.step(stepA)` links steps sequentially (B runs after A completes). If you want two steps to run in parallel (concurrently), you can initiate them from the same preceding step:

```ts
myWorkflow.step(stepStart);
myWorkflow.then(stepBranch1, { parallel: true });
myWorkflow.then(stepBranch2, { parallel: true }).commit();
```

In this hypothetical API, if `parallel: true` is set, `stepBranch1` and `stepBranch2` both receive `stepStart` as their predecessor and can execute simultaneously. (The exact API for parallel may differ; some frameworks use `.branch()` or adding multiple steps in an array.)

Mastra’s documentation suggests support for parallel and advanced flows ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Workflows%20in%20Mastra%20help%20you,execution%2C%20resource%20suspension%2C%20and%20more)) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Workflows%20let%20you%20define%20a,steps%2C%20branching%20paths%2C%20and%20more)), so consult the reference for the precise syntax. The key is: parallel steps share the same parent in the execution graph.

## Conditional Branching (If/Else)

To execute steps conditionally, you can use conditions on workflow links. Mastra provides an `.after()` method that can take a condition (like run on success or failure of previous step) ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=match%20at%20L301%20,Linking%20Steps)), and likely an `.if()`/`.else()` API for explicit conditions.

Example pattern:
```ts
myWorkflow
  .step(stepA)
  .then(stepB)
  .after(
    context => context.steps.stepB.output.value > 0, 
    stepC
  )
  .after(
    context => context.steps.stepB.output.value <= 0, 
    stepD
  )
  .commit();
```

In this pseudo-code:
- After stepB, if the output `value` is positive, stepC runs; if not, stepD runs. Only one of C or D will execute depending on the condition outcome.

Mastra likely has a more structured way (like `Workflow.if(condition).step(stepC).else().step(stepD)` etc., as hinted by references ([Branching, Merging, Conditions | Workflows | Mastra Docs](https://mastra.ai/docs/workflows/control-flow#:~:text=,Mastra%20Docs)) ([Branching, Merging, Conditions | Workflows | Mastra Docs](https://mastra.ai/docs/workflows/control-flow#:~:text=,Mastra%20Docs))). The effect is to create an if/else branch in the workflow.

## Merging Branches

If you had parallel or conditional branches that should converge later, ensure subsequent steps have all required data. You might design the steps such that both branches set some workflow variable or produce outputs needed by the merging step.

For example, you might have:
```ts
// After stepC or stepD, both lead to stepE
myWorkflow.after("success", stepE);
```
By using `.after("success", stepE)` on both C and D, you indicate stepE should wait until any preceding branch that succeeded calls it. StepE can then use context to see which branch provided data.

Mastra’s workflow engine handles tracking which steps are complete. The general approach is:
- Use unique IDs for steps.
- In a merge step, check context for outputs from possibly multiple predecessors (some might not exist if their branch didn't run).

## Loops (While/Until)

If you need to repeat steps, Mastra supports loop constructs:
- `.while(condition).step(stepX)` repeats stepX while condition holds ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Suspend%20and%20Resume)).
- `.until(condition)` similar but runs until condition is true.

For example, to loop a step until it returns a certain result:
```ts
myWorkflow.step(stepCheck).while(ctx => ctx.steps.stepCheck.output.needsRetry).step(stepCheck);
```
This is a simplified idea: `stepCheck` might set `needsRetry` in its output, and the loop will repeat it until `needsRetry` is false. Careful with loops to ensure termination.

## Error Handling (after Error)

Control flow can branch not only on custom conditions but also on step success/failure. `.after("error", stepX)` means execute stepX if the previous step failed. Similarly, `.after("success", stepY)` ensures stepY only runs if previous succeeded (this is default behavior of `.then`, effectively).

Using these, you can create try/catch-like flows:
```ts
myWorkflow.step(stepMain)
  .after("error", stepOnError)
  .after("success", stepOnSuccess)
  .commit();
```

If `stepMain` throws or returns an error, `stepOnError` executes; if it succeeds, `stepOnSuccess` executes.

## Example: Branching Path

Imagine a workflow that asks a question to an agent and then either follows up or ends based on the answer:
- Step1: Agent generates an answer.
- If answer is incomplete, Step2: Agent clarifies or retries.
- If answer is good, end workflow.

This could be implemented with a condition evaluating the answer quality:
```ts
workflow
  .step(generateAnswer)
  .after(ctx => ctx.steps.generateAnswer.output.complete === false, clarifyAnswer)
  .commit();
```
In this, `clarifyAnswer` runs only if `generateAnswer` output indicated incomplete answer.

## Summary

Mastra’s workflow control flow features let you construct complex logic flows similar to a flowchart:
- Sequence (`.then`)
- Parallel (perhaps via `.step(...).then(step1, step2)` or an option)
- Branching (`.after(condition, step)` or `.if/else`)
- Loops (`.while`/`.until`)
- Error-specific branches (`.after("error", ...)`)

All these help to ensure the workflow covers different scenarios explicitly, rather than leaving it purely to the AI’s discretion. For precise syntax and more examples, refer to the official docs or **Reference** pages like `Workflow.if()` and `Workflow.else()`.
```

**Workflows-Variables.md**  
```markdown
# Workflow Variables

Workflow variables are a mechanism to pass data between steps that isn’t strictly part of a single step’s output. They allow you to set and get shared values accessible in the workflow context ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Workflow%20Variables)).

For example, suppose you want to store an intermediate value that multiple later steps need, or you want to map an output of one step to a differently named input for another. Variables provide that flexibility.

## Setting Variables

During workflow execution, you can set variables in the context. One way is via a step’s output or a special step type. However, Mastra likely provides a method to define variables when linking steps.

Some patterns:
- Use a special step to produce a variable (e.g., a step that just outputs a value that is then treated as a workflow variable).
- Or assign part of a step’s output to a variable name when linking.

Hypothetical example:
```ts
myWorkflow
  .step(stepGetData)
  .then(stepProcess, { mapInput: ctx => ({ data: ctx.steps.stepGetData.output }) })
  .commit();
```
In this pseudo-syntax, `mapInput` could be used to map the previous output to the next step’s input. Alternatively, one could do:
```ts
myWorkflow.setVariable("data", ctx => ctx.steps.stepGetData.output);
```
which would store stepGetData’s output in a variable named "data", accessible via `context.variables.data` in subsequent steps.

## Using Variables in Steps

Within a step’s execute, you can access `context.variables`. For example, if a previous step or a mapping stored `context.variables.userId = 123`, a later step can read that.

Consider:
- Step1 retrieves a user profile and you store the user’s id in a variable.
- Step2 might not directly follow Step1 (maybe it’s in a different branch), but it can still access `context.variables.userId`.

**Note:** The trigger data of the workflow could also be considered an implicit variable for the whole run (accessible as `context.triggerData`). Use variables for anything that gets computed along the way and needs to be referenced globally in the workflow.

## Example

Imagine a workflow where:
- Step A fetches some data (no direct output needed by next step, but later step needs it).
- Step B makes a decision that doesn’t need Step A’s data.
- Step C uses data from Step A.

We can do:
```ts
// After Step A executes:
myWorkflow.setVariable("fetchedData", ctx => ctx.steps.stepA.output.data);
// Now Step C can use context.variables.fetchedData
```
This way, Step C’s execute can do:
```ts
const data = context.variables.fetchedData;
```
even if Step B happened in between and didn’t use that data.

## Passing Data Between Non-Adjacent Steps

Without variables, you typically pass data by chaining outputs to inputs through adjacent steps. But if Step C is not directly after Step A, variables or a global context is needed. Variables fill that role elegantly by decoupling data storage from step ordering.

## Best Practices

- Use variables sparingly. If data naturally flows from one step to the next, just use step outputs and inputs.
- Use descriptive variable names to avoid confusion.
- Clean up or overwrite variables if they won’t be used later to avoid carrying large data unnecessarily (though in practice, it’s fine as the scope is just one workflow run).
- Understand that variables are per-run and not shared between separate runs of the workflow.

Workflow variables provide a powerful way to handle complex data flow in your LLM applications, ensuring each step has access to the information it needs.
```

**Workflows-SuspendResume.md**  
```markdown
# Workflow Suspension and Resumption

Mastra Workflows support **suspend & resume** functionality for cases where a workflow must wait for external input or a long asynchronous event before continuing ([Handling Complex LLM Operations | Workflows | Mastra](https://mastra.ai/docs/workflows/00-overview#:~:text=Suspend%20and%20Resume)). This is crucial for workflows that involve a human-in-the-loop or external triggers.

## Suspending a Workflow

A workflow can be suspended at a specific step. Typically, you’d design a step to call `context.suspend()` or simply not complete until an event is received. In practice, Mastra likely provides a way to mark a step as suspendable. For example, you might have:

```ts
const waitForUser = new Step({
  id: "waitForUser",
  execute: async () => {
    return new Promise(() => {}); // never resolves, placeholder
  }
});
```

This step would never resolve on its own (thus suspending the run). However, Mastra’s engine likely detects this and formally marks the workflow as suspended, or you would explicitly call something like `Workflow.suspend()`.

A more structured approach might be:
- The workflow is started and when it hits the suspend step, Mastra returns control to you with a runId and a status "suspended".
- The step may output a token or ID indicating what input is expected next.

## Resuming a Workflow

To resume, Mastra exposes an API endpoint or method to feed the awaited input and continue the run. For example, if the workflow is waiting for user input or an event, you’d call:

```
POST /api/workflows/<workflowName>/<runId>/event
```
with some data, which corresponds to resuming the suspended step ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,agents%20and%20workflows%2C%20such%20as)) ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,%60POST%20%2Fapi%2Fworkflows%2F%3AworkflowId%2F%3AinstanceId%2Fevent)).

In code, if using the client SDK:
```ts
myWorkflow.resume(runId, eventData);
```
(This is conceptual; actual API may differ.)

On resume, Mastra will take the provided event data, supply it to the suspended step or the workflow context, and continue executing subsequent steps.

## Example Scenario

Imagine a hiring workflow:
1. Step1: LLM creates a draft email.
2. Step2: Workflow suspends, waiting for a human manager to approve or edit the email.
3. Once approved, the manager triggers resume with their edits.
4. Step3: Workflow sends the email.

In this case:
- Step2 would be a suspend point. Perhaps it outputs a draft and then calls `context.suspend()` (or simply does not call `return`).
- The system shows the draft to the manager (maybe via the UI, using the output from Step1).
- Manager approves and clicks a button which triggers an API call to resume the workflow with, say, `{"approvedDraft": "final text"}`.
- The resume API calls unlock Step2, providing the `"approvedDraft"` as input to Step3.
- Step3 proceeds to send the email using that approved draft.

Mastra’s documentation likely covers the exact mechanism (like storing state to restart). Under the hood, the workflow state (all completed steps and their outputs) is stored in a durable store (since process may wait minutes or hours).

## Implementation Details

- **State Persistence**: For suspend/resume to work reliably, you should configure a persistent storage (not just in-memory) for workflows, so that if the server restarts, it can resume. Mastra probably uses the same storage configured for memory or a separate store to save workflow runs.
- **Events**: The resume often called “sending an event” to the workflow. The event is the external data or trigger that unblocks the pause.
- **Timeouts**: You may implement timeouts — if a workflow stays suspended too long, maybe auto-cancel or notify someone.
- **Security**: When exposing resume endpoints, ensure that only authorized sources can trigger them (e.g., require an API key or tie runId to a user session in your app logic).

## API Endpoints

In the dev server, endpoints for workflow control include:
- `POST /api/workflows/<workflowId>/start` – to start a new run (or `/execute` as we used earlier, which implicitly starts).
- `POST /api/workflows/<workflowId>/<runId>/event` – to post an event to a running (likely suspended) workflow ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,agents%20and%20workflows%2C%20such%20as)) ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,%60POST%20%2Fapi%2Fworkflows%2F%3AworkflowId%2F%3AinstanceId%2Fevent)).
- `GET /api/workflows/<workflowId>/<runId>/status` – to check if it’s running, suspended, completed, etc. ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,%60GET%20%2Fapi%2Fworkflows%2F%3AworkflowId%2F%3AinstanceId%2Fstatus)).

Check Mastra’s OpenAPI spec (accessible at `/openapi.json` when running `mastra dev`) for the exact paths.

By using suspend/resume, you enable **long-running processes** with human or external decision points to be handled cleanly by Mastra Workflows. This pattern is powerful for enterprise automation scenarios.
```

**RAG-Overview.md**  
```markdown
# Retrieval-Augmented Generation (RAG) Overview

Retrieval-Augmented Generation (RAG) is a technique to enhance LLM responses with relevant information fetched from an external knowledge source (your documents, databases, etc.) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=RAG%20%28Retrieval)). Mastra provides standardized APIs to implement RAG workflows: chunking documents, embedding them into a vector store, and retrieving them for queries ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Mastra%E2%80%99s%20RAG%20system%20provides%3A)) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=,tracking%20embedding%20and%20retrieval%20performance)).

In Mastra, RAG involves these steps:
1. **Document Processing (Chunking)** – Breaking documents into smaller pieces.
2. **Embedding** – Converting those chunks into vector embeddings.
3. **Vector Storage** – Storing embeddings in a vector database.
4. **Retrieval** – Given a user query, embedding the query and finding similar chunks.
5. **Augmentation** – Supplying retrieved text chunks to the LLM as context for generation.

Mastra supports multiple document types and vector stores, making RAG implementation consistent across different backends ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Mastra%E2%80%99s%20RAG%20system%20provides%3A)).

## Example Pipeline

Below is a simplified example of using Mastra’s RAG API to process a document and perform a query:

```ts
import { embedMany } from "ai";                   // from Vercel AI SDK
import { openai } from "@ai-sdk/openai";
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import { z } from "zod";

// 1. Initialize a document from text
const doc = MDocument.fromText("Your document text here...");

// 2. Chunk the document
const chunks = await doc.chunk({
  strategy: "recursive",  // or "sliding" etc.
  size: 512,
  overlap: 50,
});

// 3. Generate embeddings for chunks
const { embeddings } = await embedMany({
  values: chunks,
  model: openai.embedding("text-embedding-3-small"),
});

// 4. Store embeddings in a vector database
const pgVector = new PgVector(process.env.POSTGRES_CONNECTION_STRING);
await pgVector.upsert({
  indexName: "embeddings",
  vectors: embeddings,
});  // indexName is like a collection name

// 5. Query similar chunks for a new query vector
const queryVector = /* embed the query "..." using same model */;
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: queryVector,
  topK: 3,
});
console.log("Similar chunks:", results);
``` 

This pipeline shows:
- Using `MDocument.fromText` to create a document object.
- `doc.chunk(...)` to break it into `chunks` (each chunk perhaps 512 characters with 50 char overlap) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%201,Your%20document%20text%20here)) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%202,size%3A%20512%2C%20overlap%3A%2050%2C)).
- `embedMany` to get embeddings for all chunks using an OpenAI embedding model ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%203,small%22%29%2C)).
- Initializing a `PgVector` (Postgres vector store, here using pgvector via `@mastra/pg`) and upserting the embeddings ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=)).
- Querying the store with a query vector to get the top 3 similar chunks ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%205,the%20embedding%20of%20the%20query)).

This example uses PostgreSQL with pgvector extension; Mastra also supports Pinecone, Qdrant, and others similarly ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Vector%20Storage)).

## Document Processing

Mastra’s `MDocument` class and related functions handle different document formats:
- Text documents can be split by paragraphs, sentences, tokens, etc.
- HTML/Markdown may be parsed and chunked appropriately.
- JSON could be chunked by fields.

Chunking strategies:
- **Recursive**: Recursively split by sections (good for structured text).
- **Sliding Window**: Fixed-size overlapping windows (ensures every part gets in a chunk, often used to maximize context use).
- Possibly others like by semantic boundaries.

You can also enrich chunks with metadata (e.g., source filename, section titles) to assist in later filtering or identify where an answer came from ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Document%20Processing)).

For more details on chunking and embedding strategies, see **RAG-ChunkingEmbedding.md**.

## Vector Storage

Mastra abstracts vector databases so you can switch between:
- **Postgres (pgvector)** – as shown above, storing vectors in a Postgres table.
- **Pinecone** – a managed vector DB.
- **Qdrant** – an open-source vector DB.
- **Memory vector store** – perhaps an in-memory or local one for quick testing.

Each has its own class (e.g., `PgVector`, `PineconeVector`, etc.) and usage but all implement a common interface with methods like `upsert` and `query` ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=)) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%205,the%20embedding%20of%20the%20query)).

The `indexName` (or similar concept) is used to namespace vectors (like a collection). Ensure consistent use of the same embedding model for both indexing and querying.

See **RAG-VectorDatabases.md** for specifics on each supported store.

## Retrieval and Augmentation

To use retrieved chunks in generation:
- Take the `results` from the vector query (which likely include the stored chunk text or an id you can map back to text).
- Construct a prompt for the LLM that includes these chunks. For example: *"Using the following documents, answer the question... [doc snippets]"*.
- Use `agent.generate()` or workflow steps to have the LLM produce the final answer.

Mastra might provide higher-level utilities to do this in one go (like a RAG tool that encapsulates query + generation). The **createGraphRAGTool** or **createVectorQueryTool** in references suggests some built-in tools for RAG ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=,MCPConfiguration)).

## Observability and Debugging

RAG can be tricky – you want to know if relevant info was retrieved. Mastra includes observability features:
- Logging of embedding operations (maybe how many tokens, time taken).
- Logging of retrieved chunk IDs and similarity scores.
- Optionally caching results for repeated queries.

These help you tune chunk sizes or decide if your vector search is returning good hits ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Observability%20and%20Debugging)) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Mastra%E2%80%99s%20RAG%20system%20includes%20observability,you%20optimize%20your%20retrieval%20pipeline)). For instance, if you see low similarity scores or irrelevant chunks, you might need a different embedding model or better preprocessing.

Mastra encourages monitoring embedding generation performance and retrieval relevance ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Observability%20and%20Debugging)). You can integrate with tools like OpenTelemetry (OTel) for tracking these metrics (Mastra has an OTel config for logging events of chunking/queries) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=,metrics%20to%20your%20observability%20platform)).

## More Resources

Mastra’s documentation and examples include:
- Chain-of-Thought RAG example (perhaps showing an agent reasoning step-by-step with retrieved info) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=More%20resources)).
- Various example projects demonstrating chunking strategies and using different vector stores ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=More%20resources)).

By leveraging RAG with Mastra, your agents can provide up-to-date, specific answers drawn from your private data, rather than relying solely on the static training data of the base model. This is critical for applications like documentation Q&A, knowledge base assistants, or any domain-specific expert system.
```

**RAG-ChunkingEmbedding.md**  
```markdown
# Document Chunking and Embedding (RAG)

This section dives deeper into how Mastra handles **chunking** documents and generating **embeddings** for RAG.

## Chunking Strategies

Mastra supports multiple chunking strategies to break documents into pieces suitable for LLM context ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Document%20Processing)):
- **Recursive Chunking**: Splits the text recursively by sections (like chapters -> paragraphs -> sentences) until chunks of a target size are obtained. This preserves coherence within chunks.
- **Sliding Window**: Uses a fixed window size (in characters or tokens) and slides with overlap. Ensures coverage of all text, with overlaps to capture context that falls on chunk boundaries.
- **By Delimiter**: Possibly chunk by headings, bullet points, or JSON keys depending on content type.

When calling `doc.chunk({ strategy, size, overlap })`, choose:
- `strategy`: e.g., `"recursive"` (common default) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%202,size%3A%20512%2C%20overlap%3A%2050%2C)).
- `size`: target chunk size (characters or tokens, check docs) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%202,size%3A%20512%2C%20overlap%3A%2050%2C)).
- `overlap`: how much overlap between chunks (for sliding strategy) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%202,size%3A%20512%2C%20overlap%3A%2050%2C)).

If your document is small, one chunk might be the whole thing. If it’s large (long article, book), chunks allow partial retrieval.

**Tip**: Aim for chunk size that fits well under your model’s context window (e.g., if model can handle 4k tokens, maybe chunks of 500-1000 tokens, retrieving a few chunks per query).

## Embedding Generation

Mastra uses the Vercel AI SDK’s embedding functions (or AI SDK integrated providers) to get vector representations ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%203,small%22%29%2C)). Key functions:
- `embedMany({ values, model })`: embed an array of texts (`values`) using the specified model (e.g., `openai.embedding("text-embedding-ada-002")`). Returns an array of embedding vectors.
- Possibly `embed(text)` for a single string.

You should use a **semantic embedding** model (like OpenAI Ada or Cohere embeddings) for meaningful similarity. Ensure the same model is used for indexing documents and for queries.

Mastra abstracts some of this; for example, Mastra might default to a small embedding model (like bge-small) if you don’t specify.

## Using Mastra Tools for RAG

Mastra provides ready-made tools to simplify RAG:
- **Document Chunker Tool**: Likely available via `createDocumentChunkerTool()` ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=)). This could automatically chunk input text.
- **Vector Store Tools**: e.g., `createVectorQueryTool()` to query a vector store ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=)), or `createGraphRAGTool()` to combine chunking, embedding, and retrieval.

If you use these tools, an agent could call them as needed instead of you writing all logic manually. For example, an agent question could trigger a RAG tool that returns relevant text, which the agent then uses to answer.

Check Mastra’s reference for these tool creation functions:
- `createDocumentChunkerTool(options)` – likely returns a tool that takes a document and outputs chunks.
- `createVectorQueryTool(options)` – returns a tool to query a configured vector DB with a query string.

## Managing Metadata

When chunking, it’s often useful to attach metadata (like document title, source, section) to each chunk. Mastra’s MDocument might support metadata that carries through to embedding and can be stored in vector DB (if the DB supports metadata filtering).

For example:
```ts
const doc = MDocument.fromText(text, { metadata: { source: "FAQ", id: "doc1" } });
const chunks = await doc.chunk({ strategy: "recursive", size: 300 });
chunks[0].metadata  // might include source, id, and maybe positional info.
```

When storing, some vector DBs allow storing metadata alongside vectors (Pinecone, for instance). You could use that to filter results (e.g., only retrieve from certain source).

## Putting it Together

A typical RAG setup sequence:
- Preprocessing (offline or at startup):
  - Load documents.
  - Chunk them with appropriate strategy.
  - Embed each chunk.
  - Store vectors in DB with any needed metadata.
- At query time:
  - Embed the user’s query.
  - Query vector DB for similar chunks.
  - Take top K chunks’ text.
  - Provide them to the LLM (via agent prompt or workflow step) to generate final answer.

Mastra helps with each step but also lets you plug in custom logic if needed (for example, if you want to combine keyword search with vector search, you could).

By carefully chunking and embedding your documents, you ensure that the retrieval step brings back the most relevant pieces of information for a given question, which the LLM can then use to produce accurate, grounded responses.
```

**RAG-VectorDatabases.md**  
```markdown
# Vector Databases in Mastra

Mastra supports multiple vector database options to store and search embeddings ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=Vector%20Storage)). The choice of vector DB can depend on your scale, performance needs, and infrastructure. Supported options include:

- **Postgres (pgvector)**: Using the `@mastra/pg` package, Mastra can store embeddings in a Postgres table with the pgvector extension ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=)). This is convenient if you already use Postgres; it supports similarity search via indexed vectors. In code, use `new PgVector(connectionString)` to create a client.
- **Pinecone**: A managed cloud vector database. Likely Mastra provides a Pinecone client integration (perhaps via `@mastra/pinecone` or similar). Pinecone excels at large scale and easy setup, but is a hosted service.
- **Qdrant**: An open-source vector DB (with a cloud offering as well). Mastra might have an integration for Qdrant to use it similarly.
- **Memory (in-memory)**: Possibly for testing, an in-memory store could be used (this wouldn't persist data, but for small experiments it’s fast).

Each integration will typically offer similar methods:
- `upsert({ indexName, vectors })`: to insert or update vectors (and maybe their payloads/metadata).
- `query({ indexName, queryVector, topK })`: to retrieve the closest vectors.

### Postgres (pgvector) Setup

If using Postgres:
1. Install the `@mastra/pg` package.
2. Ensure your Postgres has the pgvector extension installed (`CREATE EXTENSION vector;`).
3. Provide a connection string to `PgVector`. By default, it might create a table for each indexName or a single table with an index column.
4. Use `upsert` to add vectors. For pgvector, indexName might correspond to a table or a namespace in a table.
5. Query as shown in the RAG overview example.

**Example**:
```ts
const pgVector = new PgVector("postgres://user:pass@host:port/db");
await pgVector.upsert({ indexName: "embeddings", vectors: embeddings });
const results = await pgVector.query({ indexName: "embeddings", queryVector, topK: 5 });
```

### Pinecone Integration

For Pinecone:
- You’d have an API key and environment for your Pinecone project.
- The Mastra integration might look like:
```ts
import { PineconeVector } from "@mastra/pinecone";
const pine = new PineconeVector({ apiKey: "XYZ", environment: "us-west1" });
await pine.upsert({ indexName: "my-index", vectors });
const results = await pine.query({ indexName: "my-index", queryVector, topK: 5 });
```
- Ensure the index is created in Pinecone’s console (with appropriate dimension matching your embeddings length).

Pinecone handles indexing and similarity search efficiently as a service.

### Qdrant Integration

For Qdrant (self-hosted or cloud):
- Possibly `@mastra/qdrant` package.
- Usage might be similar to Pinecone, with a Qdrant URL and API key if cloud.
- Qdrant supports filtering by metadata too, which could be leveraged if Mastra exposes it.

### Other Stores

Mastra’s architecture might allow adding other vector stores. For instance, if using Weaviate or ElasticSearch, you could integrate via tools or by writing custom queries.

The provided default integrations cover common choices. Check Mastra’s docs or code for classes like `PineconeStore`, `QdrantStore`, etc., analogous to `LibSQLStore`, `PostgresStore` shown in memory docs ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=LibSQL%20Storage)) ([Using Agent Memory | Agents | Mastra Docs](https://mastra.ai/docs/agents/01-agent-memory#:~:text=PostgreSQL%20Storage)).

### Choosing a Store

- Use **Postgres/pgvector** if you want simplicity and your dataset is moderate (thousands to low millions of vectors) and you prefer not to run a separate vector DB.
- Use **Pinecone** for large scale or if you want a fully managed solution without managing your own DB.
- Use **Qdrant** if you prefer open-source and possibly need to run on-prem or at the edge.
- If just prototyping, an in-memory or file-based solution might be enough (though Mastra doesn’t explicitly mention a file-based vector store, one could serialize vectors to disk manually if needed).

### Index Names and Multiple Datasets

The `indexName` parameter lets you maintain multiple collections of embeddings (e.g., one for documentation, one for user emails, etc.) in the same vector store. Make sure to use consistent index names between upsert and query.

For Postgres, `indexName` could correspond to different tables or a column value; for Pinecone/Qdrant, it corresponds to actual index/collection names.

### Metadata and Filtering

If your vector store and Mastra integration support metadata:
- When upserting, you might provide metadata per vector (like `{id: ..., values: [...], metadata: {...}}`).
- Query could then include a filter, e.g., `filter: { docType: "FAQ" }` to only retrieve vectors from FAQ documents.

This is advanced usage; refer to the store’s integration docs (e.g., Pinecone’s filter syntax or Qdrant’s payload filtering) and Mastra’s capabilities.

In summary, Mastra’s vector DB integrations abstract away the differences so you can easily plug one in and use the same Mastra RAG API. Decide based on your project’s requirements which backend is most suitable.
```

**RAG-Retrieval.md**  
```markdown
# Retrieval in RAG

The retrieval step is where we take a user’s query or context and fetch relevant stored information (chunks) to augment the generation.

## Query Embedding

To retrieve, first embed the query using the **same embedding model** used for the document chunks. For example:

```ts
const query = "What does the document say about pricing?";
const queryEmbedding = await embedMany({
  values: [query],
  model: openai.embedding("text-embedding-3-small"),
});
```

This yields a vector (`queryEmbedding[0]`) representing the query in the semantic space ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%203,small%22%29%2C)) ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%205,the%20embedding%20of%20the%20query)).

If using the Mastra RAG tool flow, this might be handled for you – e.g., a `queryVector` might be generated internally by `createVectorQueryTool` given a query string.

## Similarity Search

Using the vector DB client (PgVector, Pinecone, etc.), perform a similarity search:

```ts
const results = await pgVector.query({
  indexName: "embeddings",
  queryVector: queryEmbedding[0],
  topK: 3
});
```

`topK` is how many similar chunks to retrieve ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=%2F%2F%205,the%20embedding%20of%20the%20query)). You might adjust this based on how much context you want to feed the LLM (common values are 3-5).

The `results` typically include:
- The IDs or references of the matching chunks.
- Possibly the chunk text itself (depending on the integration; some return only IDs and you must fetch the text via an ID->text mapping you stored).
- Similarity scores (how close the match is).

If `results` only have references, you’ll need to map those to the actual chunk content. Make sure when inserting you kept track of which chunk corresponds to which ID.

## Using Retrieved Chunks

Once you have the relevant chunks:
- Concatenate or summarize them if needed.
- Construct the prompt for the LLM.

**Direct inclusion**: You might do something like:
```ts
const contextText = results.map(r => r.text).join("\n---\n");
const prompt = `You are an assistant with access to documents. 
Here are some relevant excerpts:
${contextText}

Question: ${userQuestion}
Answer:`;
const answer = await agent.generate(prompt);
```
This inlines the text. Ensure the combined length is within model limits.

**As context in structured way**: If using an agent with tools, you might instead feed the chunks as part of memory or a special system message.

Mastra’s RAG examples might show providing the retrieved text in the agent’s context (for example, using an in-context instruction "You have the following information from documents: ...").

If using a workflow, one step could fetch chunks and the next step could be an LLM call that gets those chunks via `context`.

## Ranking or Filtering Results

Sometimes you might get chunks that are somewhat relevant but not exactly. You can refine:
- Increase `topK` and then apply a second layer of filtering (maybe via a keyword match or asking an LLM to pick which chunks are truly relevant).
- Use metadata filters in the query if you only want certain sources.

Mastra’s straightforward approach is just similarity, but you have the flexibility to add logic if needed.

## Example Integration in Agent

Mastra could allow an agent to do RAG by calling a tool that returns a piece of text, which the agent then incorporates in its answer. For example:
- Agent gets user question.
- Agent calls `vectorSearchTool` with that question (as if it were a function call).
- Tool returns a snippet of document text.
- Agent then continues answering using that snippet.

This requires a prompt style or model that can handle multi-turn reasoning (like OpenAI GPT-4 with function calling or chain-of-thought prompting).

If not using that, the simpler method is the workflow or manual prompt assembly as described.

## Ensuring Correctness

Remember that retrieved text may need slight preprocessing:
- If chunks cut off mid-sentence, maybe include an indicator (like "..." or try to chunk by sentence boundaries).
- If multiple chunks come from different parts, the assistant should not assume they are from one continuous source if they’re not.

It's often helpful to include citations or source info in the final answer for user clarity, but for code generation we focus on providing the text.

## Putting RAG into Production

After validating that retrieval finds relevant info and the LLM uses it correctly:
- Keep your vector index updated if documents change (you might re-run chunk & embed on updates).
- Monitor cases where the LLM responds with "I don't know" or hallucinations; perhaps the retrieval didn't find what was needed (you might need to ingest more data or tune chunk sizes).
- Use evals (like a hallucination metric) to catch if the agent’s answer includes unsupported info.

RAG, when configured properly in Mastra, significantly boosts an agent’s ability to give factual, up-to-date answers grounded in your private data ([RAG (Retrieval-Augmented Generation) in Mastra | Mastra Docs](https://mastra.ai/docs/rag/overview#:~:text=RAG%20in%20Mastra%20helps%20you,and%20grounding%20responses%20in%20real)). It requires extra setup (the whole pipeline above), but Mastra’s abstractions make it manageable to implement.
```

**Local-Dev.md**  
```markdown
# Local Development

Mastra provides tools to streamline local development of your AI application. The key components are the **Mastra CLI** for project setup and a **development server** (`mastra dev`) that includes a UI and APIs for interactive debugging.

## Creating Projects (CLI)

To start a new project or add Mastra to an existing one, use the Mastra CLI:
- **`npm create mastra`** (or `mastra init`) for new projects: This interactive command scaffolds the project structure (as described in Installation) ([Creating Mastra Projects | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/creating-projects#:~:text=Creating%20a%20New%20Project)). You can also provide flags to automate the setup.
- **`mastra init` in existing project**: Adds a `src/mastra` directory, config files, and optional components to your current project, without overwriting other files ([Creating Mastra Projects | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/creating-projects#:~:text=Adding%20to%20an%20Existing%20Project)). It’s useful if you want to integrate Mastra into an app you already have (e.g., a Next.js app).

The CLI also offers flags (listed under **Command Arguments**):
- `--components <list>`: choose components to include (agents, memory, storage, etc.) ([Creating Mastra Projects | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/creating-projects#:~:text=Command%20Arguments)).
- Running `mastra init` with no arguments will launch the interactive prompt (choose directory, components, provider, etc.) ([Local Project Structure | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/project-structure#:~:text=Using%20the%20CLI)) ([Creating Mastra Projects | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/creating-projects#:~:text=Interactive%20Setup)).

After initialization, run `npm install` to install dependencies, then you can directly start development ([Creating Mastra Projects | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/creating-projects#:~:text=Project%20Initialization)).

## Mastra Dev Server

Running `mastra dev` starts a local development server that serves your Mastra app on a port (default 4111) ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=Inspecting%20agents%20and%20workflows%20with,mastra%20Dev)) ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=Inspecting%20agents%20and%20workflows%20with,mastra%20Dev)). This server provides multiple features:

### REST API Endpoints

All registered agents and workflows are exposed as RESTful endpoints:
- `POST /api/agents/:agentId/generate` – Generate a response from agent `agentId` ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=REST%20API%20Endpoints)).
- `POST /api/agents/:agentId/stream` – Stream a response (for agents’ streaming).
- `POST /api/workflows/:workflowId/execute` – Start a workflow execution.
- `POST /api/workflows/:workflowId/:instanceId/event` – Send an event to a suspended workflow ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,agents%20and%20workflows%2C%20such%20as)).
- `GET /api/workflows/:workflowId/:instanceId/status` – Get status of a workflow run ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=,agents%20and%20workflows%2C%20such%20as)).

By default the server runs at `http://localhost:4111` ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=)). You can change the port with the `--port` flag (e.g., `mastra dev --port 3000` to use 3000).

These endpoints allow you to integrate or test agents using tools like curl or Postman easily.

### UI Playground

When `mastra dev` is running, it also serves a web UI (playground) at the same address:
- **Agent Chat Interface**: A simple chat UI to talk to each agent. You can select an agent and exchange messages, which is very useful for testing prompts, seeing how memory and tools are used, etc. ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=UI%20Playground)).
- **Workflow Visualizer**: A UI that shows your workflow graph, steps, and their statuses as you execute them (so you can trace the execution flow).
- **Tool Playground**: Possibly an interface to test tools individually (sending inputs to a tool and seeing outputs).

Using the playground, you can iterate quickly: tweak an agent’s instructions or a workflow step in your code, refresh the UI, and test again.

### OpenAPI Specification

Mastra dev server provides an OpenAPI (Swagger) spec at `GET /openapi.json` ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=and%20a%20tool%20playground)). This is useful for:
- Viewing all available endpoints and their schemas.
- Generating API clients if needed.
- Understanding the expected request/response formats for each route.

You could load this JSON in Swagger UI to visualize or share the API spec for your Mastra app.

### Live Reload

If you edit your agent/tool/workflow code, the dev server will typically auto-reload to pick up changes (the scaffold uses `tsx watch` or similar under the hood). Check the console output in your terminal running `mastra dev` to see if it restarts on file changes.

### Logging and State Inspection

While running, the server logs actions:
- Agent calls (and any tool function calls invoked).
- Workflow step transitions.
- Errors or exceptions in tools/steps.

Additionally, the playground UI may show agent state (like memory contents or last tool used). This helps debug what the AI is “thinking” or why it produced a certain output.

## Using the Client SDK

For programmatic interactions, Mastra offers a JavaScript client SDK (`@mastra/client-js`) to connect to the dev server ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=The%20easiest%20way%20to%20interact,Install%20it%20with)). 

Install it in your front-end or integration environment:
```sh
npm install @mastra/client-js
``` 

Then use it as:
```ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({ baseUrl: "http://localhost:4111" });
const agent = client.getAgent("myAgent");
const response = await agent.generate({ messages: [{ role: "user", content: "Hello!" }] });
```
This calls your local agent easily, without manually constructing fetch requests ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=Then%20configure%20it%20to%20point,to%20your%20local%20server)) ([Inspecting Agents with `mastra dev` | Mastra Local Dev Docs](https://mastra.ai/docs/local-dev/mastra-dev#:~:text=import%20,js)). The client SDK provides methods corresponding to the API (e.g., `getWorkflow`, `agent.generate()`, `agent.stream()`, etc.), and handles details like URL construction.

## Integration with Frameworks

While developing locally, you might also integrate with a web framework. For instance, if building a Next.js app, you could:
- Run `mastra dev` alongside `next dev`.
- Use the client SDK in your Next.js frontend to query the local Mastra server.
There’s also a guide for Next.js integration (see **Frameworks: Next.js** docs) which shows how to embed Mastra directly into a Next.js API route or as middleware.

But for most cases, keeping Mastra dev server separate during development is fine.

## Summary

Mastra’s local development tools (CLI, dev server with UI, client SDK) make it convenient to build and test your LLM application:
- Scaffold the project, 
- Code your agents/tools/workflows,
- Run `mastra dev` and interact in real-time,
- Iterate quickly based on agent responses and logs.

Use these resources to refine prompts, fix bugs in tools, and ensure your workflows and agents behave as expected before deploying.
```

**LocalDev-Integrations.md**  
```markdown
# Using Mastra Integrations

Mastra **Integrations** are pre-built, type-safe API clients for external services that you can plug into agents or workflows ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=Using%20Mastra%20Integrations)). Essentially, an integration wraps a third-party API (like GitHub, Stripe, etc.) and exposes it as a Mastra tool or client that your agent can call.

Integrations save you from writing boilerplate API calls and ensure consistent types for inputs/outputs.

## Installing an Integration

Each integration is an npm package (prefixed with `@mastra/`). For example, to use the GitHub integration:

```sh
npm install @mastra/github
``` 

This provides a `GithubIntegration` class within the package ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=Installing%20an%20Integration)) ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=To%20install%20the%20GitHub%20integration%2C,run)).

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

This creates a `github` integration client with your GitHub Personal Access Token (PAT) from environment variables ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=src%2Fmastra%2Fintegrations%2Findex)). Ensure you have the PAT in your `.env` (e.g., `GITHUB_PAT=ghp_abc123`).

Mastra’s integration classes often require a config object with API keys or tokens.

## Using Integrations in Tools

Once you have an integration client, you typically **use it inside a tool’s execute function** to perform actions. For example, using the `github` integration above to get the main branch reference of a repository:

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

In this tool ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=import%20,from%20%27..%2Fintegrations)) ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=%7D%29%2C%20outputSchema%3A%20z.object%28,getApiClient)):
- We get a live API client via `github.getApiClient()` (often integrations use this to handle auth and rate limits behind the scenes).
- We call `client.gitGetRef` (one of the GitHub API endpoints provided by the integration) with the required parameters (owner, repo, ref) ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=execute%3A%20async%20%28,getApiClient)).
- We return the reference string.

Mastra integration clients are usually generated from the service’s OpenAPI spec, providing methods for each endpoint (in this case, `gitGetRef` corresponds to GitHub’s Git References API). The input is structured (with sub-objects like `path`, `query`, etc., matching API needs) and the output is typed.

By defining this tool, you allow your agent or workflow to retrieve data from GitHub easily.

## Adding Integration Tools to Agents

To enable an agent to use the new tool, include it in the agent’s tools:

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

Now `codeReviewAgent` can call the `getMainBranchRef` tool during its reasoning ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=src%2Fmastra%2Fagents%2Findex)) ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=model%3A%20openai%28%27gpt,)). For example, if asked *"Does the repository owner/repo have a main branch?"*, the agent might invoke this tool to fetch the ref.

## Environment Configuration

Make sure to set any required environment variables for integrations:
- For GitHub: `GITHUB_PAT` (Personal Access Token) as shown ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=Environment%20Configuration)).
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

To see all integrations, check Mastra’s GitHub or npm organization ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=Mastra%20provides%20several%20built,Stripe%2C%20Resend%2C%20Firecrawl%2C%20and%20more)) ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=Check%20Mastra%E2%80%99s%20codebase%20or%20npm,full%20list%20of%20available%20integrations)). You can search npm for `@mastra/*` packages.

## Conclusion

Integrations extend your agents’ reach beyond the LLM:
- They enable agents to fetch real-time or proprietary data (like pulling info from GitHub, querying a database, etc.).
- They come with type definitions to minimize errors.
- They can be used in both agent tools and workflow steps.

By installing and configuring an integration, writing a small wrapper tool, and adding it to an agent, you empower that agent to interact with the outside world reliably ([Using Mastra Integrations | Mastra Local Development Docs](https://mastra.ai/docs/local-dev/integrations#:~:text=Conclusion)). Always refer to each integration’s documentation (or source) for specifics on available methods and required config. With integrations, your AI agent can seamlessly operate with external APIs as part of its reasoning process.
```

**Deployment.md**  
```markdown
# Deployment

Once your Mastra application is built and tested locally, you’ll want to deploy it to a server or cloud environment. Mastra supports two main approaches for deployment ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Deploying%20Mastra%20Applications)):

1. **Direct Platform Deployment (Using Deployers)** – Platform-specific deployment helpers that configure and upload your app to serverless platforms (Cloudflare Workers, Vercel, Netlify, etc.) ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Direct%20Platform%20Deployment)).
2. **Universal Deployment (Self-Hosted Node.js)** – Build your Mastra app into a Node.js server and run it on any environment that supports Node (could be a VM, Docker container, AWS Lambda, etc.) ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Universal%20Deployment)).

Before deploying, ensure you have all environment variables (API keys, etc.) set in the production environment.

## Prerequisites

- A built Mastra project (all agents, workflows defined).
- Node.js environment on the target (if using Node server approach).
- For platform deployers: an account on that platform and any CLI/API keys needed ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Prerequisites)).

## Direct Platform Deployment

Mastra provides **deployer packages** for certain platforms that simplify deployment configuration ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Platform,deployment%20for)):
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

 ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Installing%20Deployers)) ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=,vercel))

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

For Cloudflare, you might provide an account ID (`scope`) ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=)); for Vercel, maybe a teamId; for Netlify, a team slug or auth token ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=match%20at%20L296%20,Deployer)). Check each deployer’s docs:
- CloudflareDeployer expects a `scope` (account) and will infer other settings (likely uses Cloudflare’s Wrangler under the hood).
- VercelDeployer might take a `teamId` ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=)).
- NetlifyDeployer might take a `scope` or use environment variables (like Netlify auth token) ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=)).

**Running Deployment**: Mastra’s CLI has `mastra deploy` command ([Installing Mastra Locally | Getting Started | Mastra Docs](https://mastra.ai/docs/getting-started/installation#:~:text=)). After configuring, run:

```sh
mastra deploy
``` 

This will use the configured deployer to bundle and push the code. For example:
- Cloudflare: likely bundles to a Worker script and publishes it (you might need `wrangler.toml` or environment variables for Cloudflare auth).
- Vercel: might call Vercel’s API to deploy as a serverless function.
- Netlify: similar to Vercel.

If you need to set environment variables on the platform (API keys, etc.), do so in the platform’s dashboard or via CLI prior to deployment.

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

Each deployer’s `new ...Deployer({...})` should be adjusted according to that platform’s requirements ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Deployer%20Configuration)) ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=)). The Mastra documentation provides “basic examples” and refers to reference docs for details ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Deployer%20Configuration)).

## Universal Deployment (Node.js)

If you prefer not to use platform-specific deployers or want to deploy on your own infrastructure:
- Mastra can be built into a standard Node.js Express (or Hono, etc.) server.

The process:
1. **Build** the application:
   ```sh
   mastra build
   ``` 
   This compiles your TypeScript to JavaScript (in `dist/` folder) and prepares the server bundle ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Building)). If using the default Hono server bundler, it might output a server file.

2. **Run the Server**:
   After build, you can run:
   ```sh
   node dist/server.js
   ``` 
   or a similar command (Mastra might output the entry point name or include a script). Alternatively, use:
   ```sh
   mastra start
   ``` 
   to start the server locally in production mode ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Running%20the%20Server)).

   Ensure the environment variables (like API keys) are set in your production environment (via actual environment or a .env file in the deployed location).

3. **Deploy Node App**:
   - If using Docker, create a Dockerfile that copies your project and runs `mastra build` then `mastra start` or directly `npm run build && node dist/server.js`.
   - If using a PaaS (Heroku, Fly.io, etc.), treat it like a Node web server.
   - If using AWS Lambda or GCP Functions, you might wrap the Hono/Express app with their adapters.

Mastra’s universal build by default uses Hono (a small web framework) to serve the endpoints. The result is an HTTP server listening on some port (default 4111 or environment `$PORT`). Make sure to configure the port if required by platform (e.g., Heroku sets `PORT` env var; Hono will use that via `process.env.PORT` typically).

## Environment Variables

When deploying, especially to serverless or cloud environments, set your environment variables (like `OPENAI_API_KEY`, etc.) in those environments. The Mastra deployers and build will not automatically carry over your local `.env` – you need to configure it on the platform or in your deployment pipeline ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Environment%20Variables)).

For example:
- On Vercel, use `vc env add` commands or the dashboard to add env vars.
- On Netlify, use the UI or CLI to set env vars.
- On Cloudflare Workers, use `wrangler secret put` or `vars` in wrangler.toml for secrets.
- In Docker, you might use an `.env` or pass env on container run.

## Platform Documentation

Each platform has specifics:
- Cloudflare Workers: uses Wrangler. See Cloudflare’s docs on publishing Workers and binding KV if needed.
- Vercel: essentially detect a framework. Mastra’s Vercel deployer likely packages as a Serverless Function.
- Netlify: might create a Netlify Function or Edge Function.

Mastra’s deployers simplify a lot but you may refer to their docs (possibly linked from Mastra docs) for advanced configuration ([Deployment](https://mastra.ai/docs/deployment/deployment#:~:text=Platform%20Documentation)).

## Logging and Tracing in Deployment

In production, consider integrating Observability (see **Deployment-LoggingTracing.md**). Mastra can send logs to services like New Relic, Datadog, etc., to monitor your live agents.

## Summary

You have two deployment paths:
- Use Mastra’s built-in deployer for a quick deploy to supported serverless platforms (Cloudflare, Vercel, Netlify). This requires minimal config changes and the `mastra deploy` command.
- Or manually build and deploy as a Node app, giving you more control or ability to deploy elsewhere.

Choose what fits your workflow. For many, deploying to Vercel or Cloudflare Workers will be very convenient, turning your local prototype into a globally accessible service with a single command.
```

**Evals-Overview.md**  
```markdown
# Evals Overview

**Evals** in Mastra are automated tests or evaluations for your agents’ outputs ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=Evals%20are%20automated%20tests%20that,1)). They help quantify qualities like correctness, consistency, or toxicity of the responses. Mastra provides built-in evaluation metrics (called **metrics** or **evals**) and allows custom ones.

Each eval metric produces a score (0 to 1) where 1 is best/passing and 0 is worst/failing ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=Testing%20your%20agents%20with%20evals)). These scores can be logged to track your agent’s performance over time or used in CI to ensure changes don’t degrade responses.

## How to Use Evals

To use evals, you add them to an agent’s configuration. Mastra has default metrics you can import from `@mastra/evals`. For example, to evaluate an agent’s consistency of tone:

```ts
import { ToneConsistencyMetric } from "@mastra/evals/nlp";

export const myAgent = new Agent({
  /* ... other config ... */
  evals: {
    tone: new ToneConsistencyMetric()
  }
});
``` 

Here we added an eval metric named "tone" for the agent ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=src%2Fmastra%2Fagents%2Findex)) ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=evals%3A%20,)). The `ToneConsistencyMetric` might check if the agent’s replies maintain a consistent tone given a system instruction.

Mastra’s built-in metrics cover areas like:
- Tone consistency
- Toxicity detection
- Bias detection
- Relevance/faithfulness (if a reference text is provided)
- Factual accuracy (likely via a model judge)

After adding evals, whenever the agent generates output (in the dev environment dashboard), Mastra will compute these evals on the output. Also, these evals become available to use in tests.

You can view eval results in the Mastra dev UI (there may be a section showing scores for each message) ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=)).

## Running Evals in CI/CD

To integrate evals into automated testing (CI pipeline), you can use a test framework like **Vitest**, **Jest**, or **Mocha**. Mastra provides an `evaluate()` helper function to run a metric on a given input/output pair ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=src%2Fmastra%2Fagents%2Findex)).

Example with Vitest (similar for Jest):

```ts
import { evaluate } from "@mastra/core/eval";
import { ToneConsistencyMetric } from "@mastra/evals/nlp";
import { myAgent } from "./index";

describe('My Agent', () => {
  it('should maintain tone consistency', async () => {
    const metric = new ToneConsistencyMetric();
    const result = await evaluate(myAgent, "Hello, world!", metric);
    expect(result.score).toBe(1);
  });
});
``` 

In this test ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=describe%28%27My%20Agent%27%2C%20%28%29%20%3D,myAgent%2C%20%27Hello%2C%20world%21%27%2C%20metric)):
- We create an instance of the metric we want to test.
- Use `evaluate(agent, prompt, metric)` which likely calls the agent to generate a response for the prompt and then computes the metric’s score.
- We then assert something about `result.score`. Here we expect 1 (perfect score), but in real scenarios you might set a threshold, e.g., `toBeGreaterThan(0.8)`.

This approach allows automated regression testing of agent outputs. Keep in mind:
- The test will actually call the model (which could be slow and consume tokens). To mitigate, you might use a shorter prompt or a local model for CI, or run these tests less frequently.
- Ensure API keys are available in CI environment for the model (if needed).

Mastra can capture and display eval results in its dashboard if you set up the global listeners.

## Capturing CI Eval Results

Mastra’s eval system can output results to the dashboard even from CI runs. To enable this, they suggest adding a global setup in tests that attaches listeners ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=You%20will%20need%20to%20configure,results%20in%20your%20mastra%20dashboard)) ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=globalSetup)):

- **globalSetup.ts** (run once):
  ```ts
  import { globalSetup } from '@mastra/evals';
  export default function() {
    globalSetup();
  }
  ``` 
  This might initialize a connection to a results service.

- **testSetup.ts** (run before all tests):
  ```ts
  import { beforeAll } from 'vitest';
  import { attachListeners } from '@mastra/evals';
  import { mastra } from './your-mastra-setup';

  beforeAll(async () => {
    await attachListeners(mastra);
  });
  ``` 
  This attaches event listeners to capture eval events during tests ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=)) ([Overview](https://mastra.ai/docs/evals/00-overview#:~:text=import%20,from%20%27%40mastra%2Fevals)). If you pass `mastra` (Mastra instance), it might store results in the configured storage.

By doing this, eval outcomes from tests are saved to Mastra’s storage (if you configured one, like LibSQL or file). Then, when you run `mastra dev` locally, you might see historical eval scores for each test run.

If you want persistent storage of evals, ensure your Mastra instance in tests uses a file or database storage (not just memory).

## Supported Evals

Mastra comes with a variety of built-in metrics (see **Evals-Supported.md** for a comprehensive list). They cover:
- **Accuracy & Reliability**: e.g., `HallucinationMetric`, `FaithfulnessMetric`, etc., to judge if the answer is grounded or contains made-up info ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Accuracy%20and%20Reliability)).
- **Context Usage**: e.g., metrics to evaluate how well the agent used provided context or followed instructions ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Understanding%20Context)).
- **Output Quality**: e.g., `ToneConsistencyMetric`, `ToxicityMetric`, `BiasMetric`, `PromptAlignmentMetric`, etc., checking style, harmful content, bias, adherence to instructions ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Output%20Quality)).

You can choose which metrics are relevant to your application and attach them to agents.

## Custom Evals

If the default metrics don’t cover a specific quality you care about, you can create your own metric by extending the `Metric` class. See **Evals-Custom.md** for details, but in short:
- Create a class extending `Metric` with a `measure(input, output)` method that returns a `MetricResult` (with a `score` and optional `info`).
- For complex evaluation, you might implement an LLM-based judge or special logic.

Once created, you can use your custom eval in the same way (add to agent’s `evals` or use in tests).

## Using Evals Effectively

- During development, run your agent on sample queries and observe eval scores in the dev UI. This can highlight issues (e.g., a high toxicity score for certain prompts).
- In CI, set up tests for critical behaviors. For example, if your agent should never output something toxic when asked innocuous questions, add a test with the `ToxicityMetric` score expected to be 1.
- Use eval results to track progress when refining your agent or comparing different model choices.
- Possibly integrate evals as a gating mechanism: e.g., if an answer’s score is below a threshold, you could have the agent try a different approach or flag the response.

Evals bring quantitative rigor to LLM development, which is often qualitative. By leveraging Mastra’s eval framework, you can catch regressions and ensure your AI meets certain standards consistently.
```

**Evals-Supported.md**  
```markdown
# Supported Evaluation Metrics

Mastra provides a set of **pre-built evaluation metrics** (evals) to assess various aspects of agent outputs. These are grouped by the aspect they measure:

### Accuracy and Reliability ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Accuracy%20and%20Reliability))

- **Hallucination** – Detects if the response contains fabricated or unsupported information.
- **Faithfulness** – Checks whether the response stays faithful to provided source material or facts.
- **Content Similarity** – Compares the similarity between the output and expected text (useful if you have a reference answer).
- **Textual Difference** – Measures how much the output text differs from some reference (inverse of similarity).
- **Completeness** – Checks if the output includes all required pieces of information.
- **Answer Relevancy** – Measures how directly the answer addresses the user's question.

### Understanding Context ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Understanding%20Context))

- **Context-Position** – Evaluates if the agent appropriately placed or utilized provided context in its answer (e.g., citing at the right time).
- **Context-Precision** – Assesses accuracy in using context (no extraneous info beyond context).
- **Context-Relevancy** – Measures relevance of the context used in the answer.
- **Contextual-Recall** – Checks if important info from context was recalled/included.

*(These metrics are especially relevant when using RAG or giving the agent documents to refer to.)*

### Output Quality ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Output%20Quality))

- **Tone** – Analyzes the style/tone of the output. For instance, ToneConsistencyMetric ensures the tone matches the desired one (e.g., polite, formal).
- **Toxicity** – Detects harmful, offensive, or toxic content in the output.
- **Bias** – Detects presence of sensitive biases in the output (e.g., inappropriate generalizations).
- **Prompt-Alignment** – Checks if the output follows the instructions or prompt (i.e., did it answer the question or go off-track).
- **Summarization** – If the task was to summarize, evaluates the quality of the summary.
- **Keyword-Coverage** – Checks if certain key terms are present in the output when they should be.

Each of these metrics is implemented as a class (likely in `@mastra/evals`). For example:
- `HallucinationMetric`, `ToxicityMetric`, `BiasMetric`, etc.

They might use different methods:
- Some are rule-based or use simple heuristics (keyword coverage, possibly prompt-alignment).
- Others might use an LLM themselves (hallucination or faithfulness might compare output to source via an LLM judge, or use embedding similarity).
- Toxicity and bias might use pre-trained classifiers or model-graded via an AI.

### Using Supported Metrics

To use any of these, import from `@mastra/evals`. E.g.:
```ts
import { ToxicityMetric, BiasMetric } from "@mastra/evals/nlp";
```
(*the exact import path may vary – possibly `@mastra/evals` or submodules like `nlp` or `openai`.*)

Then add to agent’s evals:
```ts
evals: {
  toxic: new ToxicityMetric(),
  bias: new BiasMetric()
}
``` 

Naming the keys is up to you; here "toxic" and "bias" keys will hold the scores.

### Interpreting Scores

- Score **1.0** generally means the output passed the check fully (no issues).
- Score **0.0** means it failed completely (e.g., definitely toxic or completely hallucinated).
- Values in between indicate partial compliance or severity.

For example, a ToxicityMetric might output 0.0 for a highly toxic phrase, 0.5 for a mildly offensive term, and 1.0 for no toxic content.

### Combining Metrics

You can use multiple metrics to get a well-rounded evaluation. For instance, to enforce quality, you might include:
- `HallucinationMetric`
- `ToxicityMetric`
- `ToneConsistencyMetric`
So you ensure factual accuracy, safety, and style.

Each metric will produce its score; you can look at them individually or average them for an overall score, depending on your needs.

### Extensibility

If you need a metric that isn’t listed (for example, checking numerical accuracy or format compliance), you may implement a custom metric (see **Evals-Custom.md**).

Mastra’s supported evals provide a good starting coverage for common concerns in LLM outputs such as truthfulness, completeness, and safety ([Supported evals](https://mastra.ai/docs/evals/01-supported-evals#:~:text=Accuracy%20and%20Reliability)). Use them to automatically test your agent and maintain quality as you iterate.
```

**Evals-Custom.md**  
```markdown
# Custom Evaluation Metrics

If Mastra’s built-in evals don’t cover a specific requirement, you can create your own **custom eval**. This is done by extending the base `Metric` class.

## Basic Custom Metric Example

A custom metric needs to define a `measure(input: string, output: string) -> MetricResult` ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=Creating%20your%20own%20eval%20is,method)). The `MetricResult` typically has:
- `score: number` (0 to 1),
- `info: { ... }` (optional object with additional info about the evaluation).

### Example: Keyword Coverage Metric

Suppose we want to ensure the agent’s output contains certain keywords. We can create a `KeywordCoverageMetric`:

```ts
import { Metric, MetricResult } from "@mastra/core/eval";

interface KeywordCoverageResult extends MetricResult {
  info: {
    totalKeywords: number;
    matchedKeywords: number;
  };
}

export class KeywordCoverageMetric extends Metric {
  private referenceKeywords: Set<string>;

  constructor(keywords: string[]) {
    super();
    this.referenceKeywords = new Set(keywords);
  }

  async measure(input: string, output: string): Promise<KeywordCoverageResult> {
    if (!output) {
      // If output is empty, score 0 if any keywords expected
      return {
        score: this.referenceKeywords.size === 0 ? 1 : 0,
        info: { totalKeywords: this.referenceKeywords.size, matchedKeywords: 0 }
      };
    }

    const matched = [...this.referenceKeywords].filter(k => output.includes(k));
    const total = this.referenceKeywords.size;
    const coverage = total > 0 ? matched.length / total : 1;
    return {
      score: coverage,
      info: {
        totalKeywords: total,
        matchedKeywords: matched.length
      }
    };
  }
}
``` 

In this example ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=import%20,from%20%27%40mastra%2Fcore%2Feval)) ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=async%20measure,totalKeywords%3A%200%2C%20matchedKeywords%3A%200%2C)):
- We store a set of keywords in the constructor.
- The `measure` function checks how many of those keywords appear in the `output` ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=const%20matchedKeywords%20%3D%20%5B...this.referenceKeywords%5D.filter%28k%20%3D,length%20%2F%20totalKeywords%20%3A%200)).
- It returns a score equal to the fraction of keywords present, and info with counts ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=const%20coverage%20%3D%20totalKeywords%20,length%20%2F%20totalKeywords%20%3A%200)).
- If there are no keywords expected, it returns score 1 (nothing required, nothing missing).
- If output is empty but keywords were expected, score 0.

This metric can then be used like:
```ts
evals: { keywords: new KeywordCoverageMetric(["Mastra", "AI", "framework"]) }
```
to ensure the agent mentions those terms.

## Custom LLM-Judge Metric

For more complex evaluation, you might use an LLM itself as a judge. Mastra has `MastraAgentJudge` class for that ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=Creating%20a%20custom%20LLM)) ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=import%20,from%20%27zod)):
- This likely allows you to create a hidden agent that evaluates the main agent’s output given the input.

For instance, a custom “Recipe Completeness” judge might:
- Take the user’s question and the agent’s answer (which is a recipe).
- Have an internal prompt that asks “Does this recipe include all necessary steps and ingredients? If not, list missing ones.”
- The judge agent (maybe using GPT-4) returns a verdict and missing items.
- The metric then interprets that: if missing list is empty, score 1, otherwise lower.

From the doc snippet ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=import%20,prompts)) ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=%7D,)), they show a `RecipeCompletenessJudge` extending `MastraAgentJudge` where:
- The judge is initialized with instructions and an LLM model.
- It defines an `evaluate(input, output)` that runs the judge agent to get a result (like missing items, verdict) ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=async%20evaluate,input%2C%20output)) ([Create your own Eval](https://mastra.ai/docs/evals/02-custom-eval#:~:text=const%20result%20%3D%20await%20this,)).
- That result can then be converted into a score.

LLM-based metrics are powerful for subjective or complicated evaluations (like “is the explanation correct and clear?”) but they rely on another model – keep in mind cost and potential inconsistency.

## Integration of Custom Metrics

Once your custom metric class is defined:
- You can add it to an agent’s `evals` just like built-ins.
- Or use it in tests with `evaluate(agent, prompt, new YourMetric())`.

If your metric needs context beyond input/output, you may need to provide that when calling `evaluate`. For example, if evaluating against a reference text, your metric might need that reference. In such cases, you could pass the reference in the agent’s prompt or extend `evaluate()` usage accordingly.

## Best Practices for Custom Evals

- **Deterministic vs AI-based**: Prefer deterministic checks (like string contains, regex, calculations) for specific, objective criteria (they are faster and stable). Use AI-based judges for nuanced criteria.
- **Normalize Text**: In measure(), consider normalizing case, removing punctuation, etc., depending on what you evaluate (to avoid missing a keyword due to capitalization, for example).
- **Scaling Score**: Make sure to bound your score 0-1. If you compute some value, clamp or normalize it.
- **Info Field**: Provide helpful details in `info` for debugging. E.g., which keywords were missing, or what issues were found. These can show up in logs or dashboard to understand why a score was not perfect.

Creating custom evals ensures you can test what matters specifically for your application. Whether it’s adherence to a format, inclusion of specific content, or some domain-specific correctness measure, you have full control to implement it in Mastra’s eval framework.
```
