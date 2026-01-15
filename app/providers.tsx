'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { SDKProvider } from '@telegram-apps/sdk-react';
import { AuthProvider } from './contexts/AuthContext';
import ClientOnly from './components/ClientOnly';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SDKProvider acceptCustomStyles debug>
      <TonConnectUIProvider manifestUrl="https://pablo-bets.vercel.app/tonconnect-manifest.json">
        <ClientOnly>
          <AuthProvider>
            <div className="glassmorphism-wrapper">
              {children}
            </div>
          </AuthProvider>
        </ClientOnly>
      </TonConnectUIProvider>
    </SDKProvider>
  );
}
