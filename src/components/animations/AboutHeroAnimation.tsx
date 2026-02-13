/**
 * AboutHeroAnimation - Remotion-style animation for About page hero
 *
 * Frame-based animation compatible with web deployment
 * Uses requestAnimationFrame for smooth playback
 */

import React, { useEffect, useRef, useState } from 'react';

// Brand Colors - ULTRACTION
const COLORS = {
  primary: '#141414',      // Black
  accent: '#2c1810',        // Maroon
  bg: '#e8dcc8',           // Beige
};

// Animation Configuration
const FPS = 30;
const TOTAL_FRAMES = 210; // 7 seconds

const TIMING = {
  titleStart: 0,
  titleEnd: 45,
  subtitleStart: 30,
  subtitleEnd: 75,
  imageScaleStart: 45,
  imageScaleEnd: 120,
  overlayFadeIn: 90,
  overlayFadeOut: 150,
};

// Spring animation (simplified from Remotion)
function spring(
  frame: number,
  config: { damping: number; stiffness: number }
): number {
  const mass = 1;
  const damping = config.damping;
  const stiffness = config.stiffness;

  const beta = damping / (2 * Math.sqrt(stiffness * mass));
  const response = Math.sqrt(stiffness * mass);

  const t = Math.max(0, frame / 30);
  const envelope = Math.exp(-beta * response * t);
  const oscillation = Math.cos(response * t);

  return 1 - envelope * oscillation;
}

// Linear interpolation with clamp
function interpolate(
  frame: number,
  inputRange: number[],
  outputRange: number[],
  options?: { extrapolateRight?: string }
): number {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;

  let t = (frame - inputMin) / (inputMax - inputMin);
  t = Math.max(0, Math.min(1, t)); // Clamp

  if (options?.extrapolateRight === 'clamp') {
    t = Math.max(0, Math.min(1, t));
  }

  return outputMin + t * (outputMax - outputMin);
}

interface AboutHeroAnimationProps {
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export const AboutHeroAnimation: React.FC<AboutHeroAnimationProps> = ({
  title = 'Crafting Spaces',
  subtitle = 'That Inspire',
  imageSrc = '/images/projects.png',
  autoPlay = true,
  loop = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      const framesToAdd = (deltaTime / 1000) * FPS;

      let nextFrame = frame + framesToAdd;

      if (loop && nextFrame >= TOTAL_FRAMES) {
        nextFrame = 0;
      } else if (nextFrame >= TOTAL_FRAMES) {
        nextFrame = TOTAL_FRAMES - 1;
        setIsPlaying(false);
      }

      setFrame(nextFrame);
      lastTimeRef.current = currentTime;

      if (isPlaying) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [frame, isPlaying, loop]);

  // Calculate animation values
  const titleSpring = spring(frame - TIMING.titleStart, { damping: 200, stiffness: 100 });
  const titleScale = interpolate(titleSpring, [0, 1], [0.95, 1], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [TIMING.titleStart, TIMING.titleStart + 15, TIMING.titleEnd], [0, 1, 1], { extrapolateRight: 'clamp' });
  const titleLetterSpacing = interpolate(frame, [TIMING.titleStart, TIMING.titleEnd], [-0.05, 0], { extrapolateRight: 'clamp' });

  const subtitleOpacity = interpolate(frame, [TIMING.subtitleStart, TIMING.subtitleEnd], [0, 0.5], { extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [TIMING.subtitleStart, TIMING.subtitleEnd], [20, 0], { extrapolateRight: 'clamp' });

  const imageScale = interpolate(frame, [TIMING.imageScaleStart, TIMING.imageScaleEnd, 180], [1, 1.08, 1.08], { extrapolateRight: 'clamp' });
  const imageOpacity = interpolate(frame, [0, 30, 180], [0, 1, 1], { extrapolateRight: 'clamp' });

  const overlayOpacity = interpolate(frame, [0, TIMING.overlayFadeIn, TIMING.overlayFadeOut, 180], [0.3, 0.1, 0, 0], { extrapolateRight: 'clamp' });

  const lineWidth = interpolate(frame, [TIMING.titleEnd, TIMING.subtitleEnd], [0, 120], { extrapolateRight: 'clamp' });
  const lineOpacity = interpolate(frame, [TIMING.titleEnd, TIMING.subtitleEnd + 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#e8dcc8]"
      style={{ fontFamily: "'Public Sans', system-ui, sans-serif" }}
    >
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageSrc}
          alt="ULTRACTION Projects"
          className="w-full h-full object-cover"
          style={{
            transform: `scale(${imageScale})`,
            opacity: imageOpacity,
            transition: 'none',
          }}
        />
      </div>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 md:px-16 lg:px-32">
        <div
          className="text-center"
          style={{
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
          }}
        >
          {/* Main Title */}
          <h1
            className="font-bold uppercase leading-none tracking-tight"
            style={{
              fontSize: 'clamp(48px, 8vw, 120px)',
              color: COLORS.primary,
              letterSpacing: `${titleLetterSpacing}em`,
            }}
          >
            {title}
          </h1>

          {/* Decorative Line */}
          <div
            className="mx-auto mt-6"
            style={{
              height: '3px',
              width: `${lineWidth}px`,
              backgroundColor: COLORS.accent,
              opacity: lineOpacity,
            }}
          />

          {/* Subtitle */}
          <h2
            className="font-bold uppercase leading-none inline-block"
            style={{
              fontSize: 'clamp(48px, 8vw, 120px)',
              color: 'rgba(20, 20, 20, 0.5)',
              opacity: subtitleOpacity,
              transform: `translateY(${subtitleY}px)`,
            }}
          >
            {subtitle}
          </h2>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black/20" />

      {/* Play/Pause Button (optional) */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-8 right-8 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors rounded"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default AboutHeroAnimation;
