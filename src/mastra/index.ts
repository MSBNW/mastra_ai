import {Mastra} from '@mastra/core/mastra';
import {createLogger} from '@mastra/core/logger';
import {weatherWorkflow} from './workflows';
import {weatherAgent, whoisAgent, reviewsAgent, mainVoiceAgent} from './agents';
import {VercelDeployer} from '@mastra/deployer-vercel';

// @ts-ignore
export const mastra = new Mastra({
    workflows: {weatherWorkflow},
    agents: {weatherAgent, whoisAgent, reviewsAgent, mainVoiceAgent},
    logger: createLogger({
        name: 'Mastra',
        level: 'info',
    }),
    deployer: new VercelDeployer({
        teamId: 'main-projects-e1aed16b',
        projectName: 'mastra-ai',
        token: 'YXtsR3PDwpgZ6HyEdrBEQ3g0'
    }),
});