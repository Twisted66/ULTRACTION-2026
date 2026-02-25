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
        icon: Shield
    },
    {
        id: 'team-spirit',
        title: 'Team Spirit',
        description: 'Collaborative excellence driven by shared purpose and mutual respect.',
        insight: 'Engineers, supervisors, and site teams align early so execution stays coordinated and efficient.',
        img: 'images/projects/photo_016.jpeg',
        icon: Users
    },
    {
        id: 'commitment',
        title: 'Commitment',
        description: 'Dedicated to delivering excellence from foundation to final handover.',
        insight: 'We stay accountable to schedule, quality, and client outcomes across every project milestone.',
        img: 'images/projects/photo_018.jpeg',
        icon: Target
    },
    {
        id: 'sustainability',
        title: 'Sustainability',
        description: 'Building responsibly for communities and the environment.',
        insight: 'Our choices prioritize durable systems, reduced waste, and long-term value for the built environment.',
        img: 'images/projects/qidfah-revitalization/hero.png',
        icon: Leaf
    },
    {
        id: 'performance',
        title: 'Performance',
        description: 'Exceeding expectations through precision engineering and execution.',
        insight: 'We track progress and quality continuously to deliver predictable results under real site constraints.',
        img: 'images/projects/khalifa-port/hero.png',
        icon: Zap
    },
    {
        id: 'safety',
        title: 'Safety',
        description: 'Uncompromising standards protecting our people and communities.',
        insight: 'Risk planning, safe methods, and disciplined site behavior protect teams and project continuity.',
        img: 'images/projects/photo_015.jpeg',
        icon: ShieldCheck
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
        [1, 1.1],
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
        frame: frame - 30,
        fps,
        config: { damping: 12 },
    });

    // Insight spring animation
    const insightY = spring({
        frame: frame - 45,
        fps,
        config: { damping: 12 },
    });

    const iconTransform = `translateY(${interpolate(iconY, [0, 1], [50, 0])}px)`;

    const titleTransform = `translateY(${interpolate(titleY, [0, 1], [50, 0])}px)`;
    const descTransform = `translateY(${interpolate(descY, [0, 1], [50, 0])}px)`;
    const insightTransform = `translateY(${interpolate(insightY, [0, 1], [50, 0])}px)`;

    const iconOpacity = interpolate(iconY, [0, 1], [0, 1]);
    const titleOpacity = interpolate(titleY, [0, 1], [0, 1]);
    const descOpacity = interpolate(descY, [0, 1], [0, 1]);
    const insightOpacity = interpolate(insightY, [0, 1], [0, 1]);

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
            <AbsoluteFill className="bg-primary/75" />

            {/* Add subtle gradient to ensure text readability */}
            <AbsoluteFill style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)' }} />

            {/* Content */}
            <AbsoluteFill className="p-8 md:p-24 lg:p-32 flex flex-col justify-center items-start text-left w-full h-full">
                {/* Number Watermark positioned behind the text but anchored right */}
                <div className="absolute right-10 bottom-10 opacity-[0.03] pointer-events-none md:right-24 md:bottom-24">
                    <span className="font-heading text-[15rem] md:text-[30rem] italic leading-none font-bold text-white">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </div>

                <div
                    style={{
                        transform: iconTransform,
                        opacity: iconOpacity,
                    }}
                    className="mb-8 p-6 rounded-none bg-accent text-white relative z-10 shadow-2xl"
                >
                    <Icon size={64} strokeWidth={1.5} />
                </div>

                <h3
                    style={{
                        transform: titleTransform,
                        opacity: titleOpacity,
                    }}
                    className="text-4xl md:text-6xl font-heading mb-6 text-white uppercase tracking-wider relative z-10"
                >
                    {value.title}
                </h3>

                <p
                    style={{
                        transform: descTransform,
                        opacity: descOpacity,
                    }}
                    className="text-xl md:text-2xl font-light leading-loose text-white/90 relative z-10 max-w-4xl"
                >
                    {value.description}
                </p>

                <div
                    style={{
                        transform: insightTransform,
                        opacity: insightOpacity,
                    }}
                    className="mt-10 px-6 py-4 bg-white text-primary border-l-4 border-accent relative z-10 max-w-3xl shadow-xl"
                >
                    <p className="text-sm md:text-base font-medium tracking-widest uppercase">
                        {value.insight}
                    </p>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
