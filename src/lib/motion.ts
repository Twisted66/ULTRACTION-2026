import type { Transition, Variants, ViewportOptions } from 'framer-motion';

export const MOTION_EASING = [0.22, 1, 0.36, 1] as const;

export const MOTION_DURATION = {
  fast: 0.2,
  base: 0.35,
  medium: 0.5,
  slow: 0.7,
} as const;

export const MOTION_VIEWPORT: ViewportOptions = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -8% 0px',
};

export const MOTION_TRANSITION: Transition = {
  duration: MOTION_DURATION.base,
  ease: MOTION_EASING,
};

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';

interface RevealVariantOptions {
  direction?: RevealDirection;
  distance?: number;
  duration?: number;
  delay?: number;
  reducedMotion?: boolean;
}

export function createRevealVariants({
  direction = 'up',
  distance = 28,
  duration = MOTION_DURATION.base,
  delay = 0,
  reducedMotion = false,
}: RevealVariantOptions = {}): Variants {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: Math.min(duration, MOTION_DURATION.fast),
          delay,
          ease: MOTION_EASING,
        },
      },
    };
  }

  const hiddenState = {
    opacity: 0,
    x: 0,
    y: 0,
    scale: 1,
  };

  switch (direction) {
    case 'up':
      hiddenState.y = distance;
      break;
    case 'down':
      hiddenState.y = -distance;
      break;
    case 'left':
      hiddenState.x = distance;
      break;
    case 'right':
      hiddenState.x = -distance;
      break;
    case 'scale':
      hiddenState.scale = 0.94;
      break;
    case 'fade':
    default:
      break;
  }

  return {
    hidden: hiddenState,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: MOTION_EASING,
      },
    },
  };
}

interface StaggerContainerOptions {
  staggerChildren?: number;
  delayChildren?: number;
  reducedMotion?: boolean;
}

export function createStaggerContainerVariants({
  staggerChildren = 0.08,
  delayChildren = 0,
  reducedMotion = false,
}: StaggerContainerOptions = {}): Variants {
  return {
    hidden: {},
    visible: {
      transition: reducedMotion
        ? { delayChildren: 0, staggerChildren: 0 }
        : { delayChildren, staggerChildren },
    },
  };
}

export function getResponsiveMotionDistance(): number {
  if (typeof window === 'undefined') {
    return 24;
  }

  return window.matchMedia('(max-width: 767px)').matches ? 16 : 28;
}
