import React, { useRef, useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import { CoreValuesComposition, SCENE_DURATION_IN_FRAMES } from './CoreValuesComposition';

// Per Remotion docs, Player requires explicit pixel dimensions via style.
// To achieve a "cover" effect inside a variable container, we absolutely
// position the player and scale it to always fill its parent.
export const CoreValuesVideoPlayer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [dims, setDims] = useState({ width: 1920, height: 1080 });
    const [isMounted, setIsMounted] = useState(false);

    // Compute player size based on container.
    // Desktop keeps "cover" behavior; small viewports switch to "contain"
    // so composition text stays readable without aggressive cropping.
    useEffect(() => {
        const update = () => {
            if (!containerRef.current) return;
            const { clientWidth: cw, clientHeight: chRaw } = containerRef.current;
            if (cw === 0) return;
            // If layout is still settling and height is 0, fall back to 16:9
            // so the player can render immediately and recover on next resize tick.
            const ch = chRaw > 0 ? chRaw : Math.max(1, Math.round(cw / (16 / 9)));
            const compositionAspect = 1920 / 1080;
            const containerAspect = cw / ch;
            let w: number, h: number;
            const useContain = cw < 768;
            if (useContain) {
                if (containerAspect > compositionAspect) {
                    h = ch;
                    w = ch * compositionAspect;
                } else {
                    w = cw;
                    h = cw / compositionAspect;
                }
            } else {
                if (containerAspect > compositionAspect) {
                    // Container is wider -> fit width, overflow height
                    w = cw;
                    h = cw / compositionAspect;
                } else {
                    // Container is taller -> fit height, overflow width
                    h = ch;
                    w = ch * compositionAspect;
                }
            }
            setDims({ width: Math.round(w), height: Math.round(h) });
        };
        update();
        setIsMounted(true);
        let ro: ResizeObserver | null = null;
        if ('ResizeObserver' in window) {
            ro = new ResizeObserver(update);
            if (containerRef.current) ro.observe(containerRef.current);
        } else {
            globalThis.addEventListener('resize', update);
        }
        return () => {
            if (ro) {
                ro.disconnect();
            } else {
                globalThis.removeEventListener('resize', update);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: 320,
                overflow: 'hidden',
                backgroundColor: '#0d0d0d',
            }}
        >
            {!isMounted ? (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                            'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.82) 100%), url(/images/projects/photo_018.jpeg) center / cover no-repeat',
                    }}
                />
            ) : null}
            <Player
                component={CoreValuesComposition}
                durationInFrames={SCENE_DURATION_IN_FRAMES * 6}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: dims.width,
                    height: dims.height,
                    opacity: isMounted ? 1 : 0,
                }}
                autoPlay
                loop
                initiallyMuted
                controls={false}
                allowFullscreen={false}
                clickToPlay={false}
                acknowledgeRemotionLicense
            />
            {/* Decorative accent lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, hsl(var(--accent)), transparent)', opacity: 0.5, zIndex: 10 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, hsl(var(--accent)), transparent)', opacity: 0.5, zIndex: 10 }} />
        </div>
    );
};
