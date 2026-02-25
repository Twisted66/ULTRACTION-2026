import React from 'react';
import { Player } from '@remotion/player';
import { CoreValuesComposition, SCENE_DURATION_IN_FRAMES } from './CoreValuesComposition';

export const CoreValuesVideoPlayer: React.FC = () => {
    return (
        <div className="w-full h-full relative overflow-hidden group">
            <Player
                component={CoreValuesComposition}
                durationInFrames={SCENE_DURATION_IN_FRAMES * 6} // 6 values
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    objectFit: 'cover'
                }}
                autoPlay
                loop
                muted
                controls={false}
                allowFullscreen={false}
            />
            {/* Decorative Brand Elements overlaying the player */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent z-10 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent z-10 opacity-50"></div>
        </div>
    );
};
