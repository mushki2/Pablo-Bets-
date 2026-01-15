'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, signInWithCustomToken, User } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { useLaunchParams } from '@telegram-apps/sdk-react';

// --- Firebase Configuration ---
// It's crucial that these environment variables are prefixed with NEXT_PUBLIC_
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase client-side
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lp = useLaunchParams();
  const auth = getAuth();

  useEffect(() => {
    const silentAuth = async () => {
      if (auth.currentUser) {
        setUser(auth.currentUser);
        setLoading(false);
        return;
      }

      const initDataRaw = lp?.initDataRaw;

      if (!initDataRaw) {
        // This might happen in a non-Telegram environment
        setError('Telegram initData not found.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Send initData to our backend for validation
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ initData: initDataRaw }),
        });

        if (!response.ok) {
          try {
            const errorData = await response.json();
            throw new Error(errorData.error || `Authentication failed with status: ${response.status}`);
          } catch (e) {
            // Handle cases where the response is not JSON
            const errorText = await response.text();
            throw new Error(`Authentication failed: ${errorText}`);
          }
        }

        const { firebase_token } = await response.json();

        // 2. Sign in to Firebase with the custom token
        const userCredential = await signInWithCustomToken(auth, firebase_token);
        setUser(userCredential.user);
        setError(null);

      } catch (err: any) {
        setError(err.message || 'An unknown error occurred during authentication.');
        console.error("Authentication error:", err);
      } finally {
        setLoading(false);
      }
    };

    silentAuth();
  }, [lp?.initDataRaw, auth]);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
