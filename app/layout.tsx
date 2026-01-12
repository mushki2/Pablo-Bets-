'use client';

import { useEffect, useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { SDKProvider } from '@telegram-apps/sdk-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Wait for client-side to prevent hydration errors

  return (
    <html lang="en">
      <body>
        <TonConnectUIProvider manifestUrl="https://pablo-bets.vercel.app/tonconnect-manifest.json">
          <SDKProvider acceptCustomStyles debug>
            {children}
          </SDKProvider>
        </TonConnectUIProvider>
      </body>
    </html>
  );
}
