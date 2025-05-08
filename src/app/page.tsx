'use client'

import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WordResults } from "@/components/word-results";
import { fetchWordData, SearchResultState } from "./actions";
import { BookText, Search, AlertCircle, Info, Loader2 } from "lucide-react";

const initialState: SearchResultState = {
  synonyms: [],
  antonyms: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
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

export default function HomePage() {
  const [state, formAction] = useFormState(fetchWordData, initialState);

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
        <form action={formAction} className="flex flex-col sm:flex-row items-center gap-3 mb-8 p-4 sm:p-6 bg-card rounded-lg shadow-md">
          <Input
            type="text"
            name="word"
            placeholder="Enter a word (e.g., happy)"
            required
            className="flex-grow text-base h-12"
            aria-label="Word to search"
          />
          <SubmitButton />
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

        {!state?.searchWord && !state?.error && !state?.message && (
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
