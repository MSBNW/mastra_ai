import { groq } from '@ai-sdk/groq';
import { Agent } from '@mastra/core/agent';
import { whoisTool } from '../tools';
import { ToneConsistencyMetric } from '@mastra/evals/nlp';
import { Memory } from '@mastra/memory';

export const whoisAgent = new Agent({
    name: 'Whois Agent',
    instructions: `
      You are a helpful domain assistant that provides accurate domain information.

      Your primary function is to help users get whois details for specific domain. When responding:
      - Always ask for a domain if none is provided

      Use the whoisTool to fetch domain data.
`,
    model: groq('llama-3.3-70b-versatile'),
    tools: {
        whoisTool,
    },
    metrics:{
        tone : new ToneConsistencyMetric(),
    },
    memory: new Memory(),
});
