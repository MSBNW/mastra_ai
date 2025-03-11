
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';
import {whoisAgent} from "./agents/whoisAgent";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, whoisAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
