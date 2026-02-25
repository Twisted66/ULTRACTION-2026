import React, { useRef, useState, useEffect } from 'react';
import { Player } from '@remotion/player';
import type { PlayerRef } from '@remotion/player';
import { CoreValuesComposition, SCENE_DURATION_IN_FRAMES } from './CoreValuesComposition';

// Per Remotion docs, Player requires explicit pixel dimensions via style.
// To achieve a "cover" effect inside a variable container, we absolutely
// position the player and scale it to always fill its parent.
export const CoreValuesVideoPlayer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<PlayerRef>(null);
    const [dims, setDims] = useState({ width: 1920, height: 1080 });

    // Compute player size to cover the container (CSS object-fit: cover logic)
    useEffect(() => {
        const update = () => {
            if (!containerRef.current) return;
            const { clientWidth: cw, clientHeight: ch } = containerRef.current;
            const compositionAspect = 1920 / 1080;
            const containerAspect = cw / ch;
            let w: number, h: number;
            if (containerAspect > compositionAspect) {
                // Container is wider → fit width, overflow height
                w = cw;
                h = cw / compositionAspect;
            } else {
                // Container is taller → fit height, overflow width
                h = ch;
                w = ch * compositionAspect;
            }
            setDims({ width: Math.round(w), height: Math.round(h) });
        };
        update();
        const ro = new ResizeObserver(update);
        if (containerRef.current) ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                backgroundColor: '#0d0d0d',
            }}
        >
            <Player
                ref={playerRef}
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
                }}
                autoPlay
                loop
                muted
                controls={false}
                allowFullscreen={false}
                clickToPlay={false}
            />
            {/* Decorative accent lines */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, hsl(var(--accent)), transparent)', opacity: 0.5, zIndex: 10 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, hsl(var(--accent)), transparent)', opacity: 0.5, zIndex: 10 }} />
        </div>
    );
};
