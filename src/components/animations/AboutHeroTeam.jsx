/**
 * AboutHeroTeam - Elegant About Us hero with bridge image
 * Clean, minimal design with CSS entrance animations
 */

import React, { useEffect, useState } from 'react';

export const AboutHeroTeam = ({
  title = 'About Us',
  tagline = 'Building Tomorrow\'s Infrastructure',
  description = 'With decades of expertise in construction and infrastructure, we transform ambitious visions into enduring landmarks across the UAE.',
  imageSrc = '/images/bridge_hero.jpg',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animations after mount
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageSrc}
          alt="Modern bridge infrastructure"
          className="w-full h-full object-cover"
          style={{
            filter: 'brightness(0.85) saturate(0.9)',
            transition: 'transform 8s ease-out',
            transform: mounted ? 'scale(1.04)' : 'scale(1)',
          }}
        />
      </div>

      {/* Warm overlay — blends with brand beige */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(232,220,200,0.45) 0%, rgba(232,220,200,0.15) 40%, rgba(20,20,20,0.50) 100%)',
        }}
      />

      {/* Thin decorative top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(44,24,16,0.25) 50%, transparent 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen px-8 md:px-16 lg:px-24 pb-24 md:pb-32">
        {/* Label */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            transitionDelay: '0.2s',
          }}
        >
          <span
            className="inline-block mb-6 md:mb-8"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#e8dcc8',
              borderBottom: '1px solid rgba(232,220,200,0.4)',
              paddingBottom: '4px',
            }}
          >
            {title}
          </span>
        </div>

        {/* Main Heading */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1s ease, transform 1s ease',
            transitionDelay: '0.45s',
          }}
        >
          <h1
            style={{
              fontFamily: "'Public Sans', system-ui, sans-serif",
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 300,
              lineHeight: 1.08,
              color: '#f5f5f0',
              letterSpacing: '-0.02em',
              maxWidth: '800px',
              margin: 0,
            }}
          >
            {tagline}
          </h1>
        </div>

        {/* Decorative Line */}
        <div
          style={{
            marginTop: '32px',
            marginBottom: '24px',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 1.2s ease',
            transitionDelay: '0.8s',
          }}
        >
          <div
            style={{
              width: mounted ? '80px' : '0px',
              height: '1px',
              backgroundColor: 'rgba(232,220,200,0.6)',
              transition: 'width 1.4s ease',
              transitionDelay: '0.8s',
            }}
          />
        </div>

        {/* Description */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease, transform 1s ease',
            transitionDelay: '1s',
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              fontWeight: 400,
              lineHeight: 1.7,
              color: 'rgba(245,245,240,0.75)',
              maxWidth: '520px',
              margin: 0,
            }}
          >
            {description}
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2"
          style={{
            transform: 'translateX(-50%)',
            opacity: mounted ? 0.5 : 0,
            transition: 'opacity 1.2s ease',
            transitionDelay: '1.6s',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: '#e8dcc8',
              }}
            >
              Scroll
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e8dcc8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: 'aboutHeroChevronBounce 2s ease-in-out infinite',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom gradient border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(232,220,200,0.2) 50%, transparent 100%)',
        }}
      />

      {/* Keyframe animation for the chevron */}
      <style>{`
        @keyframes aboutHeroChevronBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
};

export default AboutHeroTeam;
