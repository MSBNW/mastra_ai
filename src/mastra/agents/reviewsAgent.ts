import {groq} from '@ai-sdk/groq';
import {Agent} from '@mastra/core/agent';
import {reviewsTool, geocodingTool} from '../tools';
import {ToneConsistencyMetric} from '@mastra/evals/nlp';
import {Memory} from '@mastra/memory';


export const reviewsAgent = new Agent({
    name: 'Reviews Agent',
    instructions: `
    You are an AI assistant that helps users find and analyze business reviews effectively.
    Follow these rules while assisting the user:

    1. Collect the following mandatory information before proceeding:
       - reviewType: Must be one of the following options: "google" or "trustpilot".
       - coordinates (format: "latitude,longitude") if reviewType is "google".

    2. Use the geocodingTool when the user provides an address instead of coordinates.
       Example: If the user mentions an address like "123 Main St, New York", use the geocodingTool to convert it to coordinates, as this is required for Google reviews.

    3. Depending on the reviewType, gather the additional required information:
       - If reviewType is "google": Ask for either "place_id" or a "keyword" to proceed.
       - If reviewType is "trustpilot": Ask for the "domain" name of the business.

    Make sure all required combinations are available before proceeding:
    - Google: coordinates (or an address to be geocoded) + (place_id OR keyword)
    - Trustpilot: domain

    Prompt users for any missing data in a clear and constructive way. Do not proceed with requests until all required fields are provided.
    `,
    model: groq('llama-3.3-70b-versatile'),
    tools: {
        reviewsTool,
        geocodingTool
    },
    metrics: {
        tone: new ToneConsistencyMetric(),
    },
    memory: new Memory(),
});
