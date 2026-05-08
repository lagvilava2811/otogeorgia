import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import { StarRatingDisplay } from '@/components/StarRating';
import ReviewForm from '@/components/ReviewForm';
import { getLocale } from '@/app/actions/locale';
import { t } from '@/lib/i18n';

const reviewLabels = {
  ka: { reviews: 'შეფასებები', noReviews: 'ჯერ არ არის შეფასებები. იყავით პირველი!' },
  ru: { reviews: 'Отзывы', noReviews: 'Пока нет отзывов. Будьте первым!' },
  en: { reviews: 'Reviews', noReviews: 'No reviews yet. Be the first!' },
} as const;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getLocale();
  const { slug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, reviews: { orderBy: { createdAt: 'desc' } } }
  });

  if (!product) return notFound();
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="container" style={{ padding: '6rem 2rem 4rem' }}>
      <nav style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{t(locale, 'shop.home')}</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/</span>
        <Link href="/shop" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{t(locale, 'shop.catalog')}</Link>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>/</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--brand)' }}>{product.category?.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
        {/* Image */}
        <div className="glass-card" style={{ aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', background: 'radial-gradient(circle at center, #ffffff 0%, rgba(212, 175, 55, 0.3) 50%, rgba(20,18,16,1) 100%)', padding: 0 }}>
          {/* Product image with multiply blend mode */}
          <div style={{ position: 'relative', zIndex: 3, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl ? (
              <div style={{ width: '85%', height: '85%', background: `url(${product.imageUrl}) center/contain no-repeat`, mixBlendMode: 'multiply', filter: 'brightness(1.02) contrast(1.05)' }} />
            ) : (
              <span style={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>NO IMAGE</span>
            )}
          </div>

          <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none', zIndex: 4 }} />
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <span className="section-label" style={{ width: 'fit-content' }}>{product.category?.name}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2, color: 'var(--gold-300)' }}>{product.name}</h1>
          
          {/* Rating */}
          <StarRatingDisplay avgRating={avgRating} reviewCount={product.reviews.length} size={18} />

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--brand)' }}>{product.price} ₾</span>
            {hasDiscount && (<span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.25rem' }}>{product.oldPrice} ₾</span>)}
          </div>

          {/* Brand/Amperage badges */}
          {(product.brand || product.amperage) && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.brand && (
                <span style={{ padding: '4px 12px', background: 'rgba(212, 175, 55, 0.08)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--brand)' }}>{product.brand}</span>
              )}
              {product.amperage && (
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{product.amperage}</span>
              )}
            </div>
          )}

          {/* Description & Specs */}
          {product.description && (() => {
            const parts = product.description.split('\n\nმახასიათებლები:\n');
            const mainDesc = parts[0]?.trim();
            const attrs = parts[1]?.split('\n').filter(Boolean) || [];
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {mainDesc && (
                  <div style={{ padding: '1.5rem 2rem', background: 'rgba(212, 175, 55, 0.03)', borderLeft: '3px solid var(--brand)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.625, fontSize: '0.95rem', whiteSpace: 'pre-line' }}>{mainDesc}</p>
                  </div>
                )}
                {attrs.length > 0 && (
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)' }}>{t(locale, 'product.specs')}</span>
                    </div>
                    {attrs.map((attr, i) => {
                      const [label, ...v] = attr.split(':');
                      return (
                        <div key={i} style={{ padding: '0.875rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < attrs.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{label}</span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v.join(':').trim()}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ flex: 1 }}><AddToCartButton productId={product.id} fullWidth locale={locale} /></div>
            <button className="btn btn-ghost" style={{ padding: '0.75rem 1.5rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ===== REVIEWS SECTION ===== */}
      <section style={{ marginTop: '5rem', borderTop: '1px solid var(--border-light)', paddingTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          {/* Existing Reviews */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>
              <span className="text-gradient-gold">{reviewLabels[locale].reviews}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({product.reviews.length})</span>
            </h2>

            {product.reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>{reviewLabels[locale].noReviews}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {product.reviews.map(review => (
                  <div key={review.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand)' }}>
                          {review.author[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{review.author}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <StarRatingDisplay avgRating={review.rating} reviewCount={0} size={14} />
                    {review.comment && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.75rem', lineHeight: 1.5 }}>{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Form */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>
              <span className="text-gradient-gold">{locale === 'ka' ? 'შეფასების დატოვება' : locale === 'ru' ? 'Оставить отзыв' : 'Leave a Review'}</span>
            </h2>
            <ReviewForm productId={product.id} locale={locale} />
          </div>
        </div>
      </section>
    </div>
  );
}
