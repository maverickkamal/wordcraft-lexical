import { config } from 'dotenv';
config();

import '@/ai/flows/generate-antonyms.ts';
import '@/ai/flows/generate-synonyms.ts';
import '@/ai/flows/suggest-best-word.ts';