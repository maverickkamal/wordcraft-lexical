import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import ServiceWorkerRegistrar from '@/components/service-worker-registrar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Wordcraft Lexica',
  description: 'A thesaurus app for writers, built with Next.js and GenAI.',
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#008080' }, // Teal, matches light theme primary
    { media: '(prefers-color-scheme: dark)', color: '#00b3b3' },  // Brighter Teal, matches dark theme primary
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default', // Or 'black', 'black-translucent'
    title: 'Wordcraft',
    // startupImage: [...] // Optional: specify startup images for different devices
  },
  icons: {
    apple: 'https://picsum.photos/180/180?hint=app+icon+apple', // Placeholder for apple-touch-icon
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
