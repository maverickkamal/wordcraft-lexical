'use server';
/**
 * @fileOverview A synonyms AI agent.
 *
 * - generateSynonyms - A function that handles the synonyms generation process.
 * - GenerateSynonymsInput - The input type for the generateSynonyms function.
 * - GenerateSynonymsOutput - The return type for the generateSynonyms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSynonymsInputSchema = z.object({
  word: z.string().describe('The word to generate synonyms for.'),
});
export type GenerateSynonymsInput = z.infer<typeof GenerateSynonymsInputSchema>;

const GenerateSynonymsOutputSchema = z.object({
  synonyms: z.array(z.string()).describe('The list of synonyms for the word.'),
});
export type GenerateSynonymsOutput = z.infer<typeof GenerateSynonymsOutputSchema>;

export async function generateSynonyms(input: GenerateSynonymsInput): Promise<GenerateSynonymsOutput> {
  return generateSynonymsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSynonymsPrompt',
  input: {schema: GenerateSynonymsInputSchema},
  output: {schema: GenerateSynonymsOutputSchema},
  prompt: `You are a thesaurus. Generate a list of synonyms for the word: {{{word}}}. Return the synonyms as a JSON array of strings.`,
});

const generateSynonymsFlow = ai.defineFlow(
  {
    name: 'generateSynonymsFlow',
    inputSchema: GenerateSynonymsInputSchema,
    outputSchema: GenerateSynonymsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
