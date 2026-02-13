import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, Sequence } from 'remotion';

export interface KenBurnsSlideshowProps {
    images: string[];
    slideDuration?: number;
    transitionDuration?: number;
}

const KenBurnsImage: React.FC<{
    src: string;
    index: number;
    offsetFrame?: number;
    isWrap?: boolean;
    slideDuration: number;
    transitionDuration: number;
}> = ({ src, index, offsetFrame = 0, isWrap = false, slideDuration, transitionDuration }) => {
    const frame = useCurrentFrame();
    const effectiveFrame = frame + offsetFrame;

    // Animation Config
    const scaleStart = 1.35;
    const scaleEnd = 1.65;
    const animationDuration = slideDuration + transitionDuration;

    // Interpolate Scale
    const scale = interpolate(
        effectiveFrame,
        [0, animationDuration],
        [scaleStart, scaleEnd],
        { extrapolateRight: 'extend' }
    );

    // Interpolate Position (Pan)
    // Alternate directions based on index
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
    const opacity = isWrap
        ? 1
        : interpolate(
            frame,
            [0, transitionDuration],
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

export const KenBurnsSlideshow: React.FC<KenBurnsSlideshowProps> = ({
    images,
    slideDuration = 150, // 5 seconds @ 30fps
    transitionDuration = 30 // 1 second @ 30fps
}) => {
    return (
        <AbsoluteFill>
            {/* 
               Layer 0: The "Last" image wrapping around to the start (infinite loop effect)
            */}
            <Sequence from={0} durationInFrames={transitionDuration + 10} layout="none">
                <KenBurnsImage
                    src={images[images.length - 1]}
                    index={images.length - 1}
                    offsetFrame={slideDuration}
                    isWrap={true}
                    slideDuration={slideDuration}
                    transitionDuration={transitionDuration}
                />
            </Sequence>

            {images.map((src, i) => (
                <Sequence
                    key={i}
                    from={i * slideDuration}
                    durationInFrames={slideDuration + transitionDuration}
                    layout="none"
                >
                    <KenBurnsImage
                        src={src}
                        index={i}
                        slideDuration={slideDuration}
                        transitionDuration={transitionDuration}
                    />
                </Sequence>
            ))}
        </AbsoluteFill>
    );
};
