# Mastra Framework Patterns and Best Practices

This document outlines specific patterns, practices, and guidelines for developing with the Mastra framework. It complements the general [Project Ruleset](./project-ruleset.md) and [Coding Standards](./coding-standards.md) with Mastra-specific recommendations.

## Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [Agent Design](#agent-design)
3. [Tool Implementation](#tool-implementation)
4. [Workflow Design](#workflow-design)
5. [Memory and Context Management](#memory-and-context-management)
6. [Integration Patterns](#integration-patterns)
7. [Testing Mastra Components](#testing-mastra-components)
8. [Performance Optimization](#performance-optimization)
9. [Deployment Considerations](#deployment-considerations)

## Architecture Principles

### Component Organization

- Organize Mastra components (agents, tools, workflows) in a modular, domain-driven structure.
- Group related components together to facilitate discovery and maintenance.
- Maintain clear boundaries between different functional domains.

### Separation of Concerns

- Separate AI logic (agents, prompts) from business logic (tools, workflows).
- Keep LLM prompts and instructions separate from implementation details.
- Use tools to encapsulate external integrations and complex operations.

### Configuration Management

- Externalize configuration values in environment variables or configuration files.
- Use a consistent approach to loading and validating configuration.
- Document all configuration options and their default values.

```typescript
// Example of configuration management
import { z } from 'zod';

const configSchema = z.object({
  apiKey: z.string(),
  modelName: z.string().default('llama-3.3-70b-versatile'),
  maxTokens: z.number().default(4096),
});

// Load from environment variables
const config = configSchema.parse({
  apiKey: process.env.API_KEY,
  modelName: process.env.MODEL_NAME,
  maxTokens: process.env.MAX_TOKENS ? parseInt(process.env.MAX_TOKENS) : undefined,
});
```

## Agent Design

### Agent Responsibilities

- Design agents with a clear, focused purpose.
- Limit each agent to a specific domain or set of related tasks.
- Document the agent's capabilities and limitations.

### Instruction Design

- Write clear, concise instructions that guide the agent's behavior.
- Structure instructions with examples and constraints.
- Use formatting (bullet points, sections) to improve readability.

```typescript
const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
    You are a helpful weather assistant that provides accurate weather information.
    
    CAPABILITIES:
    - Provide current weather conditions for a location
    - Offer weather forecasts for up to 5 days
    - Suggest activities based on weather conditions
    
    CONSTRAINTS:
    - Only use the provided weather tool for data
    - Do not make up weather information
    - Always ask for a location if none is provided
    
    RESPONSE FORMAT:
    - Begin with a brief summary of current conditions
    - Include temperature, conditions, and relevant details
    - For forecasts, organize by day with clear headings
    - Keep responses concise but informative
  `,
  // ...
});
```

### Model Selection

- Choose appropriate models based on the agent's requirements.
- Consider factors like capabilities, cost, and latency.
- Document the rationale for model selection.

### Tool Integration

- Provide agents with only the tools they need for their specific tasks.
- Group related tools together for clarity.
- Document tool dependencies and usage patterns.

## Tool Implementation

### Tool Design Principles

- Design tools with a single responsibility.
- Make tools reusable across different agents and workflows.
- Provide clear error messages and handle edge cases gracefully.

### Schema Definition

- Define comprehensive input and output schemas using Zod.
- Include descriptive field names and descriptions.
- Validate inputs thoroughly to prevent runtime errors.

```typescript
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City or location name'),
    units: z.enum(['metric', 'imperial']).default('metric').describe('Temperature units'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    conditions: z.string(),
    location: z.string(),
    timestamp: z.string(),
  }),
  // ...
});
```

### Error Handling

- Handle expected errors gracefully with informative messages.
- Implement retries for transient failures when appropriate.
- Log errors with sufficient context for debugging.

```typescript
execute: async ({ context }) => {
  try {
    const data = await fetchWeatherData(context.location);
    return mapToOutputSchema(data);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Location '${context.location}' not found`);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Weather service is currently unavailable. Please try again later.');
    }
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
}
```

### Implementation Patterns

- Extract complex logic into separate functions for clarity.
- Use async/await consistently for asynchronous operations.
- Implement proper resource cleanup for tools that use external resources.

## Workflow Design

### Workflow Structure

- Design workflows as a series of discrete, focused steps.
- Ensure each step has a clear input, process, and output.
- Document the purpose and dependencies of each step.

### Step Design

- Keep steps focused on a single responsibility.
- Define clear input and output schemas for validation.
- Handle errors gracefully within steps.

```typescript
const fetchWeather = new Step({
  id: 'fetch-weather',
  description: 'Fetches weather forecast for a given city',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  outputSchema: z.array(z.object({
    date: z.string(),
    maxTemp: z.number(),
    minTemp: z.number(),
    precipitationChance: z.number(),
    condition: z.string(),
    location: z.string(),
  })),
  execute: async ({ context }) => {
    // Implementation
  },
});
```

### Control Flow

- Use branching to handle different scenarios.
- Implement error recovery paths for critical workflows.
- Consider using workflow variables for state management.

```typescript
weatherWorkflow
  .step(fetchWeather)
  .then(planActivities)
  .after('error', handleWeatherError)
  .commit();
```

### Workflow Testing

- Test workflows with different input scenarios.
- Verify error handling and recovery paths.
- Mock external dependencies for reliable testing.

## Memory and Context Management

### Memory Usage

- Use memory judiciously to maintain context across interactions.
- Define clear strategies for memory retention and pruning.
- Consider privacy implications when storing user data.

```typescript
export const conversationalAgent = new Agent({
  // ...
  memory: new Memory({
    maxItems: 10,
    storageProvider: new FileSystemStorage('./data/memory'),
  }),
});
```

### Context Passing

- Be explicit about data passed between workflow steps.
- Use context to share state between steps.
- Document the expected context structure for each step.

```typescript
execute: async ({ context }) => {
  const previousStepResult = context.getStepResult('previous-step');
  // Use previousStepResult...
}
```

### State Management

- Define clear ownership of state in complex workflows.
- Use workflow variables for shared state.
- Document state transitions and dependencies.

## Integration Patterns

### External API Integration

- Encapsulate API calls in dedicated tools.
- Handle authentication and rate limiting consistently.
- Implement proper error handling and retries.

```typescript
const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${process.env.API_KEY}`,
  },
});

// Retry logic
const fetchWithRetry = async (url, options, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await apiClient.get(url, options);
    } catch (error) {
      if (error.response?.status === 429 || error.code === 'ECONNRESET') {
        retries++;
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        continue;
      }
      throw error;
    }
  }
  throw new Error(`Failed after ${maxRetries} retries`);
};
```

### Database Integration

- Use a consistent pattern for database access.
- Implement proper connection pooling and resource management.
- Handle database errors gracefully.

### Event-Based Integration

- Define clear event schemas for integration points.
- Document event producers and consumers.
- Implement proper error handling for event processing.

## Testing Mastra Components

### Agent Testing

- Test agent behavior with different inputs and scenarios.
- Mock LLM responses for deterministic testing.
- Verify tool usage patterns.

```typescript
describe('Weather Agent', () => {
  it('should request location when none provided', async () => {
    const mockLLM = createMockLLM([
      { role: 'assistant', content: 'What location would you like the weather for?' }
    ]);
    
    const agent = new Agent({
      // ...configuration
      model: mockLLM,
    });
    
    const response = await agent.generate('What\'s the weather like?');
    expect(response.text).toContain('location');
  });
});
```

### Tool Testing

- Test tools in isolation with different inputs.
- Mock external dependencies for reliable testing.
- Verify error handling and edge cases.

```typescript
describe('weatherTool', () => {
  beforeEach(() => {
    // Setup mocks
    mockGeocoding();
    mockWeatherApi();
  });
  
  it('should return weather data for valid location', async () => {
    const result = await weatherTool.execute({ 
      context: { location: 'London' } 
    });
    
    expect(result.temperature).toBeDefined();
    expect(result.conditions).toBeDefined();
  });
  
  it('should throw error for invalid location', async () => {
    mockGeocoding('InvalidLocation', { results: [] });
    
    await expect(
      weatherTool.execute({ context: { location: 'InvalidLocation' } })
    ).rejects.toThrow('not found');
  });
});
```

### Workflow Testing

- Test workflows end-to-end with different inputs.
- Test individual steps in isolation.
- Verify error handling and recovery paths.

```typescript
describe('weatherWorkflow', () => {
  it('should complete successfully with valid input', async () => {
    const result = await weatherWorkflow.execute({
      city: 'London'
    });
    
    expect(result.activities).toBeDefined();
  });
  
  it('should handle location not found error', async () => {
    mockGeocoding('InvalidLocation', { results: [] });
    
    await expect(
      weatherWorkflow.execute({ city: 'InvalidLocation' })
    ).rejects.toThrow('not found');
  });
});
```

## Performance Optimization

### LLM Usage Optimization

- Optimize prompts to reduce token usage.
- Use the most appropriate model for each task.
- Implement caching for repeated LLM calls.

### Tool Efficiency

- Optimize expensive operations in tools.
- Implement caching for external API calls.
- Use batch operations where appropriate.

```typescript
// Example of caching implementation
const cache = new Map();
const cacheTTL = 60 * 60 * 1000; // 1 hour

