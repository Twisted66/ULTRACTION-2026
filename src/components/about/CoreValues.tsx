import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface CoreValue {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  insight: string;
  icon: React.ReactNode;
  color: string;
  stats?: { label: string; value: string }[];
}

const coreValues: CoreValue[] = [
  {
    id: 'integrity',
    title: 'Integrity',
    shortDescription: 'Unwavering honesty in every interaction',
    fullDescription: 'We believe transparency builds trust. Our commitment to open communication and ethical practices ensures that every stakeholder is informed and respected throughout the project lifecycle.',
    insight: 'Clear communication, honored commitments, and full ownership from planning to final handover.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    color: '#2c1810',
    stats: [
      { label: 'Client Trust', value: '100%' },
      { label: 'On-Time Delivery', value: '98%' }
    ]
  },
  {
    id: 'team-spirit',
    title: 'Team Spirit',
    shortDescription: 'Collaborative excellence driven by shared purpose',
    fullDescription: 'Our success is built on the strength of our collaboration. Engineers, supervisors, and site teams work in unison, leveraging diverse expertise to overcome challenges and deliver exceptional results.',
    insight: 'Early alignment between planning and execution teams ensures coordinated and efficient project delivery.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="2.5"/>
        <path d="M12 12c-3.333 0-5 1.667-5 5v1h10v-1c0-3.333-1.667-5-5-5z"/>
        <circle cx="5" cy="9" r="1.5"/>
        <path d="M5 11c-2 0-3 1-3 3v1h6v-1c0-2-1-3-3-3z" opacity="0.5"/>
        <circle cx="19" cy="9" r="1.5"/>
        <path d="M19 11c-2 0-3 1-3 3v1h6v-1c0-2-1-3-3-3z" opacity="0.5"/>
      </svg>
    ),
    color: '#985a3d',
    stats: [
      { label: 'Team Collaboration', value: 'A+' },
      { label: 'Safety Rating', value: '5-Star' }
    ]
  },
  {
    id: 'commitment',
    title: 'Commitment',
    shortDescription: 'Dedicated to delivering excellence from foundation to handover',
    fullDescription: 'Every project receives our full dedication. We stay accountable to schedules, quality standards, and client outcomes across every milestone, ensuring nothing less than excellence.',
    insight: 'Accountability to schedule, quality, and client outcomes across every project milestone.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2"/>
      </svg>
    ),
    color: '#2c1810',
    stats: [
      { label: 'Project Completion', value: '100%' },
      { label: 'Client Satisfaction', value: '97%' }
    ]
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    shortDescription: 'Building responsibly for communities and the environment',
    fullDescription: 'We recognize our responsibility to future generations. Our construction practices prioritize environmental stewardship, resource efficiency, and sustainable solutions that benefit communities for decades.',
    insight: 'Durable systems, reduced waste, and long-term value for the built environment.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2v4"/>
        <path d="M12 18v4"/>
        <path d="M4.93 4.93l2.83 2.83"/>
        <path d="M16.24 16.24l2.83 2.83"/>
        <path d="M2 12h4"/>
        <path d="M18 12h4"/>
        <path d="M4.93 19.07l2.83-2.83"/>
        <path d="M16.24 7.76l2.83-2.83"/>
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 10v2l1 1" fill="currentColor" opacity="0.3"/>
      </svg>
    ),
    color: '#985a3d',
    stats: [
      { label: 'Green Projects', value: '85%' },
      { label: 'Waste Reduction', value: '40%' }
    ]
  },
  {
    id: 'performance',
    title: 'Performance',
    shortDescription: 'Exceeding expectations through precision engineering',
    fullDescription: 'We measure our success by the excellence of our execution. Through continuous monitoring, quality control, and precision engineering, we consistently deliver results that exceed expectations.',
    insight: 'Continuous progress and quality tracking for predictable results under real site constraints.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        <path d="M17 8l4 4"/>
        <path d="M21 8l-4 4"/>
      </svg>
    ),
    color: '#2c1810',
    stats: [
      { label: 'Quality Score', value: '99%' },
      { label: 'Efficiency Rate', value: '95%' }
    ]
  },
  {
    id: 'safety',
    title: 'Safety',
    shortDescription: 'Uncompromising standards protecting people and communities',
    fullDescription: 'Safety is not negotiable. Our comprehensive approach to risk management, safe work methods, and disciplined site behavior ensures that every team member returns home safely, every day.',
    insight: 'Risk planning, safe methods, and disciplined site behavior protect teams and project continuity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M12 8v4"/>
        <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
      </svg>
    ),
    color: '#985a3d',
    stats: [
      { label: 'Accident-Free Days', value: '500+' },
      { label: 'Safety Rating', value: 'ISO 45001' }
    ]
  }
];

interface CoreValuesProps {
  values?: CoreValue[];
}

