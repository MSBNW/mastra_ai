# Installation

To build and run a Mastra application, you need an environment with Node.js and access to an LLM provider (or a local LLM). Below are instructions for setting up Mastra either automatically using the CLI or manually.

## Prerequisites

- Node.js **v20.0** or higher
- Access to a **supported LLM provider** (e.g., OpenAI, Anthropic, Google Gemini, or a local LLM via Ollama). Obtain an API key for your chosen provider.

## Automatic Installation

Mastra provides a CLI tool to scaffold a new project quickly.

### Create a New Project

We recommend starting with the interactive initializer `create-mastra`, which sets up a new Mastra project with your chosen options. Run one of the following commands (choose your package manager):

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

This will launch an interactive prompt:

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

You will be asked to name your project, select which Mastra components to include (Agents, Tools, Workflows), choose a default LLM provider, and optionally include example code. Based on your choices, `create-mastra` will set up a project directory with TypeScript configuration, install the necessary dependencies, and scaffold the selected components and provider integration.

### Set Up Your API Key

After project creation, add your LLM API key to the new project's environment file. For example, in the `.env` file add:

```dotenv
OPENAI_API_KEY=<your-openai-key>
```

Replace `<your-openai-key>` with your actual API key. This key will be used by the Mastra framework to authenticate LLM calls.

**Note:** You can also run the `create-mastra` command in a non-interactive mode using flags. For instance, to include agents and tools with OpenAI as provider and example code, run:

```sh
npx create-mastra@latest --components agents,tools --llm openai --example
```

If the installation is slow, a `--timeout` flag is available to set a timeout.

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

**Using npm:**

```sh
npm install typescript tsx @types/node mastra@alpha --save-dev
npm install @mastra/core@alpha zod
npx tsc --init
```

**Using pnpm:**

```sh
pnpm add typescript tsx @types/node mastra@alpha --save-dev
pnpm add @mastra/core@alpha zod
pnpm dlx tsc --init
```

**Using yarn:**

```sh
yarn add typescript tsx @types/node mastra@alpha --dev
yarn add @mastra/core@alpha zod
yarn dlx tsc --init
```

**Using bun:**

```sh
bun add typescript tsx @types/node mastra@alpha --dev
bun add @mastra/core@alpha zod
bunx tsc --init
```

These commands initialize a Node.js project with TypeScript support, install the latest Mastra packages (using the `@alpha` tag for the newest version), and generate a `tsconfig.json`.

### Initialize TypeScript Configuration

Create a `tsconfig.json` file (if not already created by `tsc --init`) or verify it has the following configuration optimized for Mastra projects:

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

This ensures modern ECMAScript support, proper module resolution, strict type checking, and output files in a `dist` folder.

### Set Up Your API Key

Just like the automatic setup, create a `.env` file in the project root and add your LLM provider API key:

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

2. Open `src/mastra/tools/weather-tool.ts` and add the following code (an example tool that fetches current weather data):

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

    This defines a tool with an `id` and description that explains its purpose. It uses **Zod** schemas for input (`location` string) and output (various weather fields) to enforce correct types. The `execute` function calls an internal helper `getWeather` to retrieve data for the given location.

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

    The helper performs geocoding to get coordinates for the city, then calls a weather API. It returns an object matching the `outputSchema` with fields like `temperature`, `humidity`, etc. The `getWeatherCondition` function maps weather codes to human-readable descriptions.

### Create an Agent

Now create an **agent** that will use the tool. Agents encapsulate a language model plus tools and memory.

1. Make an agents directory and file:

    ```sh
    mkdir -p src/mastra/agents 
    touch src/mastra/agents/weather.ts
    ```

2. Open `src/mastra/agents/weather.ts` and define the agent:

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

    Here we import a model provider (`openai`) and the `Agent` class, as well as our `weatherTool`. We then instantiate a new `Agent` with a name and **instructions** (a system prompt guiding the agent's behavior). We specify the model (`gpt-4o-mini` via the OpenAI provider) and attach the `weatherTool` in the agent's tools list. This agent will be able to call `weatherTool` when needed to fulfill user requests.

### Register the Agent

Finally, register your agent with the Mastra application. In the Mastra entry point file (commonly `src/mastra/index.ts`), add the agent to the Mastra configuration:

```ts
import { Mastra } from "@mastra/core";
import { weatherAgent } from "./agents/weather";

export const mastra = new Mastra({
  agents: { weatherAgent },
});
```

This creates a Mastra instance and registers the `weatherAgent` under its `agents` property. By registering, you ensure that when you run the development server, Mastra will discover the agent and expose it via the API.

## Existing Projects

To add Mastra to an **existing Node.js project** instead of creating a new one, you can use the same CLI initializer: run `mastra init` in your project directory to interactively add the `src/mastra` scaffold and dependencies. See the Local Development documentation for more on `mastra init` if needed.

Framework-specific integration guides (e.g., for Next.js) are also available if you want to embed Mastra into an existing app's context.

## Starting the Mastra Server

Mastra provides a development server to host your agents (and workflows) with a REST API.

### Development Server

To start the local server, run the following command in your project:

```sh
npm run dev
```

*(This assumes the project's `package.json` has a script for starting the dev server. If you used the CLI scaffolding, it should.)* 

Alternatively, if you have Mastra installed globally or as an npx command, simply run:

```sh
mastra dev
```

This launches a local server (by default on **http://localhost:4111**) and sets up REST endpoints for each agent and workflow. For example, an agent named "weatherAgent" will be served at: 

```
POST http://localhost:4111/api/agents/weatherAgent/generate
```

(Mastra will automatically create endpoints like `/api/agents/<agentId>/generate` and `/stream`.)

### Test the Endpoint

You can test that your agent is working by calling its endpoint with a tool like `curl` or using `fetch` in JavaScript.

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

This will initialize the Mastra instance, retrieve the `weatherAgent` by name, and call its `generate()` method with a user query. The response's text is then printed to the console. This is a quick way to test your agent logic end-to-end without using the HTTP interface.
