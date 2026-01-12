'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48
};

/**
 * Animated loading spinner.
 */
export function LoadingSpinner({ 
  size = 'md', 
  color = 'currentColor',
  className = '' 
}: LoadingSpinnerProps) {
  const dimension = sizeMap[size];

  return (
    <motion.svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        opacity={0.25}
      />
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        initial={{ strokeDashoffset: 31.4 }}
        animate={{ strokeDashoffset: [31.4, 0, 31.4] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.svg>
  );
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * Animated loading dots.
 */
export function LoadingDots({ 
  size = 'md', 
  color = 'currentColor',
  className = '' 
}: LoadingDotsProps) {
  const dotSize = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const gap = size === 'sm' ? 4 : size === 'md' ? 6 : 8;

  return (
    <div className={`flex items-center ${className}`} style={{ gap }}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: color
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
}

interface LoadingPulseProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

/**
 * Pulsing loading indicator.
 */
export function LoadingPulse({ 
  size = 'md', 
  color = 'rgba(94, 234, 212, 0.5)',
  className = '' 
}: LoadingPulseProps) {
  const dimension = sizeMap[size];

  return (
    <div className={`relative ${className}`} style={{ width: dimension, height: dimension }}>
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: color
        }}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.8, 0, 0.8]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '25%',
          borderRadius: '50%',
          backgroundColor: color.replace('0.5', '1')
        }}
      />
    </div>
  );
}

interface LoadingBarProps {
  className?: string;
  color?: string;
}

/**
 * Horizontal loading bar animation.
 */
export function LoadingBar({ 
  className = '',
  color = 'rgba(246, 162, 18, 1)'
}: LoadingBarProps) {
  return (
    <div 
      className={`relative h-1 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
    >
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '30%',
          backgroundColor: color,
          borderRadius: 'inherit'
        }}
        animate={{
          x: ['-100%', '400%']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

/**
 * Full page loading overlay.
 */
export function PageLoading({ message = 'Loading...' }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center gap-4"
      >
        <LoadingSpinner size="xl" color="rgba(246, 162, 18, 1)" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-white/70"
        >
          {message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