const CoreValues: React.FC<CoreValuesProps> = ({ values = coreValues }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="relative bg-surface text-primary overflow-hidden border-y border-primary/20">
      {/* Animated background elements */}
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

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
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

        <motion.div
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 py-20 md:py-28 lg:py-32">
        {/* Section Header */}
        <motion.div
          style={{ y }}
          className="mb-16 md:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                Our Foundation
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-accent/50 to-transparent"></div>
            </div>

            {/* Main title */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold font-heading leading-[0.85] tracking-tight mb-6">
              <span className="block">CORE</span>
              <span className="block italic font-light text-primary/40 scale-y-75 inline-block">VALUES</span>
            </h2>

            {/* Subtitle */}
            <p className="text-sm md:text-base text-primary/60 max-w-2xl leading-relaxed">
              The principles that guide every decision, every action, and every project we undertake
            </p>
          </motion.div>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => {
            const isHovered = hoveredIndex === index;
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={value.id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative"
              >
                {/* Card Container */}
                <div
                  className={`
                    relative bg-card border border-primary/10 overflow-hidden transition-all duration-500
                    ${isHovered ? 'shadow-xl shadow-accent/10' : 'shadow-md'}
                    ${isExpanded ? 'lg:col-span-2 lg:row-span-2' : ''}
                  `}
                  style={{
                    minHeight: isExpanded ? 'auto' : '320px'
                  }}
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/[0.03] to-transparent"
                    initial={false}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Number watermark */}
                  <motion.div
                    className="absolute top-4 right-4 pointer-events-none select-none"
                    animate={{
                      scale: isHovered ? 1.05 : 1,
                      opacity: isHovered ? 0.08 : 0.04,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-[80px] md:text-[100px] font-bold font-heading leading-none text-primary">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </motion.div>

                  {/* Card Content */}
                  <div className="relative p-6 md:p-8 h-full flex flex-col">
                    {/* Icon container */}
                    <motion.div
                      className="mb-6"
                      animate={{
                        rotate: isHovered ? 5 : 0,
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div
                        className={`
                          w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-lg
                          transition-colors duration-300
                          ${isHovered ? 'bg-accent text-white' : 'bg-primary/5 text-accent'}
                        `}
                        style={{ color: isHovered ? '#ffffff' : value.color }}
                      >
                        <div className="[&>svg]:w-8 [&>svg]:h-8 md:[&>svg]:w-9 md:[&>svg]:h-9">
                          {value.icon}
                        </div>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3
                      className={`
                        text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 transition-colors duration-300
                        ${isHovered ? 'text-accent' : 'text-primary'}
                      `}
                    >
                      {value.title}
                    </h3>

                    {/* Description */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isExpanded ? 'expanded' : 'collapsed'}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="flex-1"
                      >
                        {isExpanded ? (
                          <>
                            <p className="text-sm md:text-base leading-relaxed text-primary/80 mb-6">
                              {value.fullDescription}
                            </p>

                            {/* Insight box */}
                            <div className="bg-primary/5 border-l-2 border-accent p-4 mb-6">
                              <p className="text-xs font-bold uppercase tracking-wider text-accent mb-1">
                                Why It Matters
                              </p>
                              <p className="text-sm text-primary/70 leading-relaxed">
                                {value.insight}
                              </p>
                            </div>

                            {/* Stats */}
                            {value.stats && (
                              <div className="grid grid-cols-2 gap-4">
                                {value.stats.map((stat, statIndex) => (
                                  <div key={statIndex} className="bg-surface border border-primary/10 p-4">
                                    <div className="text-2xl md:text-3xl font-bold text-accent mb-1">
                                      {stat.value}
                                    </div>
                                    <div className="text-xs uppercase tracking-wider text-primary/60">
                                      {stat.label}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-sm md:text-base leading-relaxed text-primary/60 mb-4">
                              {value.shortDescription}
                            </p>

                            {/* Mobile stats preview */}
                            {value.stats && (
                              <div className="flex gap-4 mb-4">
                                {value.stats.slice(0, 2).map((stat, statIndex) => (
                                  <div key={statIndex} className="text-xs">
                                    <span className="font-bold text-accent">{stat.value}</span>
                                    <span className="text-primary/40 ml-1">{stat.label}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Action footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-primary/10">
                      {/* Expand/Collapse button */}
                      <button
                        onClick={() => toggleExpanded(index)}
                        className={`
                          flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]
                          transition-all duration-300 group
                          ${isHovered ? 'text-accent' : 'text-primary/40'}
                        `}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${value.title} details`}
                      >
                        <span>{isExpanded ? 'Show Less' : 'Learn More'}</span>
                        <motion.svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
                        </motion.svg>
                      </button>

                      {/* Corner accent */}
                      <motion.div
                        className="w-8 h-8 border-r-2 border-b-2 border-accent/30"
                        animate={{
                          opacity: isHovered ? 1 : 0.3,
                          scale: isHovered ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Animated border gradient */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={false}
                    animate={{
                      background: isHovered
                        ? 'linear-gradient(45deg, transparent 40%, rgba(152, 90, 61, 0.1) 50%, transparent 60%)'
                        : 'transparent',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ backgroundSize: '200% 200%' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 md:mt-24 text-center"
        >
          <p className="text-sm md:text-base text-primary/60 mb-8 max-w-2xl mx-auto">
            These values aren't just words on a page—they're the foundation of every project we undertake and every relationship we build.
          </p>
          <a
            href="/contact"
            className="group inline-flex items-center gap-4 px-10 py-5 bg-primary text-white transition-all duration-300 hover:bg-accent hover:shadow-2xl hover:shadow-accent/20"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Work With Us
            </span>
            <svg
              className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent pointer-events-none"></div>
    </section>
  );
};

export default CoreValues;
