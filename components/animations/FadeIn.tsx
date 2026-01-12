'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { easings } from './variants';

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

/**
 * Simple fade-in animation component.
 */
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = '',
  once = true,
  ...props 
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            duration,
            delay,
            ease: easings.easeOut 
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
