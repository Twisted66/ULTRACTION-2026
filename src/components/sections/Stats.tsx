import { useState, useEffect, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

interface Stat {
  number: number;
  label: string;
  suffix: string;
}

// ============================================================================
// Data
// ============================================================================

const stats: Stat[] = [
  { number: 400, label: 'Professionals', suffix: '' },
  { number: 18, label: 'Awards', suffix: '' },
  { number: 62, label: 'Cities', suffix: '' },
  { number: 4, label: 'Thousands', suffix: '' },
  { number: 98, label: 'Percent', suffix: '%' },
];

const statDescriptions: Record<string, string> = {
  Professionals:
    'Skilled professionals on our team. Our team brings together many professionals ready to take on any size challenge. We create a team that inspires trust.',
  Awards:
    'Construction quality awards. Our commitment has been recognized with awards and certifications.',
  Cities:
    'Cities where we have left our mark. Our construction achievements span more than 62 cities.',
  Thousands:
    "Satisfied customers. We've built not just buildings, but long-term relationships.",
  Percent:
    'Satisfied customers. Our commitment to service excellence is reflected in our customer satisfaction levels.',
};

// ============================================================================
// AnimatedCounter — rAF + easeOutCubic + IntersectionObserver
// ============================================================================

function AnimatedCounter({
  target,
  suffix,
  duration = 2000,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Scroll trigger
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasAnimated]);

  // Smooth animation with easeOutCubic
  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [hasAnimated, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

// ============================================================================
// Main Stats Component — Magazine-style grid layout
// ============================================================================

export default function Stats() {
  return (
    <section className="border-b border-black dark:border-black">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Stats Grid with interspersed images */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 border-r-0 lg:border-r border-black dark:border-black">
          {/* Row 1: Stat + Image */}
          <div className="p-6 sm:p-8 border-b md:border-r border-black dark:border-black min-h-[240px] sm:h-80 flex flex-col justify-between">
            <div>
              <span className="block text-5xl sm:text-6xl font-bold mb-2">
                <AnimatedCounter target={stats[0].number} suffix={stats[0].suffix} />
              </span>
              <span className="text-xs uppercase tracking-widest font-bold">
                {stats[0].label}
              </span>
            </div>
            <p className="text-sm leading-relaxed mt-4">
              {statDescriptions[stats[0].label]}
            </p>
          </div>
          <div className="border-b border-black dark:border-black min-h-[240px] sm:h-80 overflow-hidden relative group">
            <img
              alt="Al Tallah Road Bridge"
              className="w-full h-full object-cover transition-transform motion-slow media-motion group-hover:scale-110"
              src="/images/projects/al-tallah-bridge/photo_003.jpeg"
            />
          </div>

          {/* Row 2: Image + Stat */}
          <div className="border-b border-black dark:border-black md:border-r min-h-[200px] sm:h-64 overflow-hidden">
            <img
              alt="E20 Traffic Bridge"
              className="w-full h-full object-cover"
              src="/images/projects/e20-traffic-bridges/photo_010.jpeg"
            />
          </div>
          <div className="p-6 sm:p-8 border-b border-black dark:border-black min-h-[200px] sm:h-64 flex flex-col justify-between">
            <div>
              <span className="block text-5xl sm:text-6xl font-bold mb-2">
                <AnimatedCounter target={stats[1].number} suffix={stats[1].suffix} />
              </span>
              <span className="text-xs uppercase tracking-widest font-bold">
                {stats[1].label}
              </span>
            </div>
            <p className="text-sm leading-relaxed mt-4">
              {statDescriptions[stats[1].label]}
            </p>
          </div>

          {/* Row 3: Stat + Image */}
          <div className="p-6 sm:p-8 border-b border-black dark:border-black md:border-r min-h-[200px] sm:h-64 flex flex-col justify-between">
            <div>
              <span className="block text-4xl sm:text-6xl font-bold mb-2">
                <AnimatedCounter target={stats[2].number} suffix={stats[2].suffix} />
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {stats[2].label}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm leading-relaxed mt-4">
              {statDescriptions[stats[2].label]}
            </p>
          </div>
          <div className="border-b border-black dark:border-black min-h-[200px] sm:h-64 overflow-hidden relative">
            <img
              alt="Inner Bypass E45 Road"
              className="w-full h-full object-cover"
              src="/images/projects/inner-bypass-e45/photo_014.jpeg"
            />
          </div>

          {/* Row 4: Stat + Stat */}
          <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-black dark:border-black min-h-[200px] sm:h-64 flex flex-col justify-between">
            <div>
              <span className="block text-4xl sm:text-6xl font-bold mb-2">
                <AnimatedCounter target={stats[3].number} suffix={stats[3].suffix} />
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {stats[3].label}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm leading-relaxed mt-4">
              {statDescriptions[stats[3].label]}
            </p>
          </div>
          <div className="p-6 sm:p-8 min-h-[200px] sm:h-64 flex flex-col justify-between">
            <div>
              <span className="block text-4xl sm:text-6xl font-bold mb-2">
                <AnimatedCounter target={stats[4].number} suffix={stats[4].suffix} />
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                {stats[4].label}
              </span>
            </div>
            <p className="text-[13px] sm:text-sm leading-relaxed mt-4">
              {statDescriptions[stats[4].label]}
            </p>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="w-full lg:w-1/2 flex flex-col bg-background dark:bg-card">
          <div className="flex-1 p-0 flex items-stretch justify-stretch min-h-[250px] lg:min-h-0">
            <div className="stats-motion-frame w-full h-full relative overflow-hidden shadow-2xl">
              <img
                src="/images/bridge_hero_v2.png"
                alt="Bridge Construction Hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
