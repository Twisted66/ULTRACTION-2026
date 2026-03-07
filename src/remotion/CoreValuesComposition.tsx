import React from 'react';
import {
    AbsoluteFill,
    Sequence,
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    Img
} from 'remotion';
import { Shield, Users, Target, Leaf, Zap, ShieldCheck } from 'lucide-react';

// Design tokens - pulled from project design system
const ACCENT = '#9a3324';
const WHITE = '#ffffff';
const BLACK = '#000000';

const coreValues = [
    {
        id: 'integrity',
        title: 'Integrity',
        description: 'Unwavering honesty and transparency in every interaction and commitment.',
        insight: 'We communicate clearly, honor commitments, and take ownership from planning to handover.',
        img: '/images/projects/photo_010.jpeg',
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
        img: '/images/projects/photo_016.jpeg',
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
        img: '/images/projects/photo_018.jpeg',
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
        img: '/images/projects/qidfah-revitalization/hero.png',
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
        img: '/images/projects/khalifa-port/hero.png',
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
        img: '/images/projects/photo_015.jpeg',
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
        <AbsoluteFill style={{ backgroundColor: '#0d0d0d', overflow: 'hidden' }}>
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

    // ── All animations via useCurrentFrame() (required by Remotion skill) ──

    // Scene fade-in/out
    const opacity = interpolate(
        frame,
        [0, 15, SCENE_DURATION_IN_FRAMES - 15, SCENE_DURATION_IN_FRAMES],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Cinematic parallax zoom on background image
    const bgScale = interpolate(
        frame,
        [0, SCENE_DURATION_IN_FRAMES],
        [1.05, 1.18],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Staggered spring entrances (recommended: damping: 200 for smooth no-bounce)
    const iconSpring = spring({ frame: frame - 5, fps, config: { damping: 200 } });
    const titleSpring = spring({ frame: frame - 12, fps, config: { damping: 200 } });
    const descSpring = spring({ frame: frame - 22, fps, config: { damping: 200 } });
    const insightSpring = spring({ frame: frame - 32, fps, config: { damping: 200 } });
    const statsSpring = spring({ frame: frame - 42, fps, config: { damping: 200 } });

    const yFrom = 60;

    const iconY = interpolate(iconSpring, [0, 1], [yFrom, 0]);
    const titleY = interpolate(titleSpring, [0, 1], [yFrom, 0]);
    const descY = interpolate(descSpring, [0, 1], [yFrom, 0]);
    const insightY = interpolate(insightSpring, [0, 1], [yFrom, 0]);
    const statsY = interpolate(statsSpring, [0, 1], [yFrom, 0]);

    const Icon = value.icon;

    return (
        <AbsoluteFill style={{ opacity }}>
            {/* Background Image with Ken Burns zoom */}
            <AbsoluteFill style={{ transform: `scale(${bgScale})`, transformOrigin: 'center center' }}>
                <Img
                    src={value.img}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        filter: 'saturate(1.18) contrast(1.04) brightness(1.03)',
                    }}
                />
            </AbsoluteFill>

            {/* Dark overlay */}
            <AbsoluteFill style={{ backgroundColor: 'rgba(0,0,0,0.52)' }} />

            {/* Left-to-right gradient for depth */}
            <AbsoluteFill style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.24) 58%, rgba(0,0,0,0.58) 100%)'
            }} />

            {/* Subtle accent corner glow */}
            <AbsoluteFill style={{
                background: `radial-gradient(ellipse at 0% 100%, ${ACCENT}33 0%, transparent 60%)`
            }} />

            {/* Content */}
            <AbsoluteFill style={{
                padding: '80px 120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}>
                {/* Watermark number */}
                <div style={{
                    position: 'absolute',
                    right: 80,
                    bottom: 60,
                    opacity: 0.04,
                    pointerEvents: 'none',
                    fontSize: 400,
                    fontWeight: 700,
                    fontStyle: 'italic',
                    color: WHITE,
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                    fontFamily: 'serif',
                }}>
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* Left Content Column + Right Stats */}
                <div style={{
                    display: 'flex',
                    gap: 80,
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 1680,
                }}>
                    {/* Main text column */}
                    <div style={{ flex: 1 }}>
                        {/* Icon */}
                        <div style={{
                            transform: `translateY(${iconY}px)`,
                            opacity: iconSpring,
                            marginBottom: 40,
                            padding: 24,
                            backgroundColor: ACCENT,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 20px 60px ${ACCENT}55`,
                        }}>
                            <Icon size={52} strokeWidth={1.5} color={WHITE} />
                        </div>

                        {/* Title */}
                        <h3 style={{
                            transform: `translateY(${titleY}px)`,
                            opacity: titleSpring,
                            fontSize: 92,
                            fontWeight: 700,
                            color: WHITE,
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            lineHeight: 0.95,
                            marginBottom: 32,
                            fontFamily: 'sans-serif',
                        }}>
                            {value.title}
                        </h3>

                        {/* Description */}
                        <p style={{
                            transform: `translateY(${descY}px)`,
                            opacity: descSpring,
                            fontSize: 28,
                            fontWeight: 300,
                            color: 'rgba(255,255,255,0.88)',
                            lineHeight: 1.65,
                            marginBottom: 40,
                            maxWidth: 740,
                            fontFamily: 'sans-serif',
                        }}>
                            {value.description}
                        </p>

                        {/* Insight box - glassmorphic */}
                        <div style={{
                            transform: `translateY(${insightY}px)`,
                            opacity: insightSpring,
                            padding: '20px 28px',
                            backgroundColor: 'rgba(255,255,255,0.07)',
                            borderLeft: `4px solid ${ACCENT}`,
                            backdropFilter: 'blur(8px)',
                            maxWidth: 740,
                        }}>
                            <p style={{
                                fontSize: 18,
                                fontWeight: 600,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                                color: 'rgba(255,255,255,0.9)',
                                fontFamily: 'sans-serif',
                                lineHeight: 1.6,
                            }}>
                                {value.insight}
                            </p>
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div style={{
                        transform: `translateY(${statsY}px)`,
                        opacity: statsSpring,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 24,
                        flexShrink: 0,
                    }}>
                        {value.stats.map((stat, i) => (
                            <div key={i} style={{
                                backgroundColor: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                padding: '28px 36px',
                                width: 280,
                                backdropFilter: 'blur(8px)',
                            }}>
                                <div style={{
                                    fontSize: 56,
                                    fontWeight: 700,
                                    fontStyle: 'italic',
                                    color: ACCENT,
                                    lineHeight: 1,
                                    marginBottom: 8,
                                    fontFamily: 'sans-serif',
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontFamily: 'sans-serif',
                                }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};
