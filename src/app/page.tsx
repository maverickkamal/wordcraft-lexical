
'use client'

import { useActionState } from "react"; 
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordResults } from "@/components/word-results";
import { fetchWordData, fetchWordSuggestion, SearchResultState } from "./actions";
import { BookText, Search, AlertCircle, Info, Loader2, MessageSquareQuote, Sparkles } from "lucide-react";

const initialState: SearchResultState = {
  synonyms: [],
  antonyms: [],
  searchWord: undefined,
  error: undefined,
  message: undefined,
  contextProvided: undefined,
  suggestedWord: undefined,
  suggestionType: undefined,
  suggestionExplanation: undefined,
  suggestionError: undefined,
};

function WordSearchSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" name="actionType" value="fetchWordData" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-0 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </>
      )}
    </Button>
  );
}

function SuggestionSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" name="actionType" value="fetchWordSuggestion" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Suggestion...
        </>
      ) : (
        <>
          <Sparkles className="mr-0 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Get Suggestion</span>
        </>
      )}
    </Button>
  );
}


export default function HomePage() {
  const [state, dispatchFormAction] = useActionState(
    async (prevState: SearchResultState, formData: FormData) => {
      const actionType = formData.get('actionType');
      
      if (actionType === 'fetchWordData') {
        const nextSearchState = await fetchWordData(prevState, formData);
        return {
          ...nextSearchState, 
          contextProvided: undefined,
          suggestedWord: undefined,
          suggestionType: undefined,
          suggestionExplanation: undefined,
          suggestionError: undefined,
        };
      } else if (actionType === 'fetchWordSuggestion') {
        return fetchWordSuggestion(prevState, formData);
      }
      return prevState;
    },
    initialState
  );

  const showSuggestionSection = state.searchWord && (state.synonyms && state.synonyms.length > 0 || state.antonyms && state.antonyms.length > 0) && !state.error;

  return (
    <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-4 md:p-8 selection:bg-primary/20 selection:text-primary">
      <header className="w-full max-w-3xl mb-8 md:mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookText className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Wordcraft Lexica
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Your friendly thesaurus for writers.
        </p>
      </header>

      <main className="w-full max-w-3xl">
        <form action={dispatchFormAction} className="flex flex-col sm:flex-row items-center gap-3 mb-8 p-4 sm:p-6 bg-card rounded-lg shadow-md">
          <Input
            type="text"
            name="word"
            placeholder="Enter a word (e.g., happy)"
            required
            className="flex-grow text-base h-12"
            aria-label="Word to search"
            // defaultValue={state.searchWord || ""} // Retains input on error, could be "" if preferred
          />
          <WordSearchSubmitButton />
        </form>

        {state?.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state?.message && !state.error && (
          <Alert variant="default" className="mb-6 bg-card">
             <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}
        
        {state?.searchWord && !state.error && (state.synonyms && state.synonyms.length > 0 || state.antonyms && state.antonyms.length > 0) && (
          <WordResults
            searchWord={state.searchWord}
            synonyms={state.synonyms || []}
            antonyms={state.antonyms || []}
          />
        )}

        {showSuggestionSection && (
          <section className="mt-10 p-4 sm:p-6 bg-card rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareQuote className="h-6 w-6 text-primary" />
              <h3 className="text-xl md:text-2xl font-semibold text-primary">
                Need a More Specific Suggestion?
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Provide some context for how you intend to use "{state.searchWord}", and we'll suggest the best fit from its synonyms or antonyms.
            </p>
            
            <form action={dispatchFormAction} className="space-y-4">
              <Textarea
                name="context"
                placeholder="e.g., 'She felt ___ after receiving the good news.'"
                rows={3}
                required
                className="text-base"
                aria-label="Context for word usage"
                defaultValue={state.contextProvided || ""}
              />
              <input type="hidden" name="originalWord" value={state.searchWord!} />
              <SuggestionSubmitButton />
            </form>

            {state?.suggestionError && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Suggestion Error</AlertTitle>
                <AlertDescription>{state.suggestionError}</AlertDescription>
              </Alert>
            )}

            {state?.suggestedWord && state.suggestionType !== 'none' && !state.suggestionError && (
              <Card className="mt-6 shadow-sm bg-background">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Our Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg">
                    For the context you provided, consider using: <strong className="text-primary">{state.suggestedWord}</strong> ({state.suggestionType}).
                  </p>
                  <div>
                    <h4 className="font-semibold mb-1">Reasoning:</h4>
                    <p className="text-muted-foreground">{state.suggestionExplanation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
             {state?.suggestionType === 'none' && state.suggestionExplanation && !state.suggestionError && (
              <Alert variant="default" className="mt-6 bg-background">
                <Info className="h-4 w-4" />
                <AlertTitle>Suggestion Result</AlertTitle>
                <AlertDescription>{state.suggestionExplanation}</AlertDescription>
              </Alert>
            )}
          </section>
        )}

        {!state?.searchWord && !state?.error && !state?.message && !showSuggestionSection && (
          <div className="text-center text-muted-foreground mt-12 p-6 bg-card rounded-lg shadow">
            <Info className="h-12 w-12 mx-auto mb-4 text-primary/70" />
            <p className="text-lg">
              Enter a word above to discover its synonyms and antonyms.
            </p>
            <p className="text-sm mt-2">
              Perfect for enhancing your writing and expanding your vocabulary!
            </p>
          </div>
        )}
      </main>
      <footer className="w-full max-w-3xl mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Wordcraft Lexica. All rights reserved.</p>
        <p>Powered by Generative AI.</p>
      </footer>
    </div>
  );
}

