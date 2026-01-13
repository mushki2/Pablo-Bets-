'use client';

import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { SDKProvider } from '@telegram-apps/sdk-react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
