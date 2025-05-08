// @ts-nocheck
// TODO: Remove @ts-nocheck and fix errors
"use server";

import { generateSynonyms, GenerateSynonymsInput } from "@/ai/flows/generate-synonyms";
import { generateAntonyms, GenerateAntonymsInput } from "@/ai/flows/generate-antonyms";
import { suggestBestWord, SuggestBestWordInput } from "@/ai/flows/suggest-best-word";
import { z } from "zod";

export interface SearchResultState {
  searchWord?: string;
  synonyms?: string[];
  antonyms?: string[];
  error?: string;
  message?: string; 
  
  contextProvided?: string;
  suggestedWord?: string;
  suggestionType?: 'synonym' | 'antonym' | 'none';
  suggestionExplanation?: string;
  suggestionError?: string;
}

const WordSchema = z.string().min(1, "Word cannot be empty.").max(50, "Word is too long.");
const ContextSchema = z.string().min(5, "Context should be at least 5 characters long.").max(500, "Context is too long, please keep it under 500 characters.");

export async function fetchWordData(
  prevState: SearchResultState, // Not directly used for return structure, but part of useActionState signature
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
    console.error("AI API Error (fetchWordData):", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while fetching data.";
    return {
      searchWord: sanitizedWord, 
      error: `Failed to fetch results for "${sanitizedWord}". Reason: ${errorMessage}`,
    };
  }
}

export async function fetchWordSuggestion(
  prevState: SearchResultState, 
  formData: FormData
): Promise<SearchResultState> {
  const context = formData.get("context") as string;
  const originalWord = formData.get("originalWord") as string;
  
  const validatedContext = ContextSchema.safeParse(context);
  if (!validatedContext.success) {
    return {
      ...prevState,
      suggestionError: validatedContext.error.errors.map((e) => e.message).join(", "),
    };
  }

  const sanitizedContext = validatedContext.data;

  if (!prevState.searchWord || !prevState.synonyms || !prevState.antonyms) {
    return {
      ...prevState,
      suggestionError: "Original search data is missing. Please search for a word first.",
    };
  }
  
  if (originalWord !== prevState.searchWord) {
      return {
          ...prevState,
          suggestionError: "Mismatch in original word. Please try again.",
      };
  }

  const input: SuggestBestWordInput = {
    originalWord: prevState.searchWord,
    context: sanitizedContext,
    synonyms: prevState.synonyms,
    antonyms: prevState.antonyms,
  };

  try {
    const suggestionResult = await suggestBestWord(input);
    return {
      ...prevState,
      contextProvided: sanitizedContext,
      suggestedWord: suggestionResult.suggestedWord,
      suggestionType: suggestionResult.suggestionType,
      suggestionExplanation: suggestionResult.explanation,
      suggestionError: undefined, 
    };
  } catch (err) {
    console.error("AI API Error (fetchWordSuggestion):", err);
    const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred while fetching suggestion.";
    return {
      ...prevState,
      contextProvided: sanitizedContext, 
      suggestionError: `Failed to fetch suggestion. Reason: ${errorMessage}`,
    };
  }
}