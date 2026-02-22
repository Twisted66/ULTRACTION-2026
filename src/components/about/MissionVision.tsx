import React from 'react';
import { Target, Eye, ShieldCheck, Clock, Handshake, HardHat, Leaf, Zap } from 'lucide-react';

interface MissionVisionProps {
  className?: string;
}

// Data directly in component or imported - keeping it here for simplicity as per original
const missionData = {
  label: 'Mission',
  title: 'Building Excellence',
  subtitle: 'Delivering Value Through Quality & Trust',
  description: 'To be the builder of choice by delivering quality projects on time, maximizing value for investment, and building enduring relationships with every client.',
  pillars: [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Quality First',
      text: 'Exceeding standards in every project'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'On-Time Delivery',
      text: 'Respecting deadlines and commitments'
    },
    {
      icon: <Handshake className="w-6 h-6" />,
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
  description: "We maintain a steadfast commitment to quality and environmental awareness across all operations, ensuring every project meets today's standards and tomorrow's needs.",
  principles: [
    {
      icon: <HardHat className="w-5 h-5" />,
      text: 'Safety First Culture'
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      text: 'Environmental Responsibility'
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: 'Continuous Innovation'
    }
  ]
};

const MissionVision: React.FC<MissionVisionProps> = ({ className = '' }) => {
  return (
    <section className={`relative bg-surface py-20 md:py-32 overflow-hidden ${className}`}>
      {/* Grid Pattern Background - Industrial Look */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative z-10">

        {/* Section Header - Left Aligned */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-accent"></div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Our Purpose</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-primary leading-tight">
            Guided by Vision, <br className="hidden md:block" />
            <span className="text-accent italic font-light">Driven by Mission</span>
          </h2>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-primary/10">

          {/* Mission Column */}
          <div className="group relative bg-background/50 hover:bg-background transition-colors duration-500 border-b lg:border-b-0 lg:border-r border-primary/10 p-8 md:p-12 lg:p-16">
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-accent transition-all duration-500 ease-out"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-accent/10 text-accent rounded-none">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-accent mb-1">{missionData.label}</span>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary">{missionData.title}</h3>
              </div>
            </div>

            <p className="text-lg font-medium text-primary/80 mb-6">{missionData.subtitle}</p>
            <p className="text-base text-primary/60 leading-relaxed mb-12 max-w-md">{missionData.description}</p>

            <div className="grid grid-cols-1 gap-6">
              {missionData.pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border border-primary/5 hover:border-accent/30 bg-surface hover:bg-accent hover:text-white transition-all duration-300 group">
                  <div className="text-accent mt-1 group-hover:text-white transition-colors duration-300">{pillar.icon}</div>
                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wide group-hover:text-white transition-colors duration-300">{pillar.title}</h4>
                    <p className="text-sm text-primary/60 mt-1 group-hover:text-white/80 transition-colors duration-300">{pillar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Column */}
          <div className="group relative bg-background/50 hover:bg-background transition-colors duration-500 p-8 md:p-12 lg:p-16">
            <div className="absolute bottom-0 right-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-500 ease-out"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-primary/10 text-primary rounded-none">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <span className="block text-xs font-bold uppercase tracking-widest text-primary mb-1">{visionData.label}</span>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-primary">{visionData.title}</h3>
              </div>
            </div>

            <p className="text-lg font-medium text-primary/80 mb-6">{visionData.subtitle}</p>
            <p className="text-base text-primary/60 leading-relaxed mb-12 max-w-md">{visionData.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-12">
              {visionData.highlights.map((stat, idx) => (
                <div key={idx} className="text-center p-4 bg-surface border border-primary/5 hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-3xl font-heading font-bold text-accent mb-2">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/60">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="relative pl-6 border-l-2 border-accent/20 italic text-primary/70">
              "Leading the future of construction through innovation, integrity, and inspired performance."
            </div>
          </div>

        </div>

        {/* Quality Banner - Industrial Footer */}
        <div className="mt-16 bg-primary text-white p-8 md:p-12 relative overflow-hidden">
          {/* Decorative grid on dark background - maroon dots */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--accent)) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="block text-xs font-bold uppercase tracking-[0.2em] text-accent-foreground/60 mb-2">{qualityData.label}</span>
              <h3 className="text-3xl md:text-4xl font-heading font-semibold mb-4">{qualityData.title}</h3>
              <p className="text-primary-foreground/70 leading-relaxed">{qualityData.description}</p>
            </div>
            <div className="lg:col-span-7 flex flex-wrap gap-4 lg:justify-end">
              {qualityData.principles.map((principle, idx) => (
                <div key={idx} className="inline-flex items-center gap-3 px-6 py-3 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <span className="text-accent">{principle.icon}</span>
                  <span className="text-sm font-medium tracking-wide">{principle.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MissionVision;

