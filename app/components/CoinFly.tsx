'use client';

import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinFlyProps {
  trigger: boolean;
  onComplete: () => void;
}

const CoinFly: FC<CoinFlyProps> = ({ trigger, onComplete }) => {
  const [coins, setCoins] = useState<number[]>([]);

  useEffect(() => {
    if (trigger) {
      setCoins([...Array(20)].map((_, i) => i));
      const timer = setTimeout(onComplete, 2000); // Reset after animation
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      <AnimatePresence>
        {coins.map((i) => (
          <motion.div
            key={i}
            initial={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: 1,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              x: '50vw', // Animate towards center
              y: '10vh', // Animate towards top (e.g., balance display)
              opacity: 0,
            }}
            transition={{
              duration: 1 + Math.random(),
              ease: 'easeOut',
              delay: Math.random() * 0.5,
            }}
            style={{
              position: 'absolute',
              width: '20px',
              height: '20px',
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CoinFly;
