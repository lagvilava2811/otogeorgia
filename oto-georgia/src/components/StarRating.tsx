'use client';

export function StarRating({ rating, size = 14, interactive = false, onRate }: { rating: number; size?: number; interactive?: boolean; onRate?: (r: number) => void }) {
  return (
    <div style={{ display: 'inline-flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= rating ? 'var(--brand)' : 'none'}
          stroke={star <= rating ? 'var(--brand)' : 'var(--text-muted)'}
          strokeWidth="1.5"
          style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 150ms ease' }}
          onClick={() => interactive && onRate?.(star)}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function StarRatingDisplay({ avgRating, reviewCount, size = 14 }: { avgRating: number; reviewCount: number; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <StarRating rating={Math.round(avgRating)} size={size} />
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        ({reviewCount})
      </span>
    </div>
  );
}
