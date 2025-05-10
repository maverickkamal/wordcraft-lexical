
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// The googleAI() plugin will automatically look for the GOOGLE_API_KEY 
// (or GCLOUD_API_KEY) environment variable if `apiKey` is not explicitly provided.
// Ensure your .env file (for local dev) or Vercel environment variables (for deployment)
// has GOOGLE_API_KEY set.
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash', // Default model, can be overridden in specific prompts/flows
});
