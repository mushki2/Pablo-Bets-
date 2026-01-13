'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { AuthProvider } from './contexts/AuthContext';
import './globals.css'; // Assuming you have this for global styles

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SDKProvider acceptCustomStyles debug>
          <TonConnectUIProvider manifestUrl="https://pablo-bets.vercel.app/tonconnect-manifest.json">
            <AuthProvider>
              <div className="glassmorphism-wrapper">
                {children}
              </div>
            </AuthProvider>
          </TonConnectUIProvider>
        </SDKProvider>
      </body>
    </html>
  );
}
