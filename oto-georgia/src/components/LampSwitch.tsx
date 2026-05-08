'use client';
import { useState } from 'react';

export default function LampSwitch() {
  const [isOn, setIsOn] = useState(false);

  const toggleLamp = () => {
    setIsOn(!isOn);
    if (!isOn) {
      document.body.style.filter = 'contrast(1.2) brightness(1.1)';
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 500);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
      <svg 
        width="24" height="60" viewBox="0 0 24 60" 
        style={{ cursor: 'pointer', transformOrigin: 'top center', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scaleY(1.2)'}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scaleY(1)';
          toggleLamp();
        }}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scaleY(1)'}
      >
        <line x1="12" y1="0" x2="12" y2="40" stroke="var(--muted)" strokeWidth="2" strokeDasharray="2 2" />
        <circle cx="12" cy="45" r="5" fill={isOn ? 'var(--primary)' : 'var(--foreground)'} />
      </svg>
    </div>
  );
}
