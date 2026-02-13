import { useEffect, useState, useRef } from 'react';

/**
 * Animated counter component that counts up from 0 to the target number
 */
const AnimatedCounter = ({ target, suffix = '+', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      // Easing function for smooth animation (easeOutCubic)
      const easedPercentage = 1 - Math.pow(1 - percentage, 3);

      setCount(Math.floor(target * easedPercentage));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animateCount);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animateCount);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

/**
 * Icon component for stats
 */
const StatIcon = ({ iconName }) => {
  const icons = {
    calendar: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    check_circle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    people: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    group: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
  };

  return icons[iconName] || icons.check_circle;
};

/**
 * Stats section component displaying company achievements with animated counters
 *
 * @param {Array} stats - Array of stat objects with number, label, and icon
 * @param {string} className - Additional CSS classes
 */
const Stats = ({
  stats = [
    { number: 15, label: 'Years Experience', icon: 'calendar' },
    { number: 200, label: 'Projects Completed', icon: 'check_circle' },
    { number: 150, label: 'Happy Clients', icon: 'people' },
    { number: 50, label: 'Team Members', icon: 'group' }
  ],
  className = ''
}) => {
  return (
    <section
      className={`stats-section ${className}`}
      style={{
        backgroundColor: 'hsl(var(--color-surface))',
        padding: 'var(--space-12) 0',
      }}
    >
      <div className="stats-container" style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 var(--space-4)',
      }}>
        <div
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: 'var(--space-8)',
            textAlign: 'center',
          }}
        >
          {/* Mobile: 1 column */}
          <style>{`
            @media (min-width: 768px) {
              .stats-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
            @media (min-width: 1024px) {
              .stats-grid {
                grid-template-columns: repeat(4, 1fr) !important;
              }
            }
          `}</style>

          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-3)',
              }}
            >
              {/* Icon */}
              <div
                className="stat-icon"
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'hsl(var(--color-accent))',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <StatIcon iconName={stat.icon} />
              </div>

              {/* Animated Number */}
              <div
                className="stat-number"
                style={{
                  fontSize: 'var(--text-4xl)',
                  fontWeight: '700',
                  color: 'hsl(var(--color-accent))',
                  lineHeight: '1',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <AnimatedCounter target={stat.number} suffix="+" />
              </div>

              {/* Label */}
              <div
                className="stat-label"
                style={{
                  fontSize: 'var(--text-sm)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'hsl(var(--color-muted-foreground))',
                  fontWeight: '500',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global styles for the stats section */}
      <style>{`
        .stats-section {
          width: 100%;
        }

        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }

        /* Smooth hover effect */
        .stat-item {
          transition: transform 0.3s ease;
        }

        .stat-item:hover {
          transform: translateY(-4px);
        }

        /* Icon animation on hover */
        .stat-icon {
          transition: transform 0.3s ease;
        }

        .stat-item:hover .stat-icon {
          transform: scale(1.1);
        }

        .stat-icon svg {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default Stats;
