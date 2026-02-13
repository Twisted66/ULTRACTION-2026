import React from 'react';
import { Player } from '@remotion/player';
import { KenBurnsSlideshow } from './common/KenBurnsSlideshow';

const IMAGES = [
    "/images/projects/naseem-albar-bridge/hero.png",
    "/images/projects/inner-bypass-e45/photo_023.jpeg",
    "/images/projects/utility-structure/photo_005.jpeg",
    "/images/projects/e20-traffic-bridges/photo_015.jpeg",
    "/images/projects/al-tallah-bridge/photo_016.jpeg",
];

const HomeHeroRemotion = () => {
    return (
        <div className="w-full h-full relative overflow-hidden bg-black">
            <Player
                component={KenBurnsSlideshow}
                inputProps={{
                    images: IMAGES,
                    slideDuration: 180, // 6 seconds per slide for a more majestic feel
                    transitionDuration: 30, // 1 second transition
                }}
                durationInFrames={IMAGES.length * 180}
                compositionWidth={1920}
                compositionHeight={1080}
                fps={30}
                loop
                autoPlay
                controls={false}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
            {/* Cinematic filter overlays */}
            <div className="absolute inset-0 pointer-events-none bg-black/10 mix-blend-multiply"></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
        </div>
    );
};

export default HomeHeroRemotion;
