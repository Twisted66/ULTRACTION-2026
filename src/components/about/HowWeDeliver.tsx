import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface Stage {
  label: string;
  heading: string;
  body: string;
}

interface HowWeDeliverProps {
  stages?: Stage[];
}

const defaultStages: Stage[] = [
  {
    label: 'STAGE 01',
    heading: 'Civil and Concrete Foundation',
    body: 'Built on expertise in civil construction and concrete structure works, we execute every package with precision, reliability, and long-term performance in mind.',
  },
  {
    label: 'STAGE 02',
    heading: 'Value-Engineered Delivery',
    body: 'Our teams integrate value engineering across planning and execution to optimize constructability, cost-efficiency, and schedule performance.',
  },
  {
    label: 'STAGE 03',
    heading: 'Safety and Sustainability by Design',
    body: 'From method statements to handover, we prioritize jobsite safety, environmental responsibility, and resilient outcomes for communities.',
  },
  {
    label: 'STAGE 04',
    heading: 'Trusted Regional Partnerships',
    body: 'We continue to grow through repeat delivery, transparent collaboration, and strong partnerships with major contractors, developers, and consultants.',
  },
];

const HowWeDeliver: React.FC<HowWeDeliverProps> = ({ stages = defaultStages }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section className="relative bg-surface text-primary overflow-hidden border-y border-black dark:border-black">
      <div className="relative px-6 md:px-12 lg:px-24 py-24 md:py-32">
        {/* Dramatic Section Header */}
        <div className="mb-16 md:mb-24 relative">
          <motion.div
            style={{ y }}
            className="grid grid-cols-12 gap-4 items-end"
          >
            {/* Left: Title with massive typography */}
            <div className="col-span-12 lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent">
                    Our Process
                  </span>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-accent/50 to-transparent"></div>
                </div>

                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-bold font-heading leading-[0.85] tracking-tight">
                  <span className="block">HOW WE</span>
                  <span className="block italic font-light text-primary/40 scale-y-75 inline-block">DELIVER</span>
                </h2>

                <p className="mt-6 text-sm md:text-base text-primary/60 max-w-2xl leading-relaxed">
                  From planning to handover, our proven methodology ensures excellence at every phase of construction
                </p>
              </motion.div>
            </div>

            {/* Right: Massive stage count */}
            <div className="col-span-12 lg:col-span-4 lg:col-start-9 flex justify-end items-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="text-[140px] md:text-[180px] lg:text-[220px] font-bold font-heading leading-none text-accent/5 select-none">
                  04
                </div>
                <div className="absolute bottom-8 right-0">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary/40 -rotate-90 origin-right block">
                    Stages
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stages Grid - Dramatic asymmetric layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          {stages.map((stage, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`
                  group relative border-b border-black/10 dark:border-black/20
                  ${index % 2 === 0 ? 'md:border-r' : ''}
                  ${index === stages.length - 1 ? 'border-b-0' : ''}
                `}
              >
                {/* Background hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent"
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                ></motion.div>

                {/* Card content */}
                <div className="relative p-8 md:p-12 lg:p-16">
                  {/* Stage number - massive watermark */}
                  <div className="absolute top-4 right-4 md:top-8 md:right-8 pointer-events-none select-none">
                    <motion.div
                      className="text-[120px] md:text-[160px] font-bold font-heading leading-none text-primary/[0.03]"
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        opacity: isHovered ? 0.06 : 0.03,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </motion.div>
                  </div>

                  {/* Stage label badge */}
                  <motion.div
                    className="mb-6 inline-block"
                    animate={{ y: isHovered ? -2 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span
                      className={`
                        inline-block px-3 py-1.5 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]
                        transition-all duration-300
                        ${isHovered
                          ? 'bg-accent text-white shadow-lg shadow-accent/20'
                          : 'bg-primary/5 text-primary border border-primary/10'
                        }
                      `}
                    >
                      {stage.label}
                    </span>
                  </motion.div>

                  {/* Heading */}
                  <h3
                    className={`
                      text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight mb-4 max-w-xl
                      transition-colors duration-300
                      ${isHovered ? 'text-accent' : 'text-primary'}
                    `}
                  >
                    {stage.heading}
                  </h3>

                  {/* Body with expand animation */}
                  <div className="relative">
                    <motion.p
                      className="text-sm md:text-base leading-relaxed text-primary/60 max-w-lg"
                      initial={false}
                      animate={{
                        height: isHovered ? 'auto' : 54,
                        opacity: isHovered ? 1 : 0.7,
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {stage.body}
                    </motion.p>

                    {/* Fade overlay when collapsed */}
                    {!isHovered && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
                    )}
                  </div>

                  {/* Animated corner bracket on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-accent"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>

                  {/* Animated arrow on hover */}
                  <motion.div
                    className="absolute bottom-8 right-8"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      x: isHovered ? 0 : -10,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Connecting line to next card */}
                {index < stages.length - 1 && (
                  <motion.div
                    className={`
                      absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-accent/20
                      ${index % 2 === 0 ? 'right-0' : 'left-0 md:hidden'}
                    `}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    style={{ transformOrigin: index % 2 === 0 ? 'right' : 'left' }}
                  ></motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 md:mt-28 pt-12 border-t border-black/10 dark:border-black/20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">
                Ready to Build
                <span className="text-accent"> Something Great?</span>
              </h3>
              <p className="text-primary/60 leading-relaxed max-w-xl">
                Let's discuss how our proven four-stage process can deliver exceptional results for your next construction project.
              </p>
            </div>

            <div className="flex justify-start lg:justify-end">
              <a
                href="/contact"
                className="group relative inline-flex items-center gap-4 px-10 py-5 bg-primary text-white overflow-hidden transition-all duration-300 hover:bg-accent hover:shadow-2xl hover:shadow-accent/20"
              >
                <span className="relative z-10 text-xs font-bold uppercase tracking-[0.2em]">
                  Start Your Project
                </span>
                <svg
                  className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>
    </section>
  );
};

export default HowWeDeliver;
