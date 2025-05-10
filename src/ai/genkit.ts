import { genkit, Genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { config } from 'dotenv';

// Load environment variables from .env file (especially GOOGLE_API_KEY for local Genkit CLI)
// This is primarily for 'genkit start' and other CLI tools.
config(); 

/**
 * Creates a new Genkit instance configured with the provided API key.
 * This is used for requests initiated by users who provide their own API key.
 * @param apiKey The Google AI Studio API key.
 * @returns A configured Genkit instance.
 */
export function getGenkitInstance(apiKey: string): Genkit {
  if (!apiKey) {
    // This should ideally be caught before calling this function (e.g., in server actions)
    throw new Error("API key is required to initialize Genkit client for user request.");
  }
  return genkit({
    plugins: [googleAI({ apiKey })], // Configure googleAI plugin with the user's key
    model: 'googleai/gemini-2.0-flash', // Default model, can be overridden
  });
}

/**
 * Global 'ai' instance.
 * This instance attempts to initialize using the GOOGLE_API_KEY from the environment.
 * It's primarily intended for use by Genkit CLI tools (e.g., inspecting flows) and
 * for defining prompts/flows that can be discovered by these tools.
 * If GOOGLE_API_KEY is not set, this instance might not be fully functional for generation,
 * but flow definitions might still be possible.
 * Application requests from users providing their own keys will use `getGenkitInstance`.
 */
export let ai: Genkit | null = null; 

try {
  ai = genkit({
    plugins: [googleAI()], // Attempts to use GOOGLE_API_KEY from environment
    model: 'googleai/gemini-2.0-flash',
  });
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.warn(
    "Global Genkit 'ai' instance could not be initialized (GOOGLE_API_KEY likely missing or invalid). " +
    "This will affect Genkit CLI tools. App functionality using user-provided keys should still work. Error: ",
    errorMessage
  );
  // 'ai' remains null. Flow files attempting to use it for definitions will need to handle this.
}
