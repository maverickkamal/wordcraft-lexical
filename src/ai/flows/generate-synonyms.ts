'use server';
/**
 * @fileOverview A synonyms AI agent.
 *
 * - generateSynonyms - A function that handles the synonyms generation process.
 * - GenerateSynonymsInput - The input type for the generateSynonyms function.
 * - GenerateSynonymsOutput - The return type for the generateSynonyms function.
 */

import { getGenkitInstance, ai as globalAi } from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSynonymsInputSchema = z.object({
  word: z.string().describe('The word to generate synonyms for.'),
});
export type GenerateSynonymsInput = z.infer<typeof GenerateSynonymsInputSchema>;

const GenerateSynonymsOutputSchema = z.object({
  synonyms: z.array(z.string()).describe('The list of synonyms for the word.'),
});
export type GenerateSynonymsOutput = z.infer<typeof GenerateSynonymsOutputSchema>;

/**
 * Generates synonyms for a given word using a dynamically configured Genkit instance
 * with the provided API key.
 */
export async function generateSynonyms(input: GenerateSynonymsInput, apiKey: string): Promise<GenerateSynonymsOutput> {
  if (!apiKey) {
    throw new Error('API key is required for generating synonyms.');
  }
  const localAi = getGenkitInstance(apiKey);

  const response = await localAi.generate({
    prompt: `You are a thesaurus. Generate a list of synonyms for the word: ${input.word}. Return the synonyms as a JSON array of strings.`,
    // model: 'googleai/gemini-2.0-flash', // Uses default from getGenkitInstance
    output: { schema: GenerateSynonymsOutputSchema, format: 'json' },
  });

  if (!response.output) {
    throw new Error("Failed to generate synonyms: No output from AI.");
  }
  return response.output;
}

// --- Definitions for Genkit CLI and inspection (not directly run by app with user API key) ---
if (globalAi) {
  const synonymPromptDefinition = globalAi.definePrompt({
    name: 'generateSynonymsPromptDefinition',
    input: { schema: GenerateSynonymsInputSchema },
    output: { schema: GenerateSynonymsOutputSchema },
    prompt: `You are a thesaurus. Generate a list of synonyms for the word: {{{word}}}. Return the synonyms as a JSON array of strings.`,
  });

  globalAi.defineFlow(
    {
      name: 'generateSynonymsFlowDefinition',
      inputSchema: GenerateSynonymsInputSchema,
      outputSchema: GenerateSynonymsOutputSchema,
    },
    async (input) => {
      // This flow uses the globally configured 'ai' (e.g., from .env for Genkit CLI)
       if (!globalAi) {
          throw new Error("Global AI not configured for CLI flow execution. Set GOOGLE_API_KEY.");
      }
      const { output } = await synonymPromptDefinition(input);
      if (!output) {
        throw new Error("No output from synonymPromptDefinition in CLI flow execution.");
      }
      return output;
    }
  );
} else {
  console.warn("Skipping definition of generateSynonymsPrompt/Flow for CLI due to uninitialized global 'ai'. Set GOOGLE_API_KEY in .env for CLI functionality.");
}
