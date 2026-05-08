'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ───────────────────────────────────────────────────────
   Scroll-Driven Battery Exploded View
   
   Assembled battery in center. On scroll, individual 
   components fly OUT from the battery, spreading into
   a diagonal isometric arrangement. Then reassemble.
   
   NO frames, NO backgrounds, NO borders on images.
   mix-blend-mode: screen removes dark image backgrounds.
   ─────────────────────────────────────────────────────── */

interface PartConfig {
  id: string;
  image: string;
  label: string;
  labelKa: string;
  /** Final position when exploded (vw/vh offsets from center) */
  x: number;
  y: number;
  /** Size as vw */
  size: number;
  /** Rotation when exploded */
  rotate: number;
  /** Stagger (0–1) */
  stagger: number;
}

const PARTS: PartConfig[] = [
  {
    id: 'powergrid', image: '/images/part-powergrid.png',
    label: 'PowerFrame® Grid', labelKa: 'ტყვიის ბადე',
    x: -38, y: 28, size: 12, rotate: -6, stagger: 0,
  },
  {
    id: 'posplate', image: '/images/part-posplate.png',
    label: 'Positive Plate', labelKa: 'დადებითი ფირფიტა',
    x: -30, y: 16, size: 11, rotate: -4, stagger: 0.08,
  },
  {
    id: 'separator', image: '/images/part-separator.png',
    label: 'PE Separator', labelKa: 'სეპარატორი',
    x: -22, y: 5, size: 10, rotate: -2, stagger: 0.16,
  },
  {
    id: 'negplate', image: '/images/part-negplate.png',
    label: 'Negative Plate', labelKa: 'უარყოფითი ფირფიტა',
    x: -13, y: -6, size: 11, rotate: 0, stagger: 0.24,
  },
  {
    id: 'plateblock', image: '/images/part-plateblock.png',
    label: 'Plate Block', labelKa: 'ფირფიტების ბლოკი',
    x: 5, y: -16, size: 13, rotate: 2, stagger: 0.32,
  },
  {
    id: 'connector', image: '/images/part-connector.png',
    label: 'Cell Connector', labelKa: 'კონექტორი',
    x: 16, y: -25, size: 9, rotate: 3, stagger: 0.40,
  },
  {
    id: 'terminal', image: '/images/part-terminal.png',
    label: 'Lead Terminal', labelKa: 'ტერმინალი',
    x: 25, y: -33, size: 10, rotate: 4, stagger: 0.48,
  },
  {
    id: 'case', image: '/images/part-case.png',
    label: 'Battery Case', labelKa: 'კორპუსი',
    x: 34, y: -20, size: 14, rotate: 5, stagger: 0.56,
  },
  {
    id: 'lid', image: '/images/part-lid.png',
    label: 'Cover & Lid', labelKa: 'თავსახური',
    x: 38, y: -35, size: 12, rotate: 6, stagger: 0.64,
  },
];

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeIn(t: number) {
  return t * t * t;
}

