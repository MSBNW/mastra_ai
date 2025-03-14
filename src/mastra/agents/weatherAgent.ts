import { groq } from '@ai-sdk/groq';
import { Agent } from '@mastra/core/agent';
import { weatherTool, whoisTool } from '../tools';
import { searchCompanies, getCompanyBySlug, listCompaniesByBatch, searchHackerNews, getTopStories } from '@mastra/yc-hn-tools';
import { ToneConsistencyMetric } from '@mastra/evals/nlp';
import { Memory } from '@mastra/memory';
import { mainVoiceAgent } from './mainVoiceAgent';

export { mainVoiceAgent };

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Always ask for a location if none is provided
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: groq('llama-3.3-70b-versatile'),
  tools: {
    whoisTool,
    weatherTool,
    searchCompanies,
    getCompanyBySlug,
    listCompaniesByBatch,
    searchHackerNews,
    getTopStories
  },
  metrics:{
    tone : new ToneConsistencyMetric(),
  },
  memory: new Memory(),
});
