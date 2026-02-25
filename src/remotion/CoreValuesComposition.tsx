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

const coreValues = [
    {
        id: 'integrity',
        title: 'Integrity',
        description: 'Unwavering honesty and transparency in every interaction and commitment.',
        insight: 'We communicate clearly, honor commitments, and take ownership from planning to handover.',
        img: 'images/projects/photo_010.jpeg'
    },
    {
        id: 'team-spirit',
        title: 'Team Spirit',
        description: 'Collaborative excellence driven by shared purpose and mutual respect.',
        insight: 'Engineers, supervisors, and site teams align early so execution stays coordinated and efficient.',
        img: 'images/projects/photo_016.jpeg'
    },
    {
        id: 'commitment',
        title: 'Commitment',
        description: 'Dedicated to delivering excellence from foundation to final handover.',
        insight: 'We stay accountable to schedule, quality, and client outcomes across every project milestone.',
        img: 'images/projects/photo_018.jpeg'
    },
    {
        id: 'sustainability',
        title: 'Sustainability',
        description: 'Building responsibly for communities and the environment.',
        insight: 'Our choices prioritize durable systems, reduced waste, and long-term value for the built environment.',
        img: 'images/projects/qidfah-revitalization/hero.png'
    },
    {
        id: 'performance',
        title: 'Performance',
        description: 'Exceeding expectations through precision engineering and execution.',
        insight: 'We track progress and quality continuously to deliver predictable results under real site constraints.',
        img: 'images/projects/khalifa-port/hero.png'
    },
    {
        id: 'safety',
        title: 'Safety',
        description: 'Uncompromising standards protecting our people and communities.',
        insight: 'Risk planning, safe methods, and disciplined site behavior protect teams and project continuity.',
        img: 'images/projects/photo_015.jpeg'
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

    // Title spring animation
    const titleY = spring({
        frame: frame - 10,
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
        frame: frame - 40,
        fps,
        config: { damping: 12 },
    });

    const titleTransform = `translateY(${interpolate(titleY, [0, 1], [50, 0])}px)`;
    const descTransform = `translateY(${interpolate(descY, [0, 1], [50, 0])}px)`;
    const insightTransform = `translateY(${interpolate(insightY, [0, 1], [50, 0])}px)`;

    const titleOpacity = interpolate(titleY, [0, 1], [0, 1]);
    const descOpacity = interpolate(descY, [0, 1], [0, 1]);
    const insightOpacity = interpolate(insightY, [0, 1], [0, 1]);

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
            <AbsoluteFill className="p-12 md:p-24 flex flex-col justify-center max-w-5xl mx-auto items-center text-center">
                {/* Number Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                    <span className="font-heading text-[20rem] italic leading-none font-bold text-white">
                        {String(index + 1).padStart(2, '0')}
                    </span>
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
                    className="text-xl md:text-2xl font-light leading-loose text-white/90 relative z-10 max-w-3xl"
                >
                    {value.description}
                </p>

                <p
                    style={{
                        transform: insightTransform,
                        opacity: insightOpacity,
                    }}
                    className="mt-8 text-sm md:text-base font-medium tracking-widest uppercase text-accent relative z-10 max-w-2xl"
                >
                    {value.insight}
                </p>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