export default function BatteryExplodedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const h = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;
      const scrolled = vh - rect.top;
      const total = h + vh;
      setProgress(clamp(scrolled / total, 0, 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Explosion progress: 0 = assembled, 1 = fully exploded
  let explosion: number;
  if (progress < 0.15) explosion = 0;
  else if (progress < 0.45) explosion = easeOut((progress - 0.15) / 0.30);
  else if (progress < 0.65) explosion = 1;
  else if (progress < 0.85) explosion = 1 - easeIn((progress - 0.65) / 0.20);
  else explosion = 0;

  const showLabels = progress >= 0.40 && progress <= 0.70;
  const labelOpacity = showLabels
    ? Math.min(clamp((progress - 0.40) / 0.05, 0, 1), clamp((0.70 - progress) / 0.05, 0, 1))
    : 0;

  const batteryOpacity = 1 - explosion * 0.8;
  const titleOpacity = progress > 0.05 && progress < 0.85
    ? Math.min(clamp((progress - 0.05) / 0.1, 0, 1), clamp((0.85 - progress) / 0.1, 0, 1))
    : 0;

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '350vh' }}
    >
      {/* Sticky viewport */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, var(--obsidian-950, #0A0A0A) 0%, #060608 50%, var(--obsidian-950, #0A0A0A) 100%)',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        {/* Title */}
        <div style={{
          position: 'absolute',
          top: '3rem', left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center',
          opacity: titleOpacity,
          zIndex: 20, pointerEvents: 'none',
        }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.65rem', letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--gold-400, #F7C333)',
            padding: '0.4rem 1.2rem',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '9999px',
            background: 'rgba(10,10,10,0.4)',
          }}>
            ⚙ აკუმულატორის ანატომია
          </span>
          <h2 style={{
            marginTop: '0.75rem',
            fontFamily: 'var(--font-heading, serif)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FDF0CC, #F7C333)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            რისგან შედგება აკუმულატორი
          </h2>
        </div>

        {/* Central assembled battery — NO frame, NO background */}
        <div style={{
          position: 'absolute',
          width: 'min(28vw, 320px)',
          opacity: batteryOpacity,
          zIndex: 5,
          pointerEvents: 'none',
        }}>
          <img
            src="/images/varta-hero.png"
            alt="Battery"
            style={{
              width: '100%', height: 'auto',
              display: 'block',
            }}
          />
        </div>

        {/* Exploded components — NO frame, NO background, just floating */}
        {PARTS.map((part) => {
          const st = clamp((explosion - part.stagger * 0.4) / (1 - part.stagger * 0.4), 0, 1);
          const x = lerp(0, part.x, st);
          const y = lerp(0, part.y, st);
          const scale = lerp(0.15, 1, st);
          const opacity = lerp(0, 1, Math.min(st * 2.5, 1));
          const rotate = lerp(0, part.rotate, st);

          return (
            <div
              key={part.id}
              style={{
                position: 'absolute',
                width: `${part.size}vw`,
                maxWidth: `${part.size * 6}px`,
                left: `calc(50% + ${x}vw)`,
                top: `calc(50% + ${y}vh)`,
                transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotate}deg)`,
                opacity,
                zIndex: 10,
                pointerEvents: 'none',
                // NO border, NO background, NO frame
              }}
            >
              <img
                src={part.image}
                alt={part.label}
                style={{
                  width: '100%', height: 'auto',
                  display: 'block',
                }}
              />

              {/* Label — floating text, no frame */}
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                marginTop: '0.3rem',
                opacity: labelOpacity,
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}>
                <div style={{
                  width: '3px', height: '3px',
                  borderRadius: '50%',
                  background: '#F7C333',
                  boxShadow: '0 0 6px rgba(212,175,55,0.5)',
                  margin: '0 auto 0.2rem',
                }} />
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: 'clamp(0.45rem, 0.7vw, 0.6rem)',
                  letterSpacing: '0.08em',
                  color: '#F9D266',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  textShadow: '0 1px 8px rgba(0,0,0,0.95), 0 0 20px rgba(0,0,0,0.8)',
                }}>
                  {part.label}
                </span>
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: 'clamp(0.35rem, 0.55vw, 0.5rem)',
                  color: '#F9EFE3',
                  opacity: 0.55,
                  marginTop: '0.05rem',
                  textShadow: '0 1px 8px rgba(0,0,0,0.95)',
                }}>
                  {part.labelKa}
                </span>
              </div>
            </div>
          );
        })}

        {/* Connecting dashed lines between components when exploded */}
        <svg style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 8,
          opacity: labelOpacity * 0.3,
        }}>
          {PARTS.map((part, i) => {
            if (i === PARTS.length - 1) return null;
            const next = PARTS[i + 1];
            const st1 = clamp((explosion - part.stagger * 0.4) / (1 - part.stagger * 0.4), 0, 1);
            const st2 = clamp((explosion - next.stagger * 0.4) / (1 - next.stagger * 0.4), 0, 1);
            const x1 = 50 + lerp(0, part.x, st1);
            const y1 = 50 + lerp(0, part.y, st1);
            const x2 = 50 + lerp(0, next.x, st2);
            const y2 = 50 + lerp(0, next.y, st2);
            return (
              <line key={`l-${i}`}
                x1={`${x1}%`} y1={`${y1}%`}
                x2={`${x2}%`} y2={`${y2}%`}
                stroke="rgba(212,175,55,0.25)"
                strokeWidth="0.5"
                strokeDasharray="3 3"
              />
            );
          })}
        </svg>

        {/* Scroll hint */}
        <div style={{
          position: 'absolute',
          bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          opacity: progress < 0.12 ? 0.5 : 0,
          transition: 'opacity 0.3s',
          zIndex: 20, pointerEvents: 'none',
          textAlign: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.6rem', letterSpacing: '0.2em',
            color: 'var(--text-muted, #A8A29E)',
            textTransform: 'uppercase',
          }}>
            ↓ ჩამოსქროლე ↓
          </span>
        </div>
      </div>
    </section>
  );
}
