import {createTool} from '@mastra/core/tools';
import {z} from 'zod';

const geocodingTool = createTool({
    id: 'geocoding',
    description: 'Obtaining geographic coordinates (latitude, longitude) using an address via the Google Geocoding API.',
    inputSchema: z.object({
        address: z.string().describe('Physical address for conversion into coordinates (for example, "1600 Amphitheatre Parkway, Mountain View, CA").'),
        language: z.string().optional().default('en').describe('Language of results (for example, "en")'),
    }),
    outputSchema: z.object({
        status: z.string(),
        coordinates: z.string().optional().describe('Coordinates in the format "latitude,longitude"'),
        formatted_address: z.string().optional().describe('Formatted address'),
        location_type: z.string().optional(),
        error_message: z.string().optional(),
    }),
    execute: async ({context}) => {
        const {address, language} = context;
        const apiKey = process.env.MAP_API_KEY;

        if (!apiKey) {
            throw new Error('GOOGLE_GEOCODING_API_KEY not found in environment variables.');
        }

        const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
        url.searchParams.append('address', address);
        url.searchParams.append('key', apiKey);

        if (language) {
            url.searchParams.append('language', language);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            const location = result.geometry.location;

            return {
                status: 'success',
                coordinates: `${location.lat},${location.lng}`,
                formatted_address: result.formatted_address,
                location_type: result.geometry.location_type,
            };
        } else {
            return {
                status: 'error',
                error_message: data.error_message || `Failed to obtain coordinates for the address: ${data.status}`,
            };
        }

    },
});

export default geocodingTool;