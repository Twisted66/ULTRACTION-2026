import { useState, useEffect } from 'react';

interface Stat {
  number: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    number: '400',
    label: 'Professionals',
    description: 'Skilled professionals on our team. Our team brings together many professionals ready to take on any size challenge.'
  },
  {
    number: '18',
    label: 'Awards',
    description: 'Construction quality awards. Our commitment has been recognized with awards and certifications.'
  },
  {
    number: '62',
    label: 'Cities',
    description: 'Cities where we have left our mark. Our construction achievements span more than 62 cities.'
  },
  {
    number: '4000',
    label: 'Customers',
    description: 'Satisfied customers. We\'ve built not just buildings, but long-term relationships.'
  },
  {
    number: '98',
    label: 'Satisfaction',
    description: 'Satisfied customers. Our commitment to service excellence is reflected in our customer satisfaction levels.'
  }
];

export default function Stats() {
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts(prev => prev.map((count, i) => {
        const target = parseInt(stats[i].number) || 0;
        if (count < target) {
          const increment = Math.ceil(target / 50);
          return Math.min(count + increment, target);
        }
        return target;
      }));
    }, 50);

    // Clear interval after animation completes
    const maxTarget = Math.max(...stats.map(s => parseInt(s.number) || 0));
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const getSuffix = (label: string) => {
    if (label === 'Satisfaction') return '%';
    if (label === 'Customers') return '+';
    return '';
  };

  return (
    <section className="border-b border-primary/20 dark:border-white/20">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Stats Grid */}
        <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 border-r-0 lg:border-r border-primary/20 dark:border-white/20">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-8 lg:p-12 border-b border-primary/20 dark:border-white/20 h-80 flex flex-col justify-between"
            >
              <div>
                <span className="block text-5xl lg:text-6xl font-bold mb-2 font-heading tabular-nums">
                  {counts[i]}{getSuffix(stat.label)}
                </span>
                <span className="text-xs uppercase tracking-widest opacity-60">{stat.label}</span>
              </div>
              <p className="text-sm leading-relaxed mt-4 opacity-80 font-body">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Image */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#DDD4C5] dark:bg-[#2A2621]">
          <div className="flex-1 p-8 lg:p-12 xl:p-20 flex items-center justify-center">
            <div
              className="w-full h-full relative overflow-hidden shadow-2xl bg-cover bg-center"
              style={{ backgroundImage: "url('/images/projects/p184_img01_xref7175.jpeg')" }}
              role="img"
              aria-label="Project Completion - Infrastructure Development"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
