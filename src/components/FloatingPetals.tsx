import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  animationDuration: number;
  animationDelay: number;
  type: 'marigold' | 'jasmine' | 'rose';
  rotation: number;
}

export const FloatingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate gentle festive petals
    const items: Petal[] = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.floor(Math.random() * 12) + 10,
      animationDuration: Math.floor(Math.random() * 12) + 14,
      animationDelay: Math.random() * 8,
      type: i % 3 === 0 ? 'marigold' : i % 3 === 1 ? 'jasmine' : 'rose',
      rotation: Math.floor(Math.random() * 360),
    }));
    setPetals(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <style>{`
        @keyframes petalFall {
          0% {
            transform: translateY(-40px) rotate(0deg) translateX(0);
            opacity: 0;
          }
          15% {
            opacity: 0.75;
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(25px);
            opacity: 0.85;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(-20px);
            opacity: 0;
          }
        }
      `}</style>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.left}%`,
            top: '-20px',
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            animation: `petalFall ${petal.animationDuration}s linear infinite`,
            animationDelay: `${petal.animationDelay}s`,
          }}
        >
          {petal.type === 'marigold' ? (
            // Golden Marigold Petal
            <div
              className="w-full h-full rounded-full opacity-80 shadow-xs"
              style={{
                background: 'radial-gradient(circle, #F59E0B 20%, #D4AF37 80%, #B45309 100%)',
                borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
                transform: `rotate(${petal.rotation}deg)`,
              }}
            />
          ) : petal.type === 'jasmine' ? (
            // White Jasmine Petal
            <div
              className="w-full h-full rounded-full opacity-85 shadow-xs"
              style={{
                background: 'radial-gradient(circle, #FFFFFF 40%, #FEF08A 90%, #D4AF37 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                transform: `rotate(${petal.rotation}deg)`,
              }}
            />
          ) : (
            // Traditional Crimson Kasavu Petal
            <div
              className="w-full h-full rounded-full opacity-70 shadow-xs"
              style={{
                background: 'radial-gradient(circle, #F43F5E 30%, #BE123C 80%, #881337 100%)',
                borderRadius: '70% 30% 60% 40% / 40% 70% 30% 60%',
                transform: `rotate(${petal.rotation}deg)`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
