import {createTool} from '@mastra/core/tools';
import {z} from 'zod';
import {log} from "node:util";

// Types for reviews tool
interface ReviewItem {
    review_id: string;
    review_rating_value: string | number;
    review_text: string;
    review_timestamp: string;
    reviewer_image_url?: string;
    reviewer_name: string;
    review_source: string;
}

// DataForSEO API endpoints mapping
const REVIEW_ENDPOINTS = (endpointType = 'task_post') => {
    return {
        google: `business_data/google/reviews/${endpointType}`,
        trustpilot: `business_data/trustpilot/reviews/${endpointType}`
    };
};

const reviewsTool = createTool({
    id: 'get-reviews',
    description: 'Get customer reviews for a business from Google or Trustpilot',
    inputSchema: z.object({
        reviewType: z.enum(['google', 'trustpilot']).describe('Source of reviews (google or trustpilot)'),
        coordinates: z.string().optional().describe('Location coordinates (e.g., "40.712776,-74.005974")'),
        keyword: z.string().optional().describe('Business name or keyword to search for'),
        language: z.string().optional().default('english').describe('Language for reviews'),
        domain: z.string().optional().describe('Domain name (required for Trustpilot)'),
        place_id: z.string().optional().describe('Google Place ID (can be used instead of coordinates/keyword for Google)'),
        limit: z.number().optional().default(10).describe('Maximum number of reviews to retrieve'),
    }),
    outputSchema: z.object({
        status: z.string().optional(),
        reviews: z.array(z.object({
            review_id: z.string(),
            review_rating_value: z.union([z.string(), z.number()]),
            review_text: z.string(),
            review_timestamp: z.string(),
            reviewer_image_url: z.string().optional(),
            reviewer_name: z.string(),
            review_source: z.string(),
        }).optional()),
        taskId: z.string().optional(),
    }),
    execute: async ({context}) => {
        console.log('execute:', context);
        return await getReviews(context);
    },
});

export default reviewsTool;

// Helper function to make DataForSEO API requests
const dataForSeoRequest = async (body: any, endpoint: string, method = 'post') => {
    console.log('!! INIT DATAFORSEO REQUEST');
    const url = `https://api.dataforseo.com/v3/${endpoint}`;
    const headers = {
        'Authorization': `Basic ${process.env.DATAFORSEO_API_KEY}`,
        'Content-Type': 'application/json'
    };

    try {
        let response;

        if (method === 'post') {
            response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
        } else {
            response = await fetch(url, {headers});
        }


        if (!response.ok) {
            throw new Error(`DataForSEO API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data?.tasks?.[0];
    } catch (error: any) {
        console.error('DataForSEO request error:', error.message);
        throw error;
    }
};

// Process reviews from DataForSEO response
const processReviews = (data: any, reviewType: string): ReviewItem[] => {
    if (!data?.result?.[0]?.items?.length) {
        return [];
    }

    const items = data.result[0].items;
    let reviews: ReviewItem[] = [];

    if (reviewType === 'google' || reviewType === 'trustpilot') {
        reviews = items.map((item: any) => ({
            review_id: item.review_id || (item.review_text ? hashString(item.review_text) : Math.random().toString(16).slice(2)),
            review_rating_value: item?.rating?.value || '',
            review_text: item.review_text || '',
            review_timestamp: item.timestamp || '',
            reviewer_image_url: item?.user_profile?.url || item?.profile_image_url || '',
            reviewer_name: item?.user_profile?.name || item?.profile_name || '',
            review_source: reviewType
        }));
    } else if (reviewType === 'yelp') {
        reviews = items.map((item: any) => ({
            review_id: item.review_id || '',
            review_rating_value: item?.rating?.value || '',
            review_text: item.review_text || '',
            review_timestamp: item.timestamp || '',
            reviewer_image_url: item?.user_profile?.image_url || '',
            reviewer_name: item?.user_profile?.name || '',
            review_source: 'yelp'
        }));
    }

    // Filter for reviews with rating >= 4
    return reviews.filter(item =>
        !!item.review_text &&
        item.review_rating_value &&
        Number(item.review_rating_value) >= 4
    );
};

// Simple string hash function
const hashString = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
};

// Poll for task results with retries
const pollTaskResults = async (reviewType: string, taskId: string, maxAttempts = 10): Promise<any> => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const reviewEndpoints: Record<'google' | 'trustpilot', string> = REVIEW_ENDPOINTS(`task_get/${taskId}`);
            const result = await dataForSeoRequest([], reviewEndpoints[reviewType as 'google' | 'trustpilot'], 'get');

            if (result?.status_code === 20000) {
                return result;
            }

            // Wait before trying again
            await new Promise(resolve => setTimeout(resolve, 3000));
        } catch (error) {
            console.error(`Error checking task status (attempt ${attempt + 1}/${maxAttempts}):`, error);
            if (attempt === maxAttempts - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    throw new Error('Max polling attempts reached');
};

const getReviews = async (params: any) => {
    const {
        reviewType,
        coordinates,
        keyword,
        language = 'english',
        limit = 10,
        place_id = '',
        domain = ''
    } = params;

    if (!reviewType) {
        throw new Error('reviewType is required');
    }
    if (reviewType === 'google' && !place_id && (!coordinates || !keyword)) {
        throw new Error('For Google reviews, either place_id or both coordinates and keyword are required');
    }
    if (reviewType === 'trustpilot' && !domain) {
        throw new Error('domain is required for Trustpilot reviews');
    }

    // Prepare request body
    const body: any = {
        language_name: language,
        depth: limit,
        priority: 2
    };

    // Add service-specific parameters
    if (reviewType === 'google') {
        if (place_id) {
            body.place_id = place_id;
        } else {
            body.location_coordinate =coordinates;
            body.keyword = keyword;
        }
    } else if (reviewType === 'trustpilot') {
        body.domain = domain;
    }

    const reviewEndpoints: Record<'google' | 'trustpilot', string> = REVIEW_ENDPOINTS();
    const taskResult = await dataForSeoRequest([body], reviewEndpoints[reviewType as 'google' | 'trustpilot']);

    if (!taskResult?.id) {
        return {
            status: 'error',
            reviews: [],
            taskId: ''
        };
    }

    const taskId = taskResult.id;

    // Poll for results
    const reviewsResult = await pollTaskResults(reviewType, taskId);

    if (reviewsResult?.status_code === 20000) {
        const reviews = processReviews(reviewsResult, reviewType);

        if (reviews.length === 0) {
            return {
                status: 'no_reviews_found',
                reviews: [],
                taskId
            };
        }

        return {
            status: 'success',
            reviews,
            taskId
        };
    }

    // Handle no results case
    return {
        status: reviewsResult?.status_message || 'pending',
        reviews: [],
        taskId
    };

};