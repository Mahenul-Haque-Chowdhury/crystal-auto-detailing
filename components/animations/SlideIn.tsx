'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { easings } from './variants';

type Direction = 'up' | 'down' | 'left' | 'right';

interface SlideInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
}

const getDirectionOffset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance };
    case 'down': return { y: -distance };
    case 'left': return { x: distance };
    case 'right': return { x: -distance };
  }
};

/**
 * Slide-in animation from any direction.
 */
export function SlideIn({ 
  children, 
  direction = 'up',
  delay = 0, 
  duration = 0.6,
  distance = 40,
  className = '',
  once = true,
  ...props 
}: SlideInProps) {
  const offset = getDirectionOffset(direction, distance);

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...offset 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0,
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
