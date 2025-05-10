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
    if (apiKey.length < 10 || apiKey.length > 100) { // Basic length check
        setError('API Key seems invalid. Please check the key and try again.');
        return;
    }
    localStorage.setItem('wordcraftApiKeyV1', apiKey);
    setError('');
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-4 md:p-8 selection:bg-primary/20 selection:text-primary">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl md:text-3xl">API Key Required</CardTitle>
          </div>
          <CardDescription className="text-md">
            Please provide your Google AI Studio API key to use Wordcraft Lexica.
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
              aria-describedby="apiKeyError"
            />
            {error && <p id="apiKeyError" className="text-sm text-destructive mt-1">{error}</p>}
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
                <li>Paste it into the field above. Your key is stored only in your browser&apos;s local storage.</li>
              </ol>
              <p className="mt-3 font-semibold text-foreground">
                Important for Local Development & Genkit CLI:
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                If you are developing locally or want to use Genkit CLI tools (like `genkit start`), you should also create a file named <code className="bg-muted px-1 py-0.5 rounded-sm text-xs">.env</code> (or <code className="bg-muted px-1 py-0.5 rounded-sm text-xs">.env.local</code>) at the root of your project and add your API key like this: <code className="bg-muted px-1 py-0.5 rounded-sm text-xs">GOOGLE_API_KEY=your_actual_api_key_here</code>. This is separate from the key you enter in this dialog, which is for app usage in the browser.
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
    </div>
  );
}
