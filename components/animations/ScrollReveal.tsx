'use client';

import { motion, HTMLMotionProps, useInView, useAnimation, useScroll, useTransform } from 'framer-motion';
import { ReactNode, useRef, useEffect } from 'react';
import { easings } from './variants';

type RevealVariant = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'blur';

interface ScrollRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

const getVariantStyles = (variant: RevealVariant, distance: number) => {
  const hidden: Record<string, number | string> = { opacity: 0 };
  
  switch (variant) {
    case 'fade':
      break;
    case 'slide-up':
      hidden.y = distance;
      break;
    case 'slide-down':
      hidden.y = -distance;
      break;
    case 'slide-left':
      hidden.x = distance;
      break;
    case 'slide-right':
      hidden.x = -distance;
      break;
    case 'scale':
      hidden.scale = 0.9;
      break;
    case 'blur':
      hidden.filter = 'blur(10px)';
      break;
  }
  
  return hidden;
};

/**
 * Scroll-triggered reveal animation with multiple variant options.
 */
export function ScrollReveal({ 
  children, 
  variant = 'slide-up',
  delay = 0, 
  duration = 0.6,
  distance = 50,
  className = '',
  once = true,
  threshold = 0.1,
  ...props 
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    margin: '-10%',
    amount: threshold 
  });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const hidden = getVariantStyles(variant, distance);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden,
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0, 
          scale: 1,
          filter: 'blur(0px)',
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

interface ParallaxProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/**
 * Simple parallax effect on scroll.
 */
export function Parallax({ 
  children, 
  speed = 0.5,
  className = '',
  ...props 
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 24, -speed * 24]);

  return (
    <motion.div
      ref={ref}
      initial={{ y: 0 }}
      whileInView={{ 
        y: 0,
        transition: { duration: 0 }
      }}
      style={{
        ...(props.style ?? {}),
        y,
        willChange: 'transform'
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
