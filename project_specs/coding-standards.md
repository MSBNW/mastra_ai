# Mastra Project Coding Standards

This document outlines the coding standards and best practices for the Mastra project. Following these guidelines ensures consistency, maintainability, and high-quality code across the project.

## Table of Contents

1. [TypeScript Guidelines](#typescript-guidelines)
2. [Code Formatting](#code-formatting)
3. [Naming Conventions](#naming-conventions)
4. [Project Structure](#project-structure)
5. [Imports and Exports](#imports-and-exports)
6. [Documentation](#documentation)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Performance Considerations](#performance-considerations)
10. [Mastra-Specific Patterns](#mastra-specific-patterns)

## TypeScript Guidelines

### Type Safety

- Leverage TypeScript's static typing system to catch errors at compile time.
- Avoid using `any` type unless absolutely necessary.
- Use explicit return types for functions, especially for public APIs.
- Prefer interfaces over type aliases for object shapes that might be extended.

```typescript
// ✅ Good
interface WeatherResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
  };
}

// ❌ Avoid
type WeatherResponse = any;
```

### Type Assertions

- Use type assertions sparingly and only when you're certain of the type.
- Prefer type guards and narrowing over assertions.

```typescript
// ✅ Good
if (response && 'results' in response) {
  // Use response.results safely
}

// ❌ Avoid
const data = response as WeatherResponse;
```

### Nullability

- Be explicit about nullable types using union types with `null` or `undefined`.
- Use optional chaining (`?.`) and nullish coalescing (`??`) operators for handling potentially undefined values.

```typescript
// ✅ Good
const name = geocodingData.results?.[0]?.name || 'Unknown location';

// ❌ Avoid
const name = geocodingData.results[0].name;  // Might throw if results is empty
```

## Code Formatting

### Indentation and Spacing

- Use 2 spaces for indentation.
- Add a space after keywords like `if`, `for`, `while`, etc.
- Add spaces around operators (`+`, `-`, `=`, etc.).
- No trailing whitespace at the end of lines.

### Line Length

- Keep lines under 100 characters when possible.
- For long method chains or parameter lists, break into multiple lines with consistent indentation.

### Quotes and Semicolons

- Use single quotes (`'`) for string literals.
- Use template literals (backticks) for string interpolation.
- Always use semicolons at the end of statements.

```typescript
// ✅ Good
const url = `https://api.example.com/v1/${endpoint}`;
const options = { method: 'GET' };

// ❌ Avoid
const url = "https://api.example.com/v1/" + endpoint
const options = { method: "GET" }
```

### Braces and Blocks

- Opening braces should be on the same line as the statement.
- Always use braces for control statements, even for single-line blocks.

```typescript
// ✅ Good
if (condition) {
  doSomething();
}

// ❌ Avoid
if (condition)
  doSomething();
```

## Naming Conventions

### General Rules

- Use descriptive, meaningful names that convey the purpose.
- Avoid abbreviations unless they are widely understood.
- Be consistent with naming patterns throughout the codebase.

### Specific Conventions

- **Variables and Functions**: Use camelCase.
- **Classes, Interfaces, and Types**: Use PascalCase.
- **Constants**: Use UPPER_SNAKE_CASE for true constants, camelCase for variables that won't be reassigned.
- **Private Properties**: Use camelCase with a leading underscore.
- **File Names**: Use kebab-case for file names.

```typescript
// ✅ Good
const maxRetryCount = 3;
function fetchWeatherData() { /* ... */ }
interface WeatherResponse { /* ... */ }
class WeatherService { 
  private _apiKey: string;
}

// ❌ Avoid
const MaxRetryCount = 3;
function FetchWeatherData() { /* ... */ }
interface weatherResponse { /* ... */ }
```

### Semantic Naming

- **Functions**: Use verb phrases that describe the action (e.g., `getWeather`, `fetchData`).
- **Booleans**: Use prefixes like `is`, `has`, `should` (e.g., `isLoading`, `hasError`).
- **Event Handlers**: Prefix with `handle` or `on` (e.g., `handleSubmit`, `onWeatherFetch`).

## Project Structure

Follow the Mastra recommended project structure as outlined in the documentation:

```
- src/
  - mastra/
    - agents/       # Agent definitions
      - index.ts    # Exports all agents
    - tools/        # Tool definitions
      - index.ts    # Exports all tools
    - workflows/    # Workflow definitions
      - index.ts    # Exports all workflows
    - index.ts      # Main Mastra configuration
- specs/            # Project specifications and documentation
- tests/            # Test files
```

### Module Organization

- Group related functionality in the same directory.
- Keep files focused on a single responsibility.
- Extract reusable utilities to separate files.
- Use barrel files (`index.ts`) to simplify imports.

## Imports and Exports

### Import Order

1. External libraries and frameworks
2. Internal modules from other directories
3. Local imports from the same directory

Separate each group with a blank line.

```typescript
// External imports
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';

// Internal imports from other directories
import { weatherTool } from '../tools';

// Local imports
import { getWeatherCondition } from './utils';
```

### Export Style

- Prefer named exports over default exports for better refactoring support and explicit imports.
- Use barrel files (`index.ts`) to re-export from multiple files.

```typescript
// ✅ Good
export const weatherTool = createTool({ /* ... */ });

// In index.ts (barrel file)
export { weatherTool } from './weather-tool';
export { searchTool } from './search-tool';

// ❌ Avoid
export default createTool({ /* ... */ });
```

## Documentation

### Comments

- Write comments for complex logic that isn't immediately obvious.
- Avoid comments that merely restate the code.
- Keep comments up-to-date when code changes.

### JSDoc

- Use JSDoc comments for public APIs and complex functions.
- Include parameter descriptions, return values, and examples where helpful.

```typescript
/**
 * Fetches weather data for a specific location
 * 
 * @param location - The city or location name
 * @returns Weather information including temperature and conditions
 * @throws Error if the location cannot be found
 */
async function getWeather(location: string) {
  // Implementation
}
```

### README and Documentation Files

- Maintain up-to-date README files for major components.
- Document architecture decisions and design patterns in separate markdown files.
- Include examples for common use cases.

## Error Handling

### Error Types

- Use specific error messages that help with debugging.
- Consider creating custom error classes for different error categories.

```typescript
// ✅ Good
throw new Error(`Location '${location}' not found`);

// ❌ Avoid
throw new Error('Failed');
```

### Async Error Handling

- Use try/catch blocks for async operations that might fail.
- Propagate errors with context when re-throwing.
- Handle promise rejections explicitly.

```typescript
// ✅ Good
try {
  const response = await fetch(url);
  const data = await response.json();
  return processData(data);
} catch (error) {
  throw new Error(`Failed to fetch weather data: ${error.message}`);
}

// ❌ Avoid
const response = await fetch(url);
const data = await response.json();
return processData(data);
```

## Testing

### Test Organization

- Place tests in a separate `tests` directory mirroring the source structure.
- Name test files with `.test.ts` or `.spec.ts` suffix.

### Test Coverage

- Aim for high test coverage, especially for critical paths.
- Test edge cases and error conditions.
- Use mocks for external dependencies.

### Test Quality

- Write focused tests that verify a single behavior.
- Use descriptive test names that explain the expected behavior.
- Follow the Arrange-Act-Assert pattern.

```typescript
// ✅ Good
describe('getWeather', () => {
  it('should return weather data for a valid location', async () => {
    // Arrange
    const location = 'London';
    mockGeocoding(location);
    mockWeatherApi();
    
    // Act
    const result = await getWeather(location);
    
    // Assert
    expect(result.temperature).toBeDefined();
    expect(result.conditions).toBeDefined();
  });
  
  it('should throw an error for an invalid location', async () => {
    // Arrange
    const location = 'NonExistentPlace';
    mockGeocoding(location, { results: [] });
    
    // Act & Assert
    await expect(getWeather(location)).rejects.toThrow('not found');
  });
});
```

## Performance Considerations

### Efficient Data Handling

- Minimize unnecessary data transformations.
- Use appropriate data structures for the task.
- Consider memory usage for large datasets.

### Async Operations

- Use Promise.all for parallel operations when appropriate.
- Consider implementing caching for expensive operations.
- Handle timeouts for external API calls.

```typescript
// ✅ Good - Parallel requests
const [geocodingData, otherData] = await Promise.all([
  fetch(geocodingUrl).then(res => res.json()),
  fetch(otherUrl).then(res => res.json())
]);

// ❌ Avoid - Sequential requests when parallel is possible
const geocodingData = await fetch(geocodingUrl).then(res => res.json());
const otherData = await fetch(otherUrl).then(res => res.json());
```

## Mastra-Specific Patterns

### Agent Definitions

- Provide clear, detailed instructions for agents.
- Format multi-line instructions using template literals.
- Group related tools together.

```typescript
export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
    You are a helpful weather assistant that provides accurate weather information.
    
    Your primary function is to help users get weather details for specific locations.
    When responding:
    - Always ask for a location if none is provided
    - Include relevant details like humidity and wind conditions
    - Keep responses concise but informative
  `,
  model: groq('llama-3.3-70b-versatile'),
  tools: { weatherTool },
});
```

### Tool Definitions

- Use descriptive IDs that reflect the tool's purpose.
- Provide clear descriptions for tools to guide the agent.
- Define comprehensive input and output schemas using Zod.
- Keep the execute function focused on a single responsibility.

```typescript
export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather for a location',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
    // Other fields...
  }),
  execute: async ({ context }) => {
    return await getWeather(context.location);
  },
});
```

### Workflow Steps

- Give each step a clear ID and description.
- Define input and output schemas for validation.
- Handle errors gracefully within steps.
- Use context to access previous step results.

```typescript
const fetchWeather = new Step({
  id: 'fetch-weather',
  description: 'Fetches weather forecast for a given city',
  inputSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
  execute: async ({ context }) => {
    // Implementation
  },
});
```

### Workflow Definition

- Use a clear, descriptive name for the workflow.
- Define a trigger schema to validate initial inputs.
- Chain steps in a logical sequence.
- Always call commit() to finalize the workflow.

```typescript
const weatherWorkflow = new Workflow({
  name: 'weather-workflow',
  triggerSchema: z.object({
    city: z.string().describe('The city to get the weather for'),
  }),
})
  .step(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();
```

---

By following these guidelines, we ensure a consistent, maintainable, and high-quality codebase for the Mastra project. These standards should be applied to all new code and used as a reference when refactoring existing code.
