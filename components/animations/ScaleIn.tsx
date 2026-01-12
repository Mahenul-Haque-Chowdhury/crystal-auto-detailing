'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { easings } from './variants';

interface ScaleInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  initialScale?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scale-in animation component with optional initial scale.
 */
export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  initialScale = 0.85,
  className = '',
  once = true,
  ...props 
}: ScaleInProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: initialScale 
      }}
      whileInView={{ 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration,
          delay,
          ease: easings.easeOut 
        }
      }}
      viewport={{ once, margin: '-50px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
