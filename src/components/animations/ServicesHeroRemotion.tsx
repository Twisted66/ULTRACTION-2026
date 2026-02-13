import React from 'react';
import { Player } from '@remotion/player';
import { KenBurnsSlideshow } from './common/KenBurnsSlideshow';

const IMAGES = [
    "/images/projects/commercial/p085_img01_xref6520.jpeg",
    "/images/projects/industrial/p087_img01_xref6534.jpeg",
    "/images/projects/residential/p106_img01_xref6668.jpeg"
];

const SLIDE_DURATION = 150;
const TOTAL_DURATION = IMAGES.length * SLIDE_DURATION;

const ServicesHeroRemotion = () => {
    return (
        <div className="w-full h-full relative overflow-hidden">
            <Player
                component={() => <KenBurnsSlideshow images={IMAGES} slideDuration={SLIDE_DURATION} />}
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
            {/* Overlay gradient to match site style */}
            <div className="absolute inset-0 pointer-events-none border-l border-white/10" />
        </div>
    );
};

export default ServicesHeroRemotion;
