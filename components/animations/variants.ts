import { Variants } from 'framer-motion';

// Shared timing curves for consistency
export const easings = {
  easeOut: [0.22, 1, 0.36, 1],
  easeIn: [0.4, 0, 1, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  smooth: { type: 'spring', stiffness: 100, damping: 20 },
  bouncy: { type: 'spring', stiffness: 400, damping: 15 },
} as const;

// Fade variants
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: easings.easeIn }
  }
};

// Slide variants
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: easings.easeIn }
  }
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3, ease: easings.easeIn }
  }
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: { duration: 0.3, ease: easings.easeIn }
  }
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: { duration: 0.3, ease: easings.easeIn }
  }
};

// Scale variants
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: easings.easeOut }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.3, ease: easings.easeIn }
  }
};

export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: easings.bouncy
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.2, ease: easings.easeIn }
  }
};

// Page transition variants
export const pageVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
    filter: 'blur(10px)'
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.5, 
      ease: easings.easeOut,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -10,
    filter: 'blur(5px)',
    transition: { 
      duration: 0.3, 
      ease: easings.easeIn 
    }
  }
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: easings.easeOut }
  }
};

// Hero text variants
export const heroTextVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easings.easeOut }
  }
};

// Card hover variants
export const cardHoverVariants: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
  },
  hover: { 
    scale: 1.02,
    y: -5,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    transition: easings.smooth
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button hover variants
export const buttonHoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: easings.smooth
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Glow pulse variants
export const glowPulseVariants: Variants = {
  rest: { 
    boxShadow: '0 0 0 rgba(94, 234, 212, 0)'
  },
  animate: {
    boxShadow: [
      '0 0 0 rgba(94, 234, 212, 0.35)',
      '0 0 40px rgba(94, 234, 212, 0.15)',
      '0 0 0 rgba(94, 234, 212, 0)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Shimmer effect for loading states
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// Float animation
export const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Rotate animation
export const rotateVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
};

// List item variants for staggered lists
export const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1
    }
  }
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: easings.easeOut }
  }
};

// Modal variants
export const modalOverlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, delay: 0.1 }
  }
};

export const modalContentVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 50
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: easings.bouncy
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 30,
    transition: { duration: 0.2 }
  }
};

// Nav menu variants
export const navMenuVariants: Variants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 }
    }
  },
  visible: { 
    opacity: 1,
    height: 'auto',
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.1 },
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

export const navItemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: easings.easeOut }
  }
};

// Counter animation helper
export const createCounterVariants = (): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
});

// Text reveal character by character
export const textRevealContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1
    }
  }
};

export const textRevealCharVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: easings.easeOut }
  }
};

// Scroll-triggered reveal
export const scrollRevealVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: easings.easeOut 
    }
  }
};
