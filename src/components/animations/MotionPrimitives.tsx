import type { HTMLMotionProps, Transition, Variants, ViewportOptions } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';

import {
  createRevealVariants,
  createStaggerContainerVariants,
  getResponsiveMotionDistance,
  MOTION_TRANSITION,
  MOTION_VIEWPORT,
  type RevealDirection,
} from '@/lib/motion';

type MotionDivProps = Omit<HTMLMotionProps<'div'>, 'transition' | 'variants'>;

interface MotionRevealProps extends MotionDivProps {
  direction?: RevealDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  transition?: Transition;
  viewport?: ViewportOptions;
  variants?: Variants;
}

export function MotionReveal({
  direction = 'up',
  distance,
  delay = 0,
  duration,
  transition,
  viewport,
  variants,
  initial,
  whileInView,
  ...props
}: MotionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const resolvedVariants = useMemo(() => {
    if (variants) {
      return variants;
    }

      return createRevealVariants({
        direction,
        distance: distance ?? getResponsiveMotionDistance(),
        delay,
        duration,
        reducedMotion: shouldReduceMotion ?? undefined,
      });
  }, [delay, direction, distance, duration, shouldReduceMotion, variants]);

  return (
    <motion.div
      initial={initial ?? 'hidden'}
      whileInView={whileInView ?? 'visible'}
      viewport={viewport ?? MOTION_VIEWPORT}
      transition={transition ?? MOTION_TRANSITION}
      variants={resolvedVariants}
      {...props}
    />
  );
}

interface MotionStaggerProps extends MotionDivProps {
  staggerChildren?: number;
  delayChildren?: number;
  viewport?: ViewportOptions;
  variants?: Variants;
}

export function MotionStagger({
  staggerChildren = 0.08,
  delayChildren = 0,
  viewport,
  variants,
  initial,
  whileInView,
  ...props
}: MotionStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  const resolvedVariants = useMemo(
    () =>
      variants ??
      createStaggerContainerVariants({
        staggerChildren,
        delayChildren,
        reducedMotion: shouldReduceMotion ?? undefined,
      }),
    [delayChildren, shouldReduceMotion, staggerChildren, variants],
  );

  return (
    <motion.div
      initial={initial ?? 'hidden'}
      whileInView={whileInView ?? 'visible'}
      viewport={viewport ?? MOTION_VIEWPORT}
      variants={resolvedVariants}
      {...props}
    />
  );
}
