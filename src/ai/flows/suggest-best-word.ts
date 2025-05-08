'use server';
/**
 * @fileOverview A flow to suggest the best word (synonym or antonym) based on context and desired tone.
 *
 * - suggestBestWord - A function that handles the word suggestion process.
 * - SuggestBestWordInput - The input type for the suggestBestWord function.
 * - SuggestBestWordOutput - The return type for the suggestBestWord function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBestWordInputSchema = z.object({
  originalWord: z.string().describe('The original word that was searched.'),
  context: z.string().describe('The context provided by the user where the word would be used.'),
  synonyms: z.array(z.string()).describe('A list of synonyms for the original word.'),
  antonyms: z.array(z.string()).describe('A list of antonyms for the original word.'),
  tone: z.string().optional().describe('The desired tone for the suggestion (e.g., Formal, Conversational, Poetic). Defaults to Conversational if not provided.'),
});
export type SuggestBestWordInput = z.infer<typeof SuggestBestWordInputSchema>;

const SuggestBestWordOutputSchema = z.object({
  suggestedWord: z.string().optional().describe('The suggested word. Could be a synonym or an antonym. Omitted if no suitable word is found.'),
  suggestionType: z.enum(['synonym', 'antonym', 'none']).describe('Indicates if the suggested word is a synonym, an antonym, or if no suitable suggestion was found.'),
  explanation: z.string().describe('An explanation for why the word was suggested, or why no word was suitable.'),
});
export type SuggestBestWordOutput = z.infer<typeof SuggestBestWordOutputSchema>;

export async function suggestBestWord(input: SuggestBestWordInput): Promise<SuggestBestWordOutput> {
  return suggestBestWordFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBestWordPrompt',
  input: {schema: SuggestBestWordInputSchema},
  output: {schema: SuggestBestWordOutputSchema},
  prompt: `You are an expert linguistic assistant, acting as a co-pilot to a writer, helping them choose the most appropriate word while preserving their unique voice. Prioritize simplicity and clarity in your suggestions.

The user searched for the word "{{{originalWord}}}".
They provided the following context for its use: "{{{context}}}"
The desired tone is: {{#if tone}}{{{tone}}}{{else}}Conversational{{/if}}.

Available synonyms for "{{{originalWord}}}" are:
{{#if synonyms.length}}
{{#each synonyms}}
- {{{this}}}
{{/each}}
{{else}}
(No synonyms provided)
{{/if}}

Available antonyms for "{{{originalWord}}}" are:
{{#if antonyms.length}}
{{#each antonyms}}
- {{{this}}}
{{/each}}
{{else}}
(No antonyms provided)
{{/if}}

Based on the provided context and desired tone ({{#if tone}}{{{tone}}}{{else}}Conversational{{/if}}), analyze the synonyms and antonyms. Consider the tone and register implied by the context.
Suggest the single best word (either one of the synonyms or one of the antonyms) that fits the context and improves the writing. Avoid jargon or overly dense suggestions unless the context and tone (e.g., Technical, Formal) specifically call for it.

If a fitting word is found, provide its type (synonym or antonym) and a concise explanation for your choice, focusing on how it enhances clarity and fits the tone.
If no word from the provided lists is suitable for the context, indicate that no suitable suggestion was found and explain why, rather than suggesting an alternative that doesn't quite fit.

Respond with the suggested word, its type, and your explanation.
If no word is suitable, set suggestionType to "none", omit suggestedWord, and provide an explanation.
`,
});

const suggestBestWordFlow = ai.defineFlow(
  {
    name: 'suggestBestWordFlow',
    inputSchema: SuggestBestWordInputSchema,
    outputSchema: SuggestBestWordOutputSchema,
  },
  async (input: SuggestBestWordInput) => {
    if (input.synonyms.length === 0 && input.antonyms.length === 0) {
      return {
        suggestionType: 'none',
        explanation: `No synonyms or antonyms were provided for "${input.originalWord}", so no suggestion can be made for the context.`,
      };
    }

    const {output} = await prompt({
        ...input,
        tone: input.tone || 'Conversational', // Ensure tone has a default for the prompt
    });
    return output!;
  }
);
