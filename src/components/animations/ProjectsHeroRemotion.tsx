import React from 'react';
import { Player } from '@remotion/player';
import { KenBurnsSlideshow } from './common/KenBurnsSlideshow';

const IMAGES = [
    "/images/projects/naseem-albar-bridge/photo_005.jpeg",
    "/images/projects/inner-bypass-e45/photo_018.jpeg",
    "/images/projects/infrastructure/p082_img01_xref6357.jpeg"
];

const SLIDE_DURATION = 150;
const TOTAL_DURATION = IMAGES.length * SLIDE_DURATION;

const ProjectsHeroRemotion = () => {
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

export default ProjectsHeroRemotion;
