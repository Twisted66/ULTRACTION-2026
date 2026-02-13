/**
 * HomeStatsAnimation - Scroll-based reveal animation for the stats section
 * Uses IntersectionObserver to trigger staggered fade-in + translateY
 */

import React, { useEffect, useRef, useState } from 'react';

const HomeStatsAnimation = ({ children }) => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef}>
            <style>{`
        .stats-reveal-cell {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .stats-reveal-cell.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .stats-reveal-cell:nth-child(1) { transition-delay: 0s; }
        .stats-reveal-cell:nth-child(2) { transition-delay: 0.1s; }
        .stats-reveal-cell:nth-child(3) { transition-delay: 0.2s; }
        .stats-reveal-cell:nth-child(4) { transition-delay: 0.3s; }
        .stats-reveal-cell:nth-child(5) { transition-delay: 0.4s; }
        .stats-reveal-cell:nth-child(6) { transition-delay: 0.5s; }
        .stats-reveal-cell:nth-child(7) { transition-delay: 0.6s; }
        .stats-reveal-cell:nth-child(8) { transition-delay: 0.7s; }

        .stats-img-zoom {
          transition: transform 6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: scale(1);
        }
        .stats-img-zoom.is-visible {
          transform: scale(1.04);
        }
      `}</style>
            {React.Children.map(children, (child, index) => (
                <div
                    className={`stats-reveal-cell ${isVisible ? 'is-visible' : ''}`}
                    key={index}
                >
                    {child}
                </div>
            ))}
        </div>
    );
};

export default HomeStatsAnimation;
