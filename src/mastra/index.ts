
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';
import { weatherWorkflow } from './workflows';
import { weatherAgent } from './agents';
import {whoisAgent} from "./agents/whoisAgent";
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, whoisAgent },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  deployer: new CloudflareDeployer({
    scope: '0dbbf7e613df9bcff7e0c7d4706f4cf1',
    projectName: 'mastra',
    // routes: [
    //   {
    //     pattern: 'mastra.sndrmsg.com',
    //     zone_name: 'sndrmsg.com',
    //     custom_domain: true,
    //   },
    // ],
    // workerNamespace: 'MastraAI',
    auth: {
      apiToken: 'bX1FXor2b8h6c-QeFF8kmh__lpWlhR9eSPz8LGyO',
      apiEmail: 'sndrmsg@teambuild.it',
    },
  }),
});