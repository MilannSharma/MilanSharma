
import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { useSpring } from '@react-spring/web';

const Globe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phi = useRef(2.5);
  const widthRef = useRef(0);
  const [error, setError] = useState(false);

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001
    }
  }));

  useEffect(() => {
    let globe: any;
    
    const initGlobe = () => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const width = rect.width || canvasRef.current.offsetWidth || 300;
      widthRef.current = width;

      try {
        // Test for WebGL context
        const gl = canvasRef.current.getContext('webgl') || canvasRef.current.getContext('experimental-webgl');
        if (!gl) {
          console.warn('WebGL not supported');
          setError(true);
          return;
        }

        globe = createGlobe(canvasRef.current, {
          devicePixelRatio: 2,
          width: width * 2,
          height: width * 2,
          phi: 0,
          theta: 0.3,
          dark: 1,
          diffuse: 1.2,
          mapSamples: 16000,
          mapBrightness: 6,
          baseColor: [0.1, 0.1, 0.1],
          markerColor: [245/255, 158/255, 11/255],
          glowColor: [0.3, 0.3, 0.3],
          markers: [{ location: [18.5204, 73.8567], size: 0.08 }],
          scale: 1,
          onRender: (state) => {
            if (!pointerInteracting.current) {
              phi.current += 0.003;
            }
            state.phi = phi.current + r.get();
            state.width = widthRef.current * 2;
            state.height = widthRef.current * 2;
          }
        });
      } catch (e) {
        console.error('Error initializing globe:', e);
        setError(true);
      }
    };

    // Use a small delay to ensure DOM dimensions are ready
    const timer = setTimeout(initGlobe, 50);

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth;
      }
    };
    
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(timer);
      if (globe) globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [r]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-[10px] text-center p-4">
        [WEBGL_CONTEXT_UNAVAILABLE]
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center overflow-visible relative">
      <div
        className="w-full aspect-square"
        style={{
          maskImage: 'radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 60%, rgb(0, 0, 0, 0) 70%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, rgb(0, 0, 0) 60%, rgb(0, 0, 0, 0) 70%)'
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              api.start({ r: delta / 200 });
            }
          }}
          style={{
            width: '100%',
            height: '100%',
            contain: 'layout paint size',
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
};

export default Globe;
