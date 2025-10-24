# Wordcraft Lexica

Wordcraft Lexica is a Progressive Web App (PWA) thesaurus designed for writers, built with Next.js, Genkit, and Google's Generative AI. It helps you find the perfect words by providing synonyms, antonyms, and context-aware suggestions to enhance your writing while preserving your unique voice.

## Features

-   **Synonym & Antonym Search:** Quickly find synonyms and antonyms for any word.
-   **Context-Aware Suggestions:** Get AI-powered recommendations for the best word (synonym or antonym) based on the sentence or paragraph you provide.
-   **Tone Modulation:** Refine suggestions by selecting a desired tone (e.g., Formal, Conversational, Poetic).
-   **Clarity Guardrail:** Prioritizes clear and concise word choices.
-   **PWA Functionality:** Installable on your device for an app-like experience and offline access to the basic shell.
-   **User-Provided API Key:** Utilizes the user's own Google AI Studio API key for AI features, stored locally in the browser.
-   **Modern UI:** Clean and intuitive interface built with ShadCN UI and Tailwind CSS.
-   **Copy to Clipboard:** Easily copy individual synonyms or antonyms.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/maverickkamal/wordcraft-lexical
    cd wordcraft-lexical
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables (for Local Development & Genkit CLI):**

    Create a `.env.local` file in the root of your project. This file is for your **local development environment** and for using the **Genkit CLI tools**. The API key you enter here will **not** be used by the application when deployed or when users access it through their browser; the application will prompt users for their own API key.

    Add your Google AI Studio API key to the `.env.local` file:
    ```
    GOOGLE_API_KEY=your_google_ai_studio_api_key_here
    ```
    *   **How to get a Google AI Studio API Key:**
        1.  Go to [aistudio.google.com](https://aistudio.google.com).
        2.  Sign in with your Google account.
        3.  Click on "Get API key" (usually in the top left or under a menu).
        4.  Click "Create API key in new project" or select an existing project.
        5.  Copy the generated API key.

### Running the Application Locally

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    ```
    The application will usually be available at `http://localhost:9002`.

2.  **(Optional) Start the Genkit development server:**
    If you want to inspect or test Genkit flows directly using the Genkit CLI and Developer UI:
    ```bash
    npm run genkit:dev
    ```
    Or for watching changes:
    ```bash
    npm run genkit:watch
    ```
    The Genkit Developer UI will typically be available at `http://localhost:4000`.

## Using the Application

1.  **Open the App:** Navigate to the application in your browser (e.g., `http://localhost:9002` if running locally).

2.  **API Key Prompt:**
    *   The first time you attempt to search for a word or get a suggestion, you will be prompted to enter your Google AI Studio API Key.
    *   Follow the instructions in the dialog (or refer to the "How to get a Google AI Studio API Key" section above) to obtain your key.
    *   Enter your key. It will be saved in your browser's local storage for future sessions, so you won't need to enter it repeatedly.

3.  **Search for a Word:**
    *   Enter a word in the main search bar and click "Search".
    *   Results will display synonyms and antonyms for the searched word.
    *   You can click the copy icon next to any synonym or antonym to copy it to your clipboard.

4.  **Get Contextual Suggestions:**
    *   After searching a word, a new section will appear allowing you to get more specific suggestions.
    *   **Context:** Enter the sentence or paragraph where you intend to use the word.
    *   **Desired Tone:** Select a tone from the dropdown (e.g., Conversational, Formal, Poetic).
    *   Click "Get Suggestion".
    *   The AI will analyze your context, the original word's synonyms/antonyms, and the selected tone to suggest the best-fitting word along with an explanation.

## PWA Functionality

Wordcraft Lexica is a Progressive Web App. This means you can:
-   **Add to Home Screen / Install:** On supported browsers (Chrome, Edge, Safari on iOS), you may see a prompt or an icon in the address bar to "Install" the app or "Add to Home Screen." This allows you to launch it like a native app.
-   **Offline Access:** The basic application shell and cached assets can be accessed offline. AI-powered features (search, suggestions) require an internet connection.

## Deployment

This application is optimized for deployment on platforms like [Vercel](https://vercel.com/) or [Firebase Hosting](https://firebase.google.com/docs/hosting).

### Vercel

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Sign up or log in to [Vercel](https://vercel.com/).
3.  Import your Git repository. Vercel should automatically detect it as a Next.js project.
4.  Configure build settings if necessary (usually defaults are fine).
5.  Click "Deploy".
6.  **Important:** Since users provide their own API keys via the in-app modal, you generally do not need to set `GOOGLE_API_KEY` as an environment variable on Vercel for the *application itself* to function for end-users. If you intend to use Genkit's server-side features that might rely on an environment-set key (e.g., for administrative tasks or pre-defined flows not triggered by user-specific API key actions), then you would set it in Vercel's project settings.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **AI Toolkit:** [Genkit (Firebase Genkit)](https://firebase.google.com/docs/genkit)
-   **Generative Model:** [Google Gemini](https://deepmind.google/technologies/gemini/) (via Google AI Studio)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **State Management:** React `useActionState` for form handling.

---

This README provides a comprehensive guide to setting up, running, and using Wordcraft Lexica. Enjoy crafting your words!
