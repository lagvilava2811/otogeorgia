import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import { Locale, t } from '@/lib/i18n';

interface ProductCardProps {
  product: {
    id?: string;
    name: string;
    slug: string;
    price: number;
    oldPrice: number | null;
    imageUrl: string | null;
  };
  locale?: Locale;
}

export default function ProductCard({ product, locale = 'ka' }: ProductCardProps) {
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', height: '260px', overflow: 'hidden', isolation: 'isolate' }}>
        {/* Radial white-to-dark gradient - white in center fades to dark at edges */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at center, #f5f5f5 0%, #e8e8e8 40%, rgba(28,25,23,1) 85%)',
          zIndex: 0,
        }} />
        
        {/* Product image with multiply blend mode — white pixels become transparent */}
        <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              style={{ 
                width: '75%', 
                height: '75%', 
                objectFit: 'contain',
                mixBlendMode: 'multiply',
                transition: 'transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }} 
              className="product-image" 
            />
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>NO IMAGE</div>
          )}
        </div>

        <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 4 }} />
        {hasDiscount && (
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, background: 'var(--brand)', color: 'var(--obsidian-950)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>SALE</div>
        )}
      </div>
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600, flex: 1, lineHeight: 1.4, color: 'var(--gold-300)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{product.name}</h3>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand)', lineHeight: 1 }}>{product.price} ₾</span>
          {hasDiscount && (<span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{product.oldPrice} ₾</span>)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link href={`/product/${product.slug}`} className="btn btn-ghost" style={{ flex: 1, fontSize: '0.8rem', padding: '0.6rem' }}>{t(locale, 'product.view')}</Link>
          <AddToCartButton productId={product.id as string} locale={locale} />
        </div>
      </div>
    </div>
  );
}
