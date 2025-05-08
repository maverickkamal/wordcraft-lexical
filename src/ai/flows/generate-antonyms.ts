'use server';

/**
 * @fileOverview A flow to generate antonyms for a given word.
 *
 * - generateAntonyms - A function that handles the antonym generation process.
 * - GenerateAntonymsInput - The input type for the generateAntonyms function.
 * - GenerateAntonymsOutput - The return type for the generateAntonyms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAntonymsInputSchema = z.object({
  word: z.string().describe('The word to generate antonyms for.'),
});
export type GenerateAntonymsInput = z.infer<typeof GenerateAntonymsInputSchema>;

const GenerateAntonymsOutputSchema = z.object({
  antonyms: z.array(z.string()).describe('A list of antonyms for the given word.'),
});
export type GenerateAntonymsOutput = z.infer<typeof GenerateAntonymsOutputSchema>;

export async function generateAntonyms(input: GenerateAntonymsInput): Promise<GenerateAntonymsOutput> {
  return generateAntonymsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAntonymsPrompt',
  input: {schema: GenerateAntonymsInputSchema},
  output: {schema: GenerateAntonymsOutputSchema},
  prompt: `You are a helpful thesaurus assistant.  Given a word, you will provide a list of antonyms for that word.  Return the antonyms as a JSON array of strings.

Word: {{{word}}}`,
});

const generateAntonymsFlow = ai.defineFlow(
  {
    name: 'generateAntonymsFlow',
    inputSchema: GenerateAntonymsInputSchema,
    outputSchema: GenerateAntonymsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
