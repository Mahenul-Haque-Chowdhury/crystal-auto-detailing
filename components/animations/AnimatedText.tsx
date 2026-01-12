'use client';

import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import { useRef, useEffect, useMemo } from 'react';
import { textRevealCharVariants } from './variants';

interface AnimatedTextProps {
  text: string;
  className?: string;
  once?: boolean;
  delay?: number;
}

/**
 * Text that reveals character by character.
 */
export function AnimatedText({ 
  text, 
  className = '',
  once = true,
  delay = 0,
}: AnimatedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const controls = useAnimation();

  const characters = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: delay
      }
    }
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
      aria-label={text}
    >
      {characters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={textRevealCharVariants}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface AnimatedWordsProps {
  text: string;
  className?: string;
  wordClassName?: string;
  once?: boolean;
  delay?: number;
}

/**
 * Text that reveals word by word.
 */
export function AnimatedWords({ 
  text, 
  className = '',
  wordClassName = '',
  once = true,
  delay = 0,
}: AnimatedWordsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  const controls = useAnimation();

  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay
      }
    }
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: { 
      opacity: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
      aria-label={text}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className={wordClassName}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
}

/**
 * Typewriter effect for text.
 */
export function TypewriterText({ 
  text, 
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  onComplete
}: TypewriterTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!isInView) return;

    let index = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startDelay);
  }, [isInView, text, speed, delay, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (!cursor) return;
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, [cursor]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      {cursor && (
        <span 
          className="inline-block ml-0.5"
          style={{ opacity: showCursor ? 1 : 0 }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
}

// Need to import useState for TypewriterText
import { useState } from 'react';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  delay?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

/**
 * Animated counter that counts up to a number.
 */
export function CountUp({ 
  from = 0,
  to, 
  duration = 2,
  delay = 0,
  className = '',
  suffix = '',
  prefix = '',
  decimals = 0
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now() + delay * 1000;

    const animate = (currentTime: number) => {
      if (currentTime < startTime) {
        requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const currentCount = from + (to - from) * easeProgress;
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration, delay]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.round(count).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

interface GradientTextProps {
  text: string;
  className?: string;
  gradient?: string;
  animate?: boolean;
}

/**
 * Text with animated gradient.
 */
export function GradientText({ 
  text, 
  className = '',
  gradient = 'linear-gradient(135deg, #F6A212 0%, #FFC700 50%, #F6A212 100%)',
  animate = true
}: GradientTextProps) {
  return (
    <motion.span
      className={className}
      style={{
        background: gradient,
        backgroundSize: animate ? '200% 200%' : '100% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block'
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
      } : undefined}
      transition={animate ? {
        duration: 5,
        repeat: Infinity,
        ease: 'linear'
      } : undefined}
    >
      {text}
    </motion.span>
  );
}
