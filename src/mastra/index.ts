import {Mastra} from '@mastra/core/mastra';
import {createLogger} from '@mastra/core/logger';
import {weatherWorkflow} from './workflows';
import {weatherAgent} from './agents/weatherAgent';
import {whoisAgent} from "./agents/whoisAgent";
import {reviewsAgent} from "./agents/reviewsAgent";
import {VercelDeployer} from '@mastra/deployer-vercel';

export const mastra = new Mastra({
    workflows: {weatherWorkflow},
    agents: {weatherAgent, whoisAgent, reviewsAgent},
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