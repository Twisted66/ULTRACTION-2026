import React from 'react';
import { motion } from 'framer-motion';
import './MissionVision.css';

interface MissionVisionProps {
  className?: string;
}

// Enhanced content data for Mission & Vision
const missionData = {
  label: 'Mission',
  title: 'Building Excellence',
  subtitle: 'Delivering Value Through Quality & Trust',
  description: 'To be the builder of choice by delivering quality projects on time, maximizing value for investment, and building enduring relationships with every client.',
  pillars: [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Quality First',
      text: 'Exceeding standards in every project'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: 'On-Time Delivery',
      text: 'Respecting deadlines and commitments'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Lasting Partnerships',
      text: 'Building trust through collaboration'
    }
  ]
};

const visionData = {
  label: 'Vision',
  title: 'Regional Leadership',
  subtitle: 'Premier Civil Contractor in the Middle East',
  description: 'To emerge as a premier civil contractor in the Middle East through unwavering dedication, superior design, timely completion, and consistent performance.',
  highlights: [
    {
      value: '15+',
      label: 'Years of Excellence'
    },
    {
      value: '200+',
      label: 'Projects Delivered'
    },
    {
      value: '100%',
      label: 'Client Satisfaction'
    }
  ]
};

const qualityData = {
  label: 'Our Commitment',
  title: 'Quality & Sustainability',
  description: 'We maintain a steadfast commitment to quality and environmental awareness across all operations, ensuring every project meets today\'s standards and tomorrow\'s needs.',
  principles: [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
      text: 'Safety First Culture'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="M4.93 19.07l2.83-2.83" />
          <path d="M16.24 7.76l2.83-2.83" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      text: 'Environmental Responsibility'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      text: 'Continuous Innovation'
    }
  ]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.4, 0.25, 1]
    }
  }
};

const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1]
    }
  }
};

// Pillar Card Component
const PillarCard: React.FC<{ icon: React.ReactNode; title: string; text: string; index: number }> = ({ icon, title, text, index }) => (
  <motion.div
    variants={itemVariants}
    className="pillar-card group"
  >
    <div className="pillar-icon-wrapper">
      <div className="pillar-icon">{icon}</div>
    </div>
    <h4 className="pillar-title">{title}</h4>
    <p className="pillar-text">{text}</p>
  </motion.div>
);

// Stat Highlight Component
const StatHighlight: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
  <motion.div
    variants={scaleInVariants}
    className="stat-item"
  >
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </motion.div>
);

// Principle Badge Component
const PrincipleBadge: React.FC<{ icon: React.ReactNode; text: string; index: number }> = ({ icon, text, index }) => (
  <motion.div
    variants={itemVariants}
    className="principle-badge"
  >
    <span className="principle-icon">{icon}</span>
    <span className="principle-text">{text}</span>
  </motion.div>
);

const MissionVision: React.FC<MissionVisionProps> = ({ className = '' }) => {
  return (
    <section className={`mission-vision-section ${className}`}>
      {/* Background decorative elements */}
      <div className="mv-background">
        <div className="mv-grid-pattern"></div>
        <motion.div
          className="mv-accent-blob mv-blob-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="mv-accent-blob mv-blob-2"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mv-header"
      >
        <div className="mv-header-line left"></div>
        <span className="mv-label">Our Purpose</span>
        <div className="mv-header-line right"></div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mv-title"
      >
        Guided by Vision,
        <br />
        <span className="mv-title-accent">Driven by Mission</span>
      </motion.h2>

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mv-grid"
      >
        {/* Mission Column */}
        <motion.div variants={itemVariants} className="mv-column mission-column">
          <div className="mv-card mission-card">
            <div className="mv-card-header">
              <div className="mv-card-icon mission-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <div>
                <span className="mv-card-label">{missionData.label}</span>
                <h3 className="mv-card-title">{missionData.title}</h3>
              </div>
            </div>

            <p className="mv-card-subtitle">{missionData.subtitle}</p>
            <p className="mv-card-description">{missionData.description}</p>

            <div className="mv-pillars">
              {missionData.pillars.map((pillar, idx) => (
                <PillarCard key={idx} {...pillar} index={idx} />
              ))}
            </div>
          </div>

          {/* Image collage for mission */}
          <motion.div
            variants={scaleInVariants}
            className="mv-image-collage mission-collage"
          >
            <div className="collage-image main">
              <img src="/images/projects/naseem-albar-bridge/hero.png" alt="ULTRACTION construction excellence" />
            </div>
            <div className="collage-image secondary">
              <img src="/images/projects/naseem-albar-bridge/photo_038.jpeg" alt="Quality construction details" />
            </div>
          </motion.div>
        </motion.div>

        {/* Vision Column */}
        <motion.div variants={itemVariants} className="mv-column vision-column">
          <div className="mv-card vision-card">
            <div className="mv-card-header">
              <div className="mv-card-icon vision-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <span className="mv-card-label">{visionData.label}</span>
                <h3 className="mv-card-title">{visionData.title}</h3>
              </div>
            </div>

            <p className="mv-card-subtitle">{visionData.subtitle}</p>
            <p className="mv-card-description">{visionData.description}</p>

            <div className="mv-stats">
              {visionData.highlights.map((stat, idx) => (
                <StatHighlight key={idx} {...stat} index={idx} />
              ))}
            </div>

            {/* Vision statement accent */}
            <motion.div
              className="vision-accent-quote"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="quote-icon">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p>
                Leading the future of construction through innovation, integrity, and inspired performance.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quality Commitment Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="quality-banner"
      >
        <div className="quality-banner-content">
          <div className="quality-header">
            <span className="quality-label">{qualityData.label}</span>
            <h3 className="quality-title">{qualityData.title}</h3>
          </div>
          <p className="quality-description">{qualityData.description}</p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="principles-list"
          >
            {qualityData.principles.map((principle, idx) => (
              <PrincipleBadge key={idx} {...principle} index={idx} />
            ))}
          </motion.div>
        </div>

        {/* Decorative element */}
        <div className="quality-banner-decoration">
          <svg viewBox="0 0 100 100" fill="none" className="decoration-svg">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" opacity="0.15" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" opacity="0.1" />
          </svg>
        </div>
      </motion.div>

      {/* Bottom decorative line */}
      <div className="mv-bottom-line"></div>
    </section>
  );
};

export default MissionVision;
