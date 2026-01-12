'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { buttonHoverVariants, easings } from './variants';

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'scale' | 'glow' | 'lift' | 'shine';
  className?: string;
}

/**
 * Button with hover/tap animations.
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, variant = 'scale', className = '', ...props }, ref) => {
    const getVariants = () => {
      switch (variant) {
        case 'scale':
          return {
            rest: { scale: 1 },
            hover: { scale: 1.05, transition: easings.smooth },
            tap: { scale: 0.95, transition: { duration: 0.1 } }
          };
        case 'glow':
          return {
            rest: { 
              scale: 1,
              boxShadow: '0 0 0 rgba(94, 234, 212, 0)'
            },
            hover: { 
              scale: 1.02,
              boxShadow: '0 0 30px rgba(94, 234, 212, 0.4)',
              transition: easings.smooth
            },
            tap: { scale: 0.98, transition: { duration: 0.1 } }
          };
        case 'lift':
          return {
            rest: { 
              scale: 1, 
              y: 0,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            hover: { 
              scale: 1.02,
              y: -3,
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
              transition: easings.smooth
            },
            tap: { scale: 0.98, y: 0, transition: { duration: 0.1 } }
          };
        case 'shine':
          return {
            rest: { scale: 1 },
            hover: { 
              scale: 1.02,
              transition: easings.smooth
            },
            tap: { scale: 0.98, transition: { duration: 0.1 } }
          };
        default:
          return buttonHoverVariants;
      }
    };

    return (
      <motion.button
        ref={ref}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        variants={getVariants()}
        className={className}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

interface AnimatedLinkProps extends Omit<HTMLMotionProps<'a'>, 'children'> {
  children: ReactNode;
  className?: string;
}

/**
 * Anchor link with hover animation.
 */
export const AnimatedLink = forwardRef<HTMLAnchorElement, AnimatedLinkProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <motion.a
        ref={ref}
        initial={{ opacity: 1 }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        className={className}
        {...props}
      >
        {children}
      </motion.a>
    );
  }
);

AnimatedLink.displayName = 'AnimatedLink';
