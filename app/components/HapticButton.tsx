'use client';

import { useHapticFeedback } from '@telegram-apps/sdk-react';
import { ButtonHTMLAttributes, FC } from 'react';

interface HapticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  impact?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
  notification?: 'success' | 'warning' | 'error';
}

const HapticButton: FC<HapticButtonProps> = ({
  children,
  onClick,
  impact = 'medium',
  notification,
  ...props
}) => {
  const haptic = useHapticFeedback();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (notification) {
      haptic.notificationOccurred(notification);
    } else {
      haptic.impactOccurred(impact);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '10px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        cursor: 'pointer',
        backdropFilter: 'blur(10px)',
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default HapticButton;
