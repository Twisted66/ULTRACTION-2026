import React from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Sequence } from 'remotion';

const IMAGES = [
    "/images/projects/naseem-albar-bridge/hero.png",
    "/images/projects/commercial/p108_img01_xref6681.jpeg",
    "/images/projects/al-tallah-bridge/photo_006.jpeg",
    "/images/projects/naseem-albar-bridge/hero.png"
];

const TRANSITION_DURATION = 30; // 1 second fading
const SLIDE_DURATION = 150; // 5 seconds per slide (before next one starts fading in)
const TOTAL_DURATION = IMAGES.length * SLIDE_DURATION;

interface KenBurnsImageProps {
    src: string;
    index: number;
    offsetFrame?: number;
    isWrap?: boolean;
}

const KenBurnsImage: React.FC<KenBurnsImageProps> = ({ src, index, offsetFrame = 0, isWrap = false }) => {
    const frame = useCurrentFrame();
    const effectiveFrame = frame + offsetFrame;

    // Animation Config
    const scaleStart = 1.35;
    const scaleEnd = 1.65;
    // We want the movement to be continuous over the full lifespan of the slide visibility
    // Life span = SLIDE_DURATION + TRANSITION_DURATION (approx)
    // But for the wrap image, it continues from where it left off.

    const animationDuration = SLIDE_DURATION + TRANSITION_DURATION;

    // Interpolate Scale
    const scale = interpolate(
        effectiveFrame,
        [0, animationDuration],
        [scaleStart, scaleEnd],
        { extrapolateRight: 'extend' }
    );

    // Interpolate Position (Pan)
    // Alternate directions
    const panDirection = index % 2 === 0 ? 1 : -1;
    const translateX = interpolate(
        effectiveFrame,
        [0, animationDuration],
        [0, -20 * panDirection],
        { extrapolateRight: 'extend' }
    );

    const translateY = interpolate(
        effectiveFrame,
        [0, animationDuration],
        [0, -10],
        { extrapolateRight: 'extend' }
    );

    // Opacity Logic (Fade In)
    // If it's the wrap image, it's already visible (opacity 1).
    // If it's a normal slide, it fades in over the first TRANSITION_DURATION frames.
    const opacity = isWrap
        ? 1
        : interpolate(
            frame,
            [0, TRANSITION_DURATION],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

    return (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
            <AbsoluteFill style={{ opacity }}>
                <Img
                    src={src}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
                    }}
                />
                {/* Subtle Overlays for mood without excessive darkening */}
                <AbsoluteFill style={{ backgroundColor: 'rgba(44, 24, 16, 0.05)', mixBlendMode: 'overlay' }} />
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

const HeroComposition = () => {
    return (
        <AbsoluteFill>
            {/* 
               Layer 0: The "Last" image wrapping around to the start.
               It corresponds to the last image in the array.
               It starts at frame 0. 
               Its animation state (pan/zoom) should continue from where it ended at TOTAL_DURATION.
               At TOTAL_DURATION, the last image has been playing for SLIDE_DURATION frames (since it started at (N-1)*SLIDE_DURATION).
               Wait, correct math:
               Img 0 starts at 0.
               Img Last starts at (N-1)*SlideDuration.
               At TotalDuration (N*SlideDuration), Img Last has played for SlideDuration frames.
               So we pass offsetFrame = SLIDE_DURATION.
            */}
            <Sequence from={0} durationInFrames={TRANSITION_DURATION + 10} layout="none">
                <KenBurnsImage
                    src={IMAGES[IMAGES.length - 1]}
                    index={IMAGES.length - 1}
                    offsetFrame={SLIDE_DURATION}
                    isWrap={true}
                />
            </Sequence>

            {IMAGES.map((src, i) => (
                <Sequence
                    key={i}
                    from={i * SLIDE_DURATION}
                    durationInFrames={SLIDE_DURATION + TRANSITION_DURATION}
                    layout="none"
                >
                    <KenBurnsImage src={src} index={i} />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};

const AboutHeroRemotion = () => {
    return (
        <div className="w-full h-full relative overflow-hidden">
            <Player
                component={HeroComposition}
                durationInFrames={TOTAL_DURATION}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                loop
                autoPlay
                controls={false}
                style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                    objectFit: 'cover',
                }}
            />
            {/* Integrated gradient overlay to blend with the page */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/20 via-transparent to-transparent" />
            <div className="absolute inset-0 pointer-events-none border-l border-white/10" />
        </div>
    );
};

export default AboutHeroRemotion;
