'use client';

import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import BetCard from './components/BetCard';
import HapticButton from './components/HapticButton';
import CoinFly from './components/CoinFly';

export default function HomePage() {
  const { user, loading, error } = useAuth();
  const [showCoinFly, setShowCoinFly] = useState(false);

  const handleWinClick = () => {
    setShowCoinFly(true);
  };

  const onAnimationComplete = () => {
    setShowCoinFly(false);
  };

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      gap: '20px'
    }}>
      <h1 style={{ color: 'white' }}>Welcome to Pablo-Bets</h1>

      <div style={{ color: 'yellow', backgroundColor: 'black', padding: '10px' }}>
        {loading && <p>Authenticating...</p>}
        {error && <p style={{ color: 'red' }}>Auth Error: {error}</p>}
        {user && <p>Welcome, User ID: {user.uid}</p>}
      </div>

      <BetCard
        homeTeam="Team A"
        awayTeam="Team B"
        odds={2.5}
        betType="Match Winner"
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <HapticButton>Place Bet</HapticButton>
        <HapticButton notification="success" onClick={handleWinClick}>
          Simulate Win
        </HapticButton>
      </div>

      <CoinFly trigger={showCoinFly} onComplete={onAnimationComplete} />
    </main>
  );
}
