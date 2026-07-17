// API configuration
// In production (Vercel), /api routes are serverless functions
// In local dev, use the Express dev server on port 3001

const isProd = import.meta.env.PROD;

export const AI_API_URL = isProd ? '/api/score' : 'http://localhost:3001/api/score';
