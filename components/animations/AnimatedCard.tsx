'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { cardHoverVariants, easings } from './variants';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'lift' | 'scale' | 'glow' | 'tilt' | 'border';
  className?: string;
  hoverScale?: number;
}

/**
 * Card with hover animations.
 */
export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, variant = 'lift', className = '', hoverScale = 1.02, ...props }, ref) => {
    const getVariants = () => {
      switch (variant) {
        case 'lift':
          return {
            rest: { 
              scale: 1, 
              y: 0,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
            },
            hover: { 
              scale: hoverScale,
              y: -8,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              transition: easings.smooth
            }
          };
        case 'scale':
          return {
            rest: { scale: 1 },
            hover: { 
              scale: hoverScale,
              transition: easings.smooth
            }
          };
        case 'glow':
          return {
            rest: { 
              scale: 1,
              boxShadow: '0 0 0 rgba(246, 162, 18, 0)'
            },
            hover: { 
              scale: hoverScale,
              boxShadow: '0 0 40px rgba(246, 162, 18, 0.3)',
              transition: easings.smooth
            }
          };
        case 'tilt':
          return {
            rest: { 
              scale: 1,
              rotateX: 0,
              rotateY: 0
            },
            hover: { 
              scale: hoverScale,
              transition: easings.smooth
            }
          };
        case 'border':
          return {
            rest: { 
              scale: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)'
            },
            hover: { 
              scale: hoverScale,
              borderColor: 'rgba(246, 162, 18, 0.5)',
              transition: easings.smooth
            }
          };
        default:
          return cardHoverVariants;
      }
    };

    return (
      <motion.div
        ref={ref}
        initial="rest"
        whileHover="hover"
        variants={getVariants()}
        className={className}
        style={{ transformStyle: 'preserve-3d' }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

interface HoverGlowProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  glowColor?: string;
  className?: string;
}

/**
 * Wrapper that adds a glow effect on hover.
 */
export function HoverGlow({ 
  children, 
  glowColor = 'rgba(94, 234, 212, 0.3)',
  className = '', 
  ...props 
}: HoverGlowProps) {
  return (
    <motion.div
      initial={{ boxShadow: `0 0 0 transparent` }}
      whileHover={{ 
        boxShadow: `0 0 40px ${glowColor}`,
        transition: { duration: 0.3 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
