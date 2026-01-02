'use client';

import React, { useRef, useEffect } from 'react';

interface DarkVeilProps {
    speed?: number;
    hueShift?: number;
    noiseIntensity?: number;
    scanlineIntensity?: number;
    scanlineFrequency?: number;
    warpAmount?: number;
    resolutionScale?: number;
}

/**
 * DarkVeil Component - FROM REACTBITS
 * Animated background with noise, scanlines, and warp effects
 */
export function DarkVeil({
    speed = 1,
    hueShift = 0,
    noiseIntensity = 0.3,
    scanlineIntensity = 0.1,
    scanlineFrequency = 100,
    warpAmount = 0.2,
    resolutionScale = 1,
}: DarkVeilProps = {}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth * resolutionScale;
            canvas.height = window.innerHeight * resolutionScale;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
        };

        resize();
        window.addEventListener('resize', resize);

        const render = () => {
            time += 0.001 * speed;

            // Create gradient background
            const gradient = ctx.createRadialGradient(
                canvas.width / 2,
                canvas.height / 2,
                0,
                canvas.width / 2,
                canvas.height / 2,
                canvas.width / 2
            );

            const hue1 = (45 + hueShift) % 360; // Gold
            const hue2 = (35 + hueShift) % 360; // Darker gold

            gradient.addColorStop(0, `hsla(${hue1}, 50%, 85%, 0.1)`);
            gradient.addColorStop(0.5, `hsla(${hue2}, 40%, 75%, 0.05)`);
            gradient.addColorStop(1, `hsla(${hue2}, 30%, 70%, 0.02)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add noise
            if (noiseIntensity > 0) {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const noise = (Math.random() - 0.5) * noiseIntensity * 255;
                    data[i] += noise;
                    data[i + 1] += noise;
                    data[i + 2] += noise;
                }

                ctx.putImageData(imageData, 0, 0);
            }

            // Add scanlines
            if (scanlineIntensity > 0) {
                ctx.fillStyle = `rgba(0, 0, 0, ${scanlineIntensity})`;
                for (let y = 0; y < canvas.height; y += scanlineFrequency / 10) {
                    ctx.fillRect(0, y, canvas.width, 1);
                }
            }

            // Add animated warp effect
            if (warpAmount > 0) {
                const warpGradient = ctx.createLinearGradient(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const warpHue = (40 + hueShift + time * 10) % 360;
                warpGradient.addColorStop(0, `hsla(${warpHue}, 60%, 70%, ${warpAmount * 0.1})`);
                warpGradient.addColorStop(0.5, `hsla(${warpHue + 20}, 55%, 65%, ${warpAmount * 0.05})`);
                warpGradient.addColorStop(1, `hsla(${warpHue}, 60%, 70%, ${warpAmount * 0.1})`);

                ctx.fillStyle = warpGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [speed, hueShift, noiseIntensity, scanlineIntensity, scanlineFrequency, warpAmount, resolutionScale]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
            }}
        />
    );
}
