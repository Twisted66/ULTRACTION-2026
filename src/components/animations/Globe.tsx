import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from 'react-spring';

export default function Globe({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;
        let frameId: number | null = null;
        let globe: ReturnType<typeof createGlobe> | null = null;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onResize = () => {
            const nextWidth = canvas.offsetWidth;
            if (nextWidth > 0) {
                width = nextWidth;
            }
        };

        const initGlobe = () => {
            onResize();
            if (width === 0) {
                frameId = window.requestAnimationFrame(initGlobe);
                return;
            }

            globe = createGlobe(canvas, {
                devicePixelRatio: 2,
                width: width * 2,
                height: width * 2,
                phi: 0,
                theta: 0.3,
                dark: 1,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.3, 0.3, 0.3],
                markerColor: [1, 1, 1], // Pure white for visibility on dark backgrounds
                glowColor: [1, 1, 1],
                markers: [
                    { location: [25.2048, 55.2708], size: 0.1 }, // Dubai
                    { location: [24.4539, 54.3773], size: 0.1 }, // Abu Dhabi
                    { location: [25.3463, 55.4209], size: 0.1 }, // Sharjah
                ],
                onRender: (state) => {
                    if (!pointerInteracting.current) {
                        phi += 0.005;
                    }
                    state.phi = phi + r.get();
                    state.width = width * 2;
                    state.height = width * 2;
                }
            });

            canvas.style.opacity = '1';
        };

        const resizeObserver = new ResizeObserver(onResize);
        resizeObserver.observe(canvas);
        window.addEventListener('resize', onResize);
        initGlobe();

        return () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId);
            }
            if (globe) {
                globe.destroy();
            }
            resizeObserver.disconnect();
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <div className={className} style={{
            width: '100%',
            height: '100%',
            position: 'relative',
        }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '100%',
                    contain: 'layout paint size',
                    opacity: 0,
                    transform: 'translateY(4%)',
                    cursor: 'grab',
                }}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 200,
                        });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 100,
                        });
                    }
                }}
            />
        </div>
    )
}
