'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ───────────────────────────────────────────────────────
   3D Exploded-View Battery Effect
   
   Slices the battery image into horizontal layers and
   spreads them apart in 3D perspective space, creating
   a dramatic deconstruction effect.
   
   Auto-cycles: assembled → BURST → hold → SNAP back
   Click to toggle manually
   ─────────────────────────────────────────────────────── */

interface SliceConfig {
  clipTop: number;
  clipHeight: number;
  spreadZ: number;
  spreadX: number;
  spreadY: number;
  rotateX: number;
  rotateY: number;
  delay: number;
  label: string;
  labelKa: string;
}

const SLICES: SliceConfig[] = [
  {
    clipTop: 0, clipHeight: 16,
    spreadZ: 200, spreadX: -4, spreadY: -30,
    rotateX: 3, rotateY: -1.5, delay: 0.0,
    label: 'Terminal +/−', labelKa: 'ტერმინალი',
  },
  {
    clipTop: 16, clipHeight: 14,
    spreadZ: 120, spreadX: 3, spreadY: -14,
    rotateX: -1.5, rotateY: 1, delay: 0.06,
    label: 'Cover Lid', labelKa: 'თავსახური',
  },
  {
    clipTop: 30, clipHeight: 16,
    spreadZ: 40, spreadX: -3, spreadY: 0,
    rotateX: 1, rotateY: -0.8, delay: 0.12,
    label: 'Cell Assembly', labelKa: 'უჯრედების ბლოკი',
  },
  {
    clipTop: 46, clipHeight: 16,
    spreadZ: -40, spreadX: 3, spreadY: 14,
    rotateX: -1, rotateY: 0.8, delay: 0.18,
    label: 'Plate Block', labelKa: 'ფირფიტების ბლოკი',
  },
  {
    clipTop: 62, clipHeight: 16,
    spreadZ: -120, spreadX: -4, spreadY: 28,
    rotateX: 1.5, rotateY: -1, delay: 0.24,
    label: 'Lead Grid', labelKa: 'ტყვიის ბადე',
  },
  {
    clipTop: 78, clipHeight: 22,
    spreadZ: -200, spreadX: 4, spreadY: 42,
    rotateX: -2, rotateY: 1.5, delay: 0.30,
    label: 'Housing Base', labelKa: 'კორპუსი',
  },
];

export default function DeconstructEffect({ imageUrl }: { imageUrl: string }) {
  const [phase, setPhase] = useState<'assembled' | 'exploding' | 'exploded' | 'assembling'>('assembled');
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  }, []);

  const isExploded = phase === 'exploding' || phase === 'exploded';
  const showLabels = phase === 'exploded';

  useEffect(() => {
    const runCycle = () => {
      clearTimers();
      setPhase('exploding');
      timerRef.current.push(setTimeout(() => setPhase('exploded'), 1000));
      timerRef.current.push(setTimeout(() => setPhase('assembling'), 5500));
      timerRef.current.push(setTimeout(() => setPhase('assembled'), 6200));
      timerRef.current.push(setTimeout(runCycle, 8500));
    };
    timerRef.current.push(setTimeout(runCycle, 2500));
    return () => clearTimers();
  }, [clearTimers]);

  const handleClick = () => {
    clearTimers();
    if (phase === 'assembled') {
      setPhase('exploding');
      timerRef.current.push(setTimeout(() => setPhase('exploded'), 1000));
    } else {
      setPhase('assembling');
      timerRef.current.push(setTimeout(() => setPhase('assembled'), 700));
    }
  };

  const getTransition = (slice: SliceConfig, index: number) => {
    if (phase === 'assembling') {
      const d = (SLICES.length - 1 - index) * 0.04;
      return `transform 0.45s cubic-bezier(0.2, 0, 0.38, 0.9) ${d}s, filter 0.35s ease ${d}s`;
    }
    return `transform 0.85s cubic-bezier(0.16, 1.11, 0.36, 1.02) ${slice.delay}s, filter 0.6s ease ${slice.delay}s`;
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        cursor: 'pointer',
        perspective: '1200px',
        perspectiveOrigin: '50% 45%',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: '-25%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 55%)',
        pointerEvents: 'none',
        opacity: isExploded ? 1 : 0.3,
        transition: 'opacity 1s ease',
        zIndex: 0,
      }} />

      {/* Slices */}
      {SLICES.map((slice, i) => {
        const clipBottom = 100 - slice.clipTop - slice.clipHeight;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: isExploded ? 20 - i : 10 + i,
              clipPath: `inset(${slice.clipTop}% 0 ${clipBottom}% 0)`,
              transform: isExploded
                ? `translate3d(${slice.spreadX}px, ${slice.spreadY}px, ${slice.spreadZ}px) rotateX(${slice.rotateX}deg) rotateY(${slice.rotateY}deg)`
                : 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)',
              transition: getTransition(slice, i),
              filter: isExploded
                ? 'drop-shadow(0 4px 16px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(212,175,55,0.06))'
                : 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <img
              src={imageUrl}
              alt=""
              draggable={false}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />

            {/* Gold edge glow */}
            <div style={{
              position: 'absolute',
              left: '5%', right: '5%',
              top: `${slice.clipTop + slice.clipHeight}%`,
              height: '1.5px',
              background: 'linear-gradient(90deg, transparent, rgba(247,195,51,0.5) 30%, rgba(247,195,51,0.7) 50%, rgba(247,195,51,0.5) 70%, transparent)',
              boxShadow: '0 0 8px rgba(212,175,55,0.2)',
              opacity: showLabels ? 0.6 : 0,
              transition: `opacity 0.4s ease ${0.15 + slice.delay}s`,
              pointerEvents: 'none',
            }} />

            {/* Label — left side */}
            <div style={{
              position: 'absolute',
              top: `${slice.clipTop + slice.clipHeight / 2}%`,
              right: '103%',
              transform: `translateY(-50%) translateZ(-${slice.spreadZ}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              flexDirection: 'row-reverse',
              opacity: showLabels ? 1 : 0,
              transition: `opacity 0.4s ease ${0.15 + slice.delay}s`,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}>
              {/* Line */}
              <div style={{
                width: '2rem',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(212,175,55,0.05), rgba(212,175,55,0.45))',
              }} />
              {/* Dot */}
              <div style={{
                width: '3px', height: '3px',
                borderRadius: '50%',
                background: '#F7C333',
                boxShadow: '0 0 5px rgba(212,175,55,0.4)',
                flexShrink: 0,
              }} />
              {/* Text */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.02rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.08em',
                  color: '#F9D266',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textShadow: '0 1px 5px rgba(0,0,0,0.95)',
                }}>
                  {slice.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: '0.4rem',
                  color: '#F9EFE3',
                  opacity: 0.6,
                  textShadow: '0 1px 5px rgba(0,0,0,0.95)',
                }}>
                  {slice.labelKa}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Click hint */}
      <div style={{
        position: 'absolute',
        bottom: '-1.2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.5rem',
        letterSpacing: '0.12em',
        color: '#F9D266',
        textTransform: 'uppercase',
        opacity: 0.3,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        zIndex: 50,
      }}>
        {isExploded ? '← ასაწყობად →' : '⚡ დასაშლელად'}
      </div>
    </div>
  );
}
