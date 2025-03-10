# My Mastra App - Codebase Overview

## Project Structure
```
.
├── .mastra/
├── src/
│   └── mastra/
│       ├── agents/
│       ├── workflows/
│       ├── tools/
│       └── index.ts
├── .env.development
├── package.json
├── tsconfig.json
└── .gitignore
```

## Technology Stack
- **Framework**: Mastra (v0.2.8)
- **Core Dependencies**:
  - @mastra/core (v0.4.4)
  - @ai-sdk/openai (v1.2.1)
  - zod (v3.24.2)
- **Development Tools**:
  - TypeScript (v5.8.2)
  - tsx (v4.19.3)

## Application Components

### 1. Main Application (src/mastra/index.ts)
- Entry point for the Mastra application
- Configures and initializes:
  - Weather workflow
  - Weather agent
  - Logger configuration

### 2. Agents (src/mastra/agents/)
- Contains AI agent definitions
- Main file: index.ts (21 lines)
- Implements weather-related agent functionality

### 3. Workflows (src/mastra/workflows/)
- Contains application workflow definitions
- Main file: index.ts (184 lines)
- Implements weather-related workflow logic

### 4. Tools (src/mastra/tools/)
- Contains utility tools and helpers
- Used by agents and workflows

## Configuration
- Environment configuration in `.env.development`
- TypeScript configuration in `tsconfig.json`
- Project uses ES modules (type: "module")

## Scripts
- `npm run dev`: Starts the development server using Mastra
- `npm test`: Test script (currently not implemented)

## Project Overview
This appears to be a Mastra-based application focused on weather-related functionality. It uses a structured architecture with separate directories for agents, workflows, and tools. The application leverages OpenAI's AI capabilities through the @ai-sdk/openai package and uses Zod for schema validation.

The main functionality appears to be centered around weather operations, with dedicated agents and workflows handling weather-related tasks. The application follows a modular structure, separating concerns between agents (AI behavior), workflows (process flow), and tools (utilities).
