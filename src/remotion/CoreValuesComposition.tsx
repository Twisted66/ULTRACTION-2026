import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Img,
    staticFile
} from 'remotion';
import { Shield, Users, Target, Leaf, Zap, ShieldCheck } from 'lucide-react';

const coreValues = [
    {
        id: 'integrity',
        title: 'Integrity',
        description: 'Unwavering honesty and transparency in every interaction and commitment.',
        insight: 'We communicate clearly, honor commitments, and take ownership from planning to handover.',
        img: 'images/projects/photo_010.jpeg',
        icon: Shield,
        stats: [
            { label: 'Client Trust', value: '100%' },
            { label: 'On-Time Delivery', value: '98%' }
        ]
    },
    {
        id: 'team-spirit',
        title: 'Team Spirit',
        description: 'Collaborative excellence driven by shared purpose and mutual respect.',
        insight: 'Engineers, supervisors, and site teams align early so execution stays coordinated and efficient.',
        img: 'images/projects/photo_016.jpeg',
        icon: Users,
        stats: [
            { label: 'Team Collaboration', value: 'A+' },
            { label: 'Safety Rating', value: '5-Star' }
        ]
    },
    {
        id: 'commitment',
        title: 'Commitment',
        description: 'Dedicated to delivering excellence from foundation to final handover.',
        insight: 'We stay accountable to schedule, quality, and client outcomes across every project milestone.',
        img: 'images/projects/photo_018.jpeg',
        icon: Target,
        stats: [
            { label: 'Project Completion', value: '100%' },
            { label: 'Client Satisfaction', value: '97%' }
        ]
    },
    {
        id: 'sustainability',
        title: 'Sustainability',
        description: 'Building responsibly for communities and the environment.',
        insight: 'Our choices prioritize durable systems, reduced waste, and long-term value for the built environment.',
        img: 'images/projects/qidfah-revitalization/hero.png',
        icon: Leaf,
        stats: [
            { label: 'Green Projects', value: '85%' },
            { label: 'Waste Reduction', value: '40%' }
        ]
    },
    {
        id: 'performance',
        title: 'Performance',
        description: 'Exceeding expectations through precision engineering and execution.',
        insight: 'We track progress and quality continuously to deliver predictable results under real site constraints.',
        img: 'images/projects/khalifa-port/hero.png',
        icon: Zap,
        stats: [
            { label: 'Quality Score', value: '99%' },
            { label: 'Efficiency Rate', value: '95%' }
        ]
    },
    {
        id: 'safety',
        title: 'Safety',
        description: 'Uncompromising standards protecting our people and communities.',
        insight: 'Risk planning, safe methods, and disciplined site behavior protect teams and project continuity.',
        img: 'images/projects/photo_015.jpeg',
        icon: ShieldCheck,
        stats: [
            { label: 'Accident-Free Days', value: '500+' },
            { label: 'Safety Rating', value: 'ISO 45001' }
        ]
    }
];

export const SCENE_DURATION_IN_FRAMES = 120; // 4 seconds at 30fps

