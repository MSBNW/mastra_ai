import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { ToneConsistencyMetric } from '@mastra/evals/nlp';
import { weatherTool, whoisTool } from '../tools';
import { searchCompanies, getCompanyBySlug, listCompaniesByBatch, searchHackerNews, getTopStories } from '@mastra/yc-hn-tools';

/**
 * Main Voice Agent
 * 
 * This agent handles the logic part of voice interactions (LLM, database access)
 * while leaving voice processing to an external Livekit server.
 * 
 * It's designed to work similar to OpenAI API for streaming requests.
 */
export const mainVoiceAgent = new Agent({
  name: 'Main Voice Agent',
  instructions: `
    Your name is Lindsi. You are a helpful voice assistant that provides information and assistance.
    
    Your primary function is to respond to user queries with accurate and helpful information.
    You will receive text input from a voice transcription service and should provide text responses
    that will be converted to speech by an external voice service.
    
    When responding:
    - Keep responses conversational but concise
    - Provide accurate information using available tools
    - Maintain a consistent, friendly tone
    - Format responses for natural speech (avoid complex formatting that wouldn't sound natural)
    - Remember context from previous interactions in the conversation
    
    You have access to various tools to help answer questions, including weather information,
    domain lookups, company information, and news searches.
  `,
  model: groq('llama-3.3-70b-versatile'),  // Using OpenAI's GPT-4o for high-quality responses
  tools: {
    // Providing access to all available tools
    weatherTool,
    whoisTool,
    searchCompanies,
    getCompanyBySlug,
    listCompaniesByBatch,
    searchHackerNews,
    getTopStories
  },
  metrics: {
    tone: new ToneConsistencyMetric(),  // Ensuring consistent tone across responses
  },
  memory: new Memory(),  // Using default memory configuration
});