const getWeatherWithCache = async (location) => {
  const cacheKey = `weather:${location}`;
  const cached = cache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp < cacheTTL)) {
    return cached.data;
  }
  
  const data = await fetchWeatherData(location);
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};
```

### Workflow Optimization

- Parallelize independent steps where possible.
- Optimize data passing between steps.
- Consider implementing checkpoints for long-running workflows.

## Deployment Considerations

### Environment Configuration

- Use environment variables for configuration.
- Document required environment variables.
- Provide sensible defaults where appropriate.

### Monitoring and Logging

- Implement comprehensive logging for debugging.
- Monitor LLM usage and costs.
- Track performance metrics for optimization.

```typescript
const logger = createLogger({
  name: 'Mastra',
  level: process.env.LOG_LEVEL || 'info',
  transport: new FileTransport('./logs'),
});

// Usage in tools
execute: async ({ context }) => {
  logger.info('Fetching weather data', { location: context.location });
  try {
    const data = await fetchWeatherData(context.location);
    logger.debug('Weather data received', { data });
    return mapToOutputSchema(data);
  } catch (error) {
    logger.error('Failed to fetch weather data', { 
      location: context.location, 
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}
```

### Scaling Considerations

- Design for horizontal scaling where possible.
- Implement proper resource management.
- Consider rate limiting and throttling for external services.

---

This document serves as a guide for implementing Mastra components according to best practices. It should be updated as the framework evolves and new patterns emerge.
