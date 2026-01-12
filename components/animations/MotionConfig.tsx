'use client';

import { LazyMotion, domAnimation, MotionConfig as FramerMotionConfig } from 'framer-motion';
import { ReactNode } from 'react';

interface MotionProviderProps {
  children: ReactNode;
  reducedMotion?: 'user' | 'always' | 'never';
}

/**
 * Motion provider that wraps the app with optimized Framer Motion config.
 * Uses LazyMotion for smaller bundle size and respects user's motion preferences.
 */
export function MotionProvider({ children, reducedMotion = 'user' }: MotionProviderProps) {
  return (
    <LazyMotion features={domAnimation}>
      <FramerMotionConfig reducedMotion={reducedMotion}>
        {children}
      </FramerMotionConfig>
    </LazyMotion>
  );
}

export { MotionProvider as MotionConfig };
