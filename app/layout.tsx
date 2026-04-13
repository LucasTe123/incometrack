// Root layout
// app/layout.tsx

import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppProviders from '@/components/AppProviders';

export const metadata: Metadata = {
  title: 'IncomeTrack — Business Income Tracker',
  description: 'Track your daily business income across Cash, Card, and QR payments with real-time sync.',
  keywords: ['income tracker', 'business', 'cash', 'card', 'payment', 'finance'],
  authors: [{ name: 'IncomeTrack' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'IncomeTrack',
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#7C3AED',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
