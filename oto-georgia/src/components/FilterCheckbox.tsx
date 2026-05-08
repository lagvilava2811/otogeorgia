'use client';

import { useState } from 'react';

export default function FilterCheckbox({ 
  title, 
  items, 
  paramName,
  currentValues,
  onToggle
}: { 
  title: string; 
  items: { value: string; count: number }[];
  paramName: string;
  currentValues: string[];
  onToggle: (value: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
      <button 
        onClick={() => setExpanded(!expanded)}
        style={{ 
          width: '100%', padding: '0.875rem 1.25rem', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '0.8rem', transition: 'transform 200ms ease', transform: expanded ? 'rotate(0)' : 'rotate(-90deg)' }}>▼</span>
      </button>
      
      {expanded && (
        <div style={{ padding: '0 1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item) => {
            const isChecked = currentValues.includes(item.value);
            return (
              <label 
                key={item.value}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer',
                  fontSize: '0.85rem', color: isChecked ? 'var(--brand)' : 'var(--text-secondary)',
                  transition: 'color 150ms ease'
                }}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '4px',
                  border: isChecked ? '1px solid var(--brand)' : '1px solid var(--border-default)',
                  background: isChecked ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms ease', flexShrink: 0
                }}>
                  {isChecked && <span style={{ fontSize: '0.65rem', color: 'var(--brand)' }}>✓</span>}
                </div>
                <span style={{ flex: 1 }}>{item.value}</span>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '0.6rem', 
                  background: isChecked ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: isChecked ? 'var(--brand)' : 'var(--text-muted)',
                  padding: '1px 6px', borderRadius: '9999px' 
                }}>{item.count}</span>
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={() => onToggle(item.value)}
                  style={{ display: 'none' }} 
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
