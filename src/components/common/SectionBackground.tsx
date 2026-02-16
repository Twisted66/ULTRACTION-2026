import React from 'react';
import { motion } from 'framer-motion';

interface SectionBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'surface' | 'background';
  showTopBorder?: boolean;
  showBottomBorder?: boolean;
  showGrid?: boolean;
  showAccentBlob?: boolean;
  showBottomLine?: boolean;
  contentWrapperClassName?: string;
}

const SectionBackground: React.FC<SectionBackgroundProps> = ({
  children,
  className = '',
  variant = 'surface',
  showTopBorder = true,
  showBottomBorder = true,
  showGrid = true,
  showAccentBlob = true,
  showBottomLine = true,
  contentWrapperClassName = '',
}) => {
  const bgClass = variant === 'surface' ? 'bg-surface' : 'bg-background';

  return (
    <section
      className={`relative ${bgClass} text-primary overflow-hidden ${showTopBorder ? 'border-t' : ''} ${showBottomBorder ? 'border-b' : ''} border-primary/20 ${className}`}
    >
      {/* Background pattern */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, currentColor 1px, transparent 1px),
                linear-gradient(to bottom, currentColor 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      )}

      {/* Animated gradient accent */}
      {showAccentBlob && (
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 ${contentWrapperClassName}`}>
        {children}
      </div>

      {/* Bottom decorative line */}
      {showBottomLine && showBottomBorder && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none"></div>
      )}
    </section>
  );
};

export default SectionBackground;
