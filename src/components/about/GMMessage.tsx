import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface GMMessageProps {
  className?: string;
}

const GMMessage: React.FC<GMMessageProps> = ({ className = '' }) => {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut'
      }
    }
  };

  const quoteMarkVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className={`relative py-24 md:py-32 lg:py-40 ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-accent/20" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-accent/20" />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 lg:px-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Label */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.35em] text-accent/80">
            <span className="w-8 h-[1px] bg-accent/50" />
            Leadership Message
            <span className="w-8 h-[1px] bg-accent/50" />
          </span>
        </motion.div>

        {/* Quote container */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-surface to-background border border-primary/10 p-8 md:p-12 lg:p-16 shadow-2xl"
        >
          {/* Large quote mark */}
          <motion.span
            variants={quoteMarkVariants}
            className="absolute top-6 left-6 md:top-8 md:left-8 text-6xl md:text-8xl text-accent/10 font-serif leading-none"
          >
            "
          </motion.span>

          {/* Quote text */}
          <blockquote className="relative z-10 text-center">
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-heading font-light leading-relaxed text-primary/90 mb-8 pl-8 md:pl-12"
            >
              At ULTRACTION, construction is more than assembling structures. It is about creating spaces that serve communities, uphold safety, and stand as lasting proof of quality and innovation.
            </motion.p>
          </blockquote>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-accent/30" />
            <div className="w-2 h-2 rounded-full bg-accent/40" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-accent/30" />
          </motion.div>

          {/* Author info */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <span className="text-base md:text-lg font-bold uppercase tracking-[0.2em] text-primary">
              Engr. Wael Mahmah
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-primary/50 mt-2">
              General Manager
            </span>
          </motion.div>

          {/* Decorative bottom accent */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent/30 rotate-45" />
            <div className="w-2 h-2 bg-accent/50 rotate-45" />
            <div className="w-2 h-2 bg-accent/70 rotate-45" />
            <div className="w-2 h-2 bg-accent rotate-45" />
            <div className="w-2 h-2 bg-accent/70 rotate-45" />
            <div className="w-2 h-2 bg-accent/50 rotate-45" />
            <div className="w-2 h-2 bg-accent/30 rotate-45" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default GMMessage;
