'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

interface BetCardProps {
  homeTeam: string;
  awayTeam: string;
  odds: number;
  betType: string;
}

const BetCard: FC<BetCardProps> = ({ homeTeam, awayTeam, odds, betType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{homeTeam} vs {awayTeam}</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.7)' }}>{betType}</span>
        <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#85bb65' }}>{odds.toFixed(2)}</span>
      </div>
    </motion.div>
  );
};

export default BetCard;
