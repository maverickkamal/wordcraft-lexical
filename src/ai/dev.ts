
import { config } from 'dotenv';
// Load environment variables from .env file (especially GOOGLE_API_KEY for local Genkit CLI)
// This should be one of the first lines to ensure env vars are available for subsequent imports.
config(); 

import '@/ai/flows/generate-antonyms.ts';
import '@/ai/flows/generate-synonyms.ts';
import '@/ai/flows/suggest-best-word.ts';
