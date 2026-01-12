'use client';

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { pageVariants, easings } from './variants';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with enter/exit animations.
 * Use in layout.tsx to animate between pages.
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface PageWrapperProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  className?: string;
}

/**
 * Simple page wrapper with fade + slide animation.
 * Use at the top of each page component.
 */
export function PageWrapper({ children, className = '', ...props }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)',
        transition: { 
          duration: 0.5, 
          ease: easings.easeOut,
          staggerChildren: 0.1
        }
      }}
      exit={{ 
        opacity: 0, 
        y: -10, 
        filter: 'blur(4px)',
        transition: { duration: 0.3 }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface SectionTransitionProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Section wrapper with scroll-triggered animation.
 */
export function SectionTransition({ 
  children, 
  delay = 0,
  className = '', 
  ...props 
}: SectionTransitionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.7, 
          delay,
          ease: easings.easeOut 
        }
      }}
      viewport={{ once: true, margin: '-100px' }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}
