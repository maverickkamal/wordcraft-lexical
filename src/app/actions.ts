"use server";

import type { GenerateSynonymsInput } from "@/ai/flows/generate-synonyms";
import { generateSynonyms } from "@/ai/flows/generate-synonyms";
import type { GenerateAntonymsInput } from "@/ai/flows/generate-antonyms";
import { generateAntonyms } from "@/ai/flows/generate-antonyms";
import type { SuggestBestWordInput } from "@/ai/flows/suggest-best-word";
import { suggestBestWord } from "@/ai/flows/suggest-best-word";

import { z } from "zod";

export interface SearchResultState {
  searchWord?: string;
  synonyms?: string[];
  antonyms?: string[];
  error?: string;
  message?: string; 
  
  contextProvided?: string;
  selectedTone?: string;
  suggestedWord?: string;
  suggestionType?: 'synonym' | 'antonym' | 'none';
  suggestionExplanation?: string;
  suggestionError?: string;
}

const WordSchema = z.string().min(1, "Word cannot be empty.").max(50, "Word is too long.");
const ContextSchema = z.string().min(5, "Context should be at least 5 characters long.").max(500, "Context is too long, please keep it under 500 characters.");
const ToneSchema = z.string().optional();
const ApiKeySchema = z.string().min(10, "API Key seems too short.").max(100, "API Key seems too long."); // Basic validation for API key presence and general form

export async function fetchWordData(
  prevState: SearchResultState,
  formData: FormData
): Promise<SearchResultState> {
  const word = formData.get("word") as string;
  const apiKey = formData.get("apiKey") as string | null;

  const validatedWord = WordSchema.safeParse(word);
  if (!validatedWord.success) {
    return {
      error: validatedWord.error.errors.map((e) => e.message).join(", "),
    };
  }
  const sanitizedWord = validatedWord.data;

  const validatedApiKey = ApiKeySchema.safeParse(apiKey);
  if (!validatedApiKey.success) {
    return {
      searchWord: sanitizedWord,
      error: "A valid API Key is required. " + validatedApiKey.error.errors.map((e) => e.message).join(", "),
    };
  }
  const sanitizedApiKey = validatedApiKey.data;


  try {
    const synonymInput: GenerateSynonymsInput = { word: sanitizedWord };
    const antonymInput: GenerateAntonymsInput = { word: sanitizedWord };

    // Pass the API key to the AI flow functions
    const [synonymResult, antonymResult] = await Promise.all([
      generateSynonyms(synonymInput, sanitizedApiKey),
      generateAntonyms(antonymInput, sanitizedApiKey),
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
  const tone = formData.get("tone") as string;
  const apiKey = formData.get("apiKey") as string | null;
  
  const validatedContext = ContextSchema.safeParse(context);
  if (!validatedContext.success) {
    return {
      ...prevState,
      suggestionError: validatedContext.error.errors.map((e) => e.message).join(", "),
    };
  }
  const validatedTone = ToneSchema.safeParse(tone);
  if (!validatedTone.success) {
    return {
      ...prevState,
      suggestionError: "Invalid tone selected.",
    };
  }

  const validatedApiKey = ApiKeySchema.safeParse(apiKey);
  if (!validatedApiKey.success) {
    return {
      ...prevState,
      suggestionError: "A valid API Key is required for suggestions. " + validatedApiKey.error.errors.map((e) => e.message).join(", "),
    };
  }
  const sanitizedApiKey = validatedApiKey.data;


  const sanitizedContext = validatedContext.data;
  const sanitizedTone = validatedTone.data || "Conversational";


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
    tone: sanitizedTone,
  };

  try {
    // Pass the API key to the AI flow function
    const suggestionResult = await suggestBestWord(input, sanitizedApiKey);
    return {
      ...prevState,
      contextProvided: sanitizedContext,
      selectedTone: sanitizedTone,
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
      selectedTone: sanitizedTone,
      suggestionError: `Failed to fetch suggestion. Reason: ${errorMessage}`,
    };
  }
}

