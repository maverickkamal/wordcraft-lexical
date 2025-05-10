
'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound, ExternalLink } from 'lucide-react';

interface ApiKeyGateProps {
  onKeySaved: () => void;
}

export function ApiKeyGate({ onKeySaved }: ApiKeyGateProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    localStorage.setItem('wordcraftApiKeyV1', apiKey);
    setError('');
    onKeySaved();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 md:p-8 selection:bg-primary/20 selection:text-primary">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl md:text-3xl">Welcome to Wordcraft Lexica!</CardTitle>
          </div>
          <CardDescription className="text-md">
            To get started, please provide your Google AI Studio API key.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-foreground mb-1">
              Google AI Studio API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className="text-base h-11"
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>

          <Alert variant="default" className="bg-secondary/30">
            <ExternalLink className="h-4 w-4" />
            <AlertTitle className="font-semibold">How to get your API Key:</AlertTitle>
            <AlertDescription>
              <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
                <li>
                  Go to{' '}
                  <a
                    href="https://aistudio.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80"
                  >
                    aistudio.google.com
                  </a>
                  .
                </li>
                <li>Sign in with your Google account.</li>
                <li>Click on "Get API key" (usually in the top left or under a menu).</li>
                <li>Click "Create API key in new project" or select an existing project.</li>
                <li>Copy the generated API key.</li>
                <li>Paste it into the field above.</li>
              </ol>
              <p className="mt-3 font-semibold text-foreground">
                Important for Deployment:
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For the application to work correctly when deployed (e.g., on Vercel), you also need to set this API key as an environment variable named <code className="bg-muted px-1 py-0.5 rounded-sm text-xs">GOOGLE_API_KEY</code> in your hosting provider's project settings. For local development, you can add it to a <code className="bg-muted px-1 py-0.5 rounded-sm text-xs">.env.local</code> file at the root of your project (<code className="bg-muted px-1 py-0.5 rounded-sm text-xs">GOOGLE_API_KEY=your_key_here</code>).
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveKey} className="w-full text-lg py-3 h-auto">
            Save & Continue
          </Button>
        </CardFooter>
      </Card>
      <footer className="w-full max-w-3xl mt-10 text-center text-muted-foreground text-xs">
        <p>&copy; {new Date().getFullYear()} Wordcraft Lexica. Powered by Generative AI.</p>
      </footer>
    </div>
  );
}
