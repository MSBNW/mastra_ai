import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const whoisTool = createTool({
  id: 'get-whois',
  description: 'Get domain ETV information',
  inputSchema: z.object({
    domain: z.string().describe('Domain name (e.g., example.com)'),
  }),
  outputSchema: z.object({
    domainName: z.string(),
    etv: z.string().optional(),
  }),
  execute: async ({ context }) => {
    return await getWhoisInfo(context.domain);
  },
});

export default whoisTool;

const getWhoisInfo = async (domain: string) => {
  try {
    const response = await fetch(
        'https://api.dataforseo.com/v3/domain_analytics/whois/overview/live',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic bWlrZUB0ZWFtYnVpbGQuaXQ6TUhRTE1VSUxFYW1PUzRIdA'
          },
          body: JSON.stringify([
            {
              limit: 1,
              filters: [
                ['domain', '=', domain]
              ],
            }
          ]),
        }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch dataforseo data: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      domainName: domain,
      etv: data?.tasks?.[0]?.result?.[0]?.items?.[0]?.metrics?.organic?.etv || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching dataforseo data:', error);
    return {
      domainName: domain,
      etv: 'Error fetching data',
    };
  }
};