export const CoreValuesComposition: React.FC = () => {
    return (
        <AbsoluteFill className="bg-surface overflow-hidden">
            {coreValues.map((value, index) => {
                return (
                    <Sequence
                        key={value.id}
                        from={index * SCENE_DURATION_IN_FRAMES}
                        durationInFrames={SCENE_DURATION_IN_FRAMES}
                    >
                        <CoreValueScene value={value} index={index} />
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};

const CoreValueScene: React.FC<{
    value: typeof coreValues[0];
    index: number;
}> = ({ value, index }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Opacity fade in and out for the scene
    const opacity = interpolate(
        frame,
        [0, 15, SCENE_DURATION_IN_FRAMES - 15, SCENE_DURATION_IN_FRAMES],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Cinematic zoom for the image
    const scale = interpolate(
        frame,
        [0, SCENE_DURATION_IN_FRAMES],
        [1, 1.15],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Icon spring animation
    const iconY = spring({
        frame: frame - 5,
        fps,
        config: { damping: 12 },
    });

    // Title spring animation
    const titleY = spring({
        frame: frame - 15,
        fps,
        config: { damping: 12 },
    });

    // Description spring animation
    const descY = spring({
        frame: frame - 25,
        fps,
        config: { damping: 12 },
    });

    // Insight spring animation
    const insightY = spring({
        frame: frame - 35,
        fps,
        config: { damping: 12 },
    });

    // Stats spring animation
    const statsY = spring({
        frame: frame - 45,
        fps,
        config: { damping: 12 },
    });

    const iconTransform = `translateY(${interpolate(iconY, [0, 1], [50, 0])}px)`;
    const titleTransform = `translateY(${interpolate(titleY, [0, 1], [50, 0])}px)`;
    const descTransform = `translateY(${interpolate(descY, [0, 1], [50, 0])}px)`;
    const insightTransform = `translateY(${interpolate(insightY, [0, 1], [50, 0])}px)`;
    const statsTransform = `translateY(${interpolate(statsY, [0, 1], [50, 0])}px)`;

    const iconOpacity = interpolate(iconY, [0, 1], [0, 1]);
    const titleOpacity = interpolate(titleY, [0, 1], [0, 1]);
    const descOpacity = interpolate(descY, [0, 1], [0, 1]);
    const insightOpacity = interpolate(insightY, [0, 1], [0, 1]);
    const statsOpacity = interpolate(statsY, [0, 1], [0, 1]);

    const Icon = value.icon;

    return (
        <AbsoluteFill style={{ opacity }}>
            {/* Background Image */}
            <AbsoluteFill style={{ transform: `scale(${scale})` }}>
                <Img
                    src={staticFile(value.img)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </AbsoluteFill>

            {/* Dark Overlay focused on center */}
            <AbsoluteFill className="bg-primary/80" />

            {/* Subtle gradient to ensure text readability */}
            <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.85) 100%)' }} />

            {/* Content */}
            <AbsoluteFill className="p-8 md:p-16 lg:p-24 flex flex-col justify-center items-start text-left w-full h-full">
                {/* Number Watermark positioned behind the text but anchored right */}
                <div className="absolute right-10 bottom-10 opacity-[0.03] pointer-events-none md:right-24 md:bottom-24">
                    <span className="font-heading text-[15rem] md:text-[30rem] italic leading-none font-bold text-white">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                <div className="flex gap-8 lg:gap-16 items-center w-full max-w-7xl relative z-10">
                    <div className="flex-1 max-w-3xl">
                        <div
                            style={{
                                transform: iconTransform,
                                opacity: iconOpacity,
                            }}
                            className="mb-8 p-5 rounded-none bg-accent text-white shadow-2xl inline-block"
                        >
                            <Icon size={48} strokeWidth={1.5} />
                        </div>

                        <h3
                            style={{
                                transform: titleTransform,
                                opacity: titleOpacity,
                            }}
                            className="text-4xl md:text-5xl lg:text-7xl font-heading mb-6 text-white uppercase tracking-wider text-shadow-sm"
                        >
                            {value.title}
                        </h3>

                        <p
                            style={{
                                transform: descTransform,
                                opacity: descOpacity,
                            }}
                            className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed text-white/90 mb-8"
                        >
                            {value.description}
                        </p>

                        <div
                            style={{
                                transform: insightTransform,
                                opacity: insightOpacity,
                            }}
                            className="px-6 py-4 bg-white/10 backdrop-blur-md border-l-4 border-accent shadow-xl"
                        >
                            <p className="text-sm md:text-base font-medium tracking-widest uppercase text-white">
                                {value.insight}
                            </p>
                        </div>
                    </div>

                    {/* Stats Section on Right Side */}
                    <div
                        style={{
                            transform: statsTransform,
                            opacity: statsOpacity,
                        }}
                        className="hidden md:flex flex-col gap-6"
                    >
                        {value.stats.map((stat, i) => (
                            <div key={i} className="bg-surface/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl w-64">
                                <div className="text-4xl lg:text-5xl font-bold text-accent mb-2 font-heading italic">
                                    {stat.value}
                                </div>
                                <div className="text-xs lg:text-sm uppercase tracking-[0.2em] text-white/80 font-bold">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Stats (only shown on small screens) */}
                <div
                    style={{
                        transform: statsTransform,
                        opacity: statsOpacity,
                    }}
                    className="flex md:hidden gap-4 mt-8 w-full"
                >
                    {value.stats.map((stat, i) => (
                        <div key={i} className="bg-surface/10 backdrop-blur-sm border border-white/20 p-4 flex-1">
                            <div className="text-2xl font-bold text-accent mb-1 font-heading italic">
                                {stat.value}
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-white/80 font-bold">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
