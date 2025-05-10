'use server';

/**
 * @fileOverview A flow to generate antonyms for a given word.
 *
 * - generateAntonyms - A function that handles the antonym generation process.
 * - GenerateAntonymsInput - The input type for the generateAntonyms function.
 * - GenerateAntonymsOutput - The return type for the generateAntonyms function.
 */

import { getGenkitInstance, ai as globalAi } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAntonymsInputSchema = z.object({
  word: z.string().describe('The word to generate antonyms for.'),
});
export type GenerateAntonymsInput = z.infer<typeof GenerateAntonymsInputSchema>;

const GenerateAntonymsOutputSchema = z.object({
  antonyms: z.array(z.string()).describe('A list of antonyms for the given word.'),
});
export type GenerateAntonymsOutput = z.infer<typeof GenerateAntonymsOutputSchema>;

/**
 * Generates antonyms for a given word using a dynamically configured Genkit instance
 * with the provided API key.
 */
export async function generateAntonyms(input: GenerateAntonymsInput, apiKey: string): Promise<GenerateAntonymsOutput> {
  if (!apiKey) {
    throw new Error('API key is required for generating antonyms.');
  }
  const localAi = getGenkitInstance(apiKey);

  const response = await localAi.generate({
    prompt: `You are a helpful thesaurus assistant. Given a word, you will provide a list of antonyms for that word. Return the antonyms as a JSON array of strings.

Word: ${input.word}`,
    output: { schema: GenerateAntonymsOutputSchema, format: 'json' },
    // model: 'googleai/gemini-2.0-flash', // Uses default from getGenkitInstance
  });

  if (!response.output) {
    throw new Error("Failed to generate antonyms: No output from AI.");
  }
  return response.output;
}

// --- Definitions for Genkit CLI and inspection (not directly run by app with user API key) ---
if (globalAi) {
  const antonymsPromptDefinition = globalAi.definePrompt({
    name: 'generateAntonymsPromptDefinition',
    input: { schema: GenerateAntonymsInputSchema },
    output: { schema: GenerateAntonymsOutputSchema },
    prompt: `You are a helpful thesaurus assistant.  Given a word, you will provide a list of antonyms for that word.  Return the antonyms as a JSON array of strings.

Word: {{{word}}}`,
  });

  globalAi.defineFlow(
    {
      name: 'generateAntonymsFlowDefinition',
      inputSchema: GenerateAntonymsInputSchema,
      outputSchema: GenerateAntonymsOutputSchema,
    },
    async (input) => {
      // This flow uses the globally configured 'ai' (e.g., from .env for Genkit CLI)
      if (!globalAi) { // Should be captured by the outer if, but good for safety
          throw new Error("Global AI not configured for CLI flow execution. Set GOOGLE_API_KEY.");
      }
      const { output } = await antonymsPromptDefinition(input);
      if (!output) {
        throw new Error("No output from antonymsPromptDefinition in CLI flow execution.");
      }
      return output;
    }
  );
} else {
  console.warn("Skipping definition of generateAntonymsPrompt/Flow for CLI due to uninitialized global 'ai'. Set GOOGLE_API_KEY in .env for CLI functionality.");
}
