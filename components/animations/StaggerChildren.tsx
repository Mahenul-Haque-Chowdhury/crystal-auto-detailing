'use client';

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { staggerItemVariants } from './variants';

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
  once?: boolean;
}

/**
 * Container that staggers animation of its children.
 */
export function StaggerChildren({ 
  children, 
  staggerDelay = 0.08,
  initialDelay = 0.1,
  className = '',
  once = true,
}: StaggerChildrenProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

/**
 * Individual item within a StaggerChildren container.
 */
export function StaggerItem({ 
  children, 
  className = '',
}: StaggerItemProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
