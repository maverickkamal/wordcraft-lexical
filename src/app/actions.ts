// @ts-nocheck
// TODO: Remove @ts-nocheck and fix errors
"use server";

import { generateSynonyms, GenerateSynonymsInput } from "@/ai/flows/generate-synonyms";
import { generateAntonyms, GenerateAntonymsInput } from "@/ai/flows/generate-antonyms";
import { z } from "zod";

export interface SearchResultState {
  searchWord?: string;
  synonyms?: string[];
  antonyms?: string[];
  error?: string;
  message?: string; // For informational messages like "No results found"
}

const WordSchema = z.string().min(1, "Word cannot be empty.").max(50, "Word is too long.");

export async function fetchWordData(
  prevState: SearchResultState,
  formData: FormData
): Promise<SearchResultState> {
  const word = formData.get("word") as string;

  const validatedWord = WordSchema.safeParse(word);
  if (!validatedWord.success) {
    return {
      error: validatedWord.error.errors.map((e) => e.message).join(", "),
    };
  }

  const sanitizedWord = validatedWord.data;

  try {
    const synonymInput: GenerateSynonymsInput = { word: sanitizedWord };
    const antonymInput: GenerateAntonymsInput = { word: sanitizedWord };

    // Fetch in parallel
    const [synonymResult, antonymResult] = await Promise.all([
      generateSynonyms(synonymInput),
      generateAntonyms(antonymInput),
    ]);
    
    const synonyms = synonymResult?.synonyms || [];
    const antonyms = antonymResult?.antonyms || [];

    if (synonyms.length === 0 && antonyms.length === 0) {
      return {
        searchWord: sanitizedWord,
        synonyms: [],
        antonyms: [],
        message: `No synonyms or antonyms found for "${sanitizedWord}".`,
      };
    }

    return {
      searchWord: sanitizedWord,
      synonyms,
      antonyms,
    };
  } catch (err) {
    console.error("AI API Error:", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while fetching data.";
    return {
      searchWord: sanitizedWord, // Still return the search word on error
      error: `Failed to fetch results for "${sanitizedWord}". Reason: ${errorMessage}`,
    };
  }
}
