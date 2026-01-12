'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

/**
 * Animated skeleton loader with shimmer effect.
 */
export function Skeleton({ 
  className = '',
  width = '100%',
  height = 20,
  borderRadius = 8
}: SkeletonProps) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent)',
          transform: 'translateX(-100%)'
        }}
        animate={{
          transform: ['translateX(-100%)', 'translateX(100%)']
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.div>
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineHeight?: number;
  gap?: number;
}

/**
 * Skeleton for text content with multiple lines.
 */
export function SkeletonText({ 
  lines = 3, 
  className = '',
  lineHeight = 16,
  gap = 8
}: SkeletonTextProps) {
  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index}
          height={lineHeight}
          width={index === lines - 1 ? '70%' : '100%'}
          borderRadius={4}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  imageHeight?: number;
  lines?: number;
}

/**
 * Skeleton for card content.
 */
export function SkeletonCard({ 
  className = '',
  showImage = true,
  imageHeight = 160,
  lines = 3
}: SkeletonCardProps) {
  return (
    <div 
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className}`}
    >
      {showImage && (
        <Skeleton 
          height={imageHeight} 
          borderRadius={12} 
          className="mb-4"
        />
      )}
      <Skeleton height={24} width="60%" borderRadius={6} className="mb-3" />
      <SkeletonText lines={lines} lineHeight={14} gap={6} />
      <div className="mt-4 flex gap-2">
        <Skeleton height={36} width={100} borderRadius={8} />
        <Skeleton height={36} width={80} borderRadius={8} />
      </div>
    </div>
  );
}

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96
};

/**
 * Circular skeleton for avatars.
 */
export function SkeletonAvatar({ 
  size = 'md', 
  className = '' 
}: SkeletonAvatarProps) {
  const dimension = avatarSizes[size];
  return (
    <Skeleton 
      width={dimension} 
      height={dimension} 
      borderRadius="50%" 
      className={className}
    />
  );
}

interface SkeletonListProps {
  items?: number;
  className?: string;
  itemClassName?: string;
}

/**
 * Skeleton for list items.
 */
export function SkeletonList({ 
  items = 5, 
  className = '',
  itemClassName = ''
}: SkeletonListProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className={`flex items-center gap-3 ${itemClassName}`}>
          <SkeletonAvatar size="sm" />
          <div className="flex-1">
            <Skeleton height={14} width="40%" borderRadius={4} className="mb-2" />
            <Skeleton height={12} width="70%" borderRadius={4} />
          </div>
        </div>
      ))}
    </div>
  );
}

interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  skeleton: ReactNode;
  className?: string;
}

/**
 * Wrapper that shows skeleton while loading.
 */
export function SkeletonWrapper({ 
  children, 
  isLoading, 
  skeleton,
  className = ''
}: SkeletonWrapperProps) {
  return (
    <div className={className}>
      {isLoading ? skeleton : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

interface SkeletonGridProps {
  columns?: number;
  items?: number;
  className?: string;
}

/**
 * Grid of skeleton cards.
 */
export function SkeletonGrid({ 
  columns = 3, 
  items = 6,
  className = ''
}: SkeletonGridProps) {
  return (
    <div 
      className={`grid gap-4 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
