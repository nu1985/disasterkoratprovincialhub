"use client";

import createGlobe from "cobe";
import { useCallback, useEffect, useRef } from "react";
import { useSpring } from "react-spring";

import { cn } from "@/lib/utils";

export function Globe({ className }: { className?: string }) {
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

    const updatePointerInteraction = (value: any) => {
        pointerInteractionMovement.current = value;
        if (canvasRef.current) {
            canvasRef.current.style.cursor = "grabbing";
        }
    };

    const updateMovement = (clientX: any) => {
        if (pointerInteracting.current !== null) {
            const delta = clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
                r: delta / 200,
            });
        }
    };

    const onRender = useCallback(
        (state: any) => {
            if (!pointerInteracting.current) {
                state.phi += 0.005;
            }
            state.phi += r.get();
            state.width = state.width * 2;
            state.height = state.height * 2;
        },
        [r],
    );

    useEffect(() => {
        let phi = 0;
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth);
        window.addEventListener("resize", onResize);
        onResize();
        const globe = createGlobe(canvasRef.current!, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 0,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [251 / 255, 100 / 255, 21 / 255],
            glowColor: [1, 1, 1],
            markers: [
                { location: [14.9759, 102.0946], size: 0.1 }, // Nakhon Ratchasima coordinates roughly
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.005;
            },
        });
        setTimeout(() => (canvasRef.current!.style.opacity = "1"));
        return () => {
            globe.destroy();
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div
            className={cn(
                "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px] sm:max-w-[800px]",
                className,
            )}
        >
            <canvas
                className={cn(
                    "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
                )}
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current =
                        e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = "grabbing";
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = "grab";
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = "grab";
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 100,
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
    );
}
