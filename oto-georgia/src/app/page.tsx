import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getLocale } from '@/app/actions/locale';
import { t, Locale } from '@/lib/i18n';
import BatteryExplodedSection from '@/components/BatteryExplodedSection';

const homeLabels = {
  ka: { sales: 'აქციები', salesTitle: 'ფასდაკლებული პროდუქცია', salesDesc: 'არ გამოტოვოთ — სპეციალური ფასდაკლებები მოქმედებს!', salesCta: 'ყველა აქცია', bookTitle: 'გჭირდებათ კონსულტაცია?', bookDesc: 'დაჯავშნეთ ვიზიტი და ჩვენი სპეციალისტი დაგეხმარებათ სწორი აკუმულატორის ან ზეთის შერჩევაში.', bookCta: 'ვიზიტის დაჯავშნა' },
  ru: { sales: 'Акции', salesTitle: 'Товары со скидкой', salesDesc: 'Не пропустите — специальные скидки действуют!', salesCta: 'Все акции', bookTitle: 'Нужна консультация?', bookDesc: 'Забронируйте визит и наш специалист поможет подобрать правильный аккумулятор или масло.', bookCta: 'Забронировать визит' },
  en: { sales: 'Sales', salesTitle: 'Discounted Products', salesDesc: 'Don\'t miss out — special discounts available!', salesCta: 'All Sales', bookTitle: 'Need Consultation?', bookDesc: 'Book a visit and our specialist will help you choose the right battery or oil.', bookCta: 'Book a Visit' },
} as const;

export default async function Home() {
  const locale = await getLocale();
  const hl = homeLabels[locale];
  
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 8,
  });

  // Sale products (has oldPrice)
  const saleProducts = await prisma.product.findMany({
    where: { oldPrice: { not: null } },
    take: 8,
    orderBy: { price: 'asc' }
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  const activeCategories = categories.filter(c => c._count.products > 0);
  const totalProducts = await prisma.product.count();
  const totalSales = await prisma.product.count({ where: { oldPrice: { not: null } } });

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'url(/images/hero-banner.png) center/cover no-repeat', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.78) 40%, rgba(10,10,10,0.96) 100%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(212, 175, 55, 0.06), transparent 60%)', zIndex: 0 }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', padding: '8rem 2rem 6rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem' }}>
            <div className="badge animate-fade-in"><span className="badge-dot" /><span>{t(locale, 'hero.badge')}</span></div>
            <h1 className="animate-fade-in animate-fade-in-delay-1" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.02em' }}>
              <span style={{ display: 'block', color: 'var(--gold-300)' }}>{t(locale, 'hero.title1')}</span>
              <span className="text-gradient-gold" style={{ display: 'block' }}>{t(locale, 'hero.title2')}</span>
            </h1>
            <p className="section-label animate-fade-in animate-fade-in-delay-2" style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>{t(locale, 'hero.subtitle')}</p>
            <div className="animate-fade-in animate-fade-in-delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/shop" className="btn btn-primary" style={{ padding: '1rem 2.5rem' }}>{t(locale, 'hero.cta')}</Link>
              <Link href="/sales" className="btn btn-accent" style={{ padding: '1rem 2.5rem' }}>{hl.sales} ({totalSales})</Link>
              <Link href="/booking" className="btn btn-ghost" style={{ padding: '1rem 2.5rem' }}>{hl.bookCta}</Link>
            </div>
            <div className="animate-fade-in animate-fade-in-delay-4" style={{ display: 'flex', gap: '4rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(212,175,55,0.15)', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--brand)' }}>{totalProducts}+</span><span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--champagne-200)' }}>{t(locale, 'hero.products')}</span></div>
              <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--brand)' }}>{totalSales}</span><span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--champagne-200)' }}>{hl.sales}</span></div>
              <div style={{ textAlign: 'center' }}><span style={{ display: 'block', fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 700, color: 'var(--brand)' }}>24/7</span><span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--champagne-200)' }}>{t(locale, 'hero.support')}</span></div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 2 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>SCROLL</span>
          <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, var(--brand), transparent)', animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ===== BATTERY EXPLODED VIEW ===== */}
      <BatteryExplodedSection />

      {/* ===== SALES SECTION ===== */}
      <section style={{ padding: '6rem 0', position: 'relative', background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.02) 50%, transparent 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span className="section-label" style={{ background: 'rgba(212, 175, 55, 0.08)', borderColor: 'rgba(212, 175, 55, 0.4)' }}>🔥 {hl.sales}</span>
            <h2 className="text-gradient-gold" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginTop: '1rem' }}>{hl.salesTitle}</h2>
            <p style={{ color: 'var(--gold-300)', marginTop: '0.75rem', fontSize: '0.95rem' }}>{hl.salesDesc}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {saleProducts.map((product) => (<ProductCard key={product.id} product={product} locale={locale} />))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link href="/sales" className="btn btn-accent" style={{ padding: '0.875rem 2rem' }}>{hl.salesCta} ({totalSales}) &rarr;</Link>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section id="categories" style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span className="section-label">{t(locale, 'sections.categories')}</span>
            <h2 className="text-gradient-gold" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginTop: '1rem' }}>{t(locale, 'sections.categories.title')}</h2>
            <p style={{ color: 'var(--gold-300)', marginTop: '0.75rem', fontSize: '0.95rem', lineHeight: 1.6 }}>{t(locale, 'sections.categories.desc')}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {activeCategories.slice(0, 6).map((cat) => {
              const imageMap: Record<string, string> = {
                'accumulators': '/images/category-batteries.png',
                'oil': '/images/category-oil.png',
                'devices-and-tools': '/images/category-devices.png',
              };
              const bgImage = imageMap[cat.slug] || '/images/category-default.png';
              return (
                <Link href={`/shop?category=${cat.slug}`} key={cat.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', minHeight: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ position: 'absolute', inset: 0, background: `url(${bgImage}) center/cover no-repeat`, zIndex: 0 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.88) 100%)', zIndex: 1 }} />
                  <div style={{ position: 'relative', zIndex: 2, padding: '2rem', textAlign: 'center' }}>
                    <h3 className="text-gradient-gold" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--champagne-200)', marginBottom: '1rem' }}>{cat._count.products} {t(locale, 'hero.products')}</p>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--brand)' }}>{t(locale, 'sections.browse')} &rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BOOKING BANNER ===== */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'url(/images/booking-banner.png) center/cover no-repeat', zIndex: 0 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 100%)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2, padding: '3.5rem 4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ maxWidth: '500px' }}>
                <h2 className="text-gradient-gold" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{hl.bookTitle}</h2>
                <p style={{ color: 'var(--champagne-200)', lineHeight: 1.625 }}>{hl.bookDesc}</p>
              </div>
              <Link href="/booking" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                {hl.bookCta} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED ===== */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: '6rem 0', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '150%', height: '150%', background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.04), transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
              <span className="section-label">{t(locale, 'sections.featured')}</span>
              <h2 className="text-gradient-gold" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginTop: '1rem' }}>{t(locale, 'sections.featured.title')}</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{t(locale, 'sections.featured.desc')}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {featuredProducts.map((product) => (<ProductCard key={product.id} product={product} locale={locale} />))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <Link href="/shop" className="btn btn-outline" style={{ padding: '0.875rem 2rem' }}>{t(locale, 'sections.catalog')} &rarr;</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
