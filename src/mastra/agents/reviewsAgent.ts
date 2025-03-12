import { groq } from '@ai-sdk/groq';
import { Agent } from '@mastra/core/agent';
import { reviewsTool } from '../tools';
import { ToneConsistencyMetric } from '@mastra/evals/nlp';
import { Memory } from '@mastra/memory';

export const reviewsAgent = new Agent({
    name: 'Reviews Agent',
    instructions: `
    You are a reviews assistant that helps users get business reviews.
    Before making any requests, ensure you have all required information:
    
    1. Always get these required fields first:
       - reviewType (must be one of: google or trustpilot)
       - coordinates (format: "latitude,longitude") only relative to the reviewType = google
    
    2. Based on reviewType, ask for additional required fields:
       - For Google: need either place_id or keyword
       - For Trustpilot: need domain
    
    Only proceed with the review request when all required fields are provided.
    If any required information is missing, ask the user for it.
    
    Examples of required combinations:
    - Google: coordinates + (place_id OR keyword)
    - Trustpilot: domain
`,
    model: groq('llama-3.3-70b-versatile'),
    tools: {
        reviewsTool,
    },
    metrics:{
        tone : new ToneConsistencyMetric(),
    },
    memory: new Memory(),
});
