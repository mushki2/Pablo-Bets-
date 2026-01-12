'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { SDKProvider } from '@twa-dev/sdk-react';

const inter = Inter({ subsets: ['latin'] });

// Since we are using 'use client', we can't export metadata from here.
// It should be defined in a server component or in a metadata file.
// For the purpose of this MVP, we will omit it from this file.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SDKProvider>
          <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
            <div className="glassmorphism-wrapper">
              {children}
            </div>
          </TonConnectUIProvider>
        </SDKProvider>
      </body>
    </html>
  );
}
