import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getLocale } from '@/app/actions/locale';
import { t, Locale } from '@/lib/i18n';
import { Metadata } from 'next';
import styles from './devices.module.css';

export const metadata: Metadata = {
  title: 'მოწყობილობები და ხელსაწყოები — OTO GEORGIA',
  description: 'პრემიუმ ხარისხის მოწყობილობები და ხელსაწყოები TOTAL ბრენდის. კორდელს დრელები, საფქვავები, საჭრელები და სხვა.',
};

const pageLabels = {
  ka: {
    title: 'მოწყობილობები და',
    titleAccent: 'ხელსაწყოები',
    subtitle: 'პროფესიონალური ხელსაწყოები TOTAL ბრენდის — საუკეთესო ფასად',
    badge: 'TOTAL ინსტრუმენტები',
    cta: 'შეიძინეთ ახლავე',
    ctaAll: 'ყველა ხელსაწყოს ნახვა',
    delivery: 'უფასო მიტანის სერვისი',
    deliveryDesc: '99 ლარიდან',
    returns: 'მოქნილი დაბრუნების პოლიტიკა',
    returnsDesc: 'მარტივი და სწრაფი',
    support: 'ექსპერტი კლიენტების სერვისი',
    supportDesc: 'ონლაინ კონსულტაცია',
    payment: 'სწრაფი და უსაფრთხო გადახდა',
    paymentDesc: '100% დაცული',
    gifts: 'საჩუქრები ერთგულ მომხმარებლებს',
    giftsDesc: 'უამრავი სურპრიზი',
    popularTitle: 'ყველაზე მოთხოვნადი პროდუქცია',
    popularDesc: 'ჩვენი მომხმარებლების არჩევანი — ყველაზე პოპულარული ხელსაწყოები',
    browseCategory: 'კატეგორიის ნახვა',
    productsCount: 'პროდუქტი',
    brandPartner: 'ოფიციალური პარტნიორი',
  },
  ru: {
    title: 'Устройства и',
    titleAccent: 'инструменты',
    subtitle: 'Профессиональные инструменты бренда TOTAL — по лучшим ценам',
    badge: 'Инструменты TOTAL',
    cta: 'Купить сейчас',
    ctaAll: 'Все инструменты',
    delivery: 'Бесплатная доставка',
    deliveryDesc: 'От 99 лари',
    returns: 'Гибкая политика возврата',
    returnsDesc: 'Просто и быстро',
    support: 'Экспертная поддержка',
    supportDesc: 'Онлайн консультация',
    payment: 'Быстрая и безопасная оплата',
    paymentDesc: '100% защита',
    gifts: 'Подарки лояльным покупателям',
    giftsDesc: 'Множество сюрпризов',
    popularTitle: 'Самые популярные товары',
    popularDesc: 'Выбор наших покупателей — самые популярные инструменты',
    browseCategory: 'Смотреть категорию',
    productsCount: 'товаров',
    brandPartner: 'Официальный партнёр',
  },
  en: {
    title: 'Devices &',
    titleAccent: 'Tools',
    subtitle: 'Professional tools by TOTAL brand — at the best prices',
    badge: 'TOTAL Tools',
    cta: 'Buy Now',
    ctaAll: 'View All Tools',
    delivery: 'Free Delivery Service',
    deliveryDesc: 'From 99 GEL',
    returns: 'Flexible Return Policy',
    returnsDesc: 'Quick and easy',
    support: 'Expert Customer Service',
    supportDesc: 'Online consultation',
    payment: 'Fast & Secure Payment',
    paymentDesc: '100% Protected',
    gifts: 'Gifts for Loyal Customers',
    giftsDesc: 'Plenty of surprises',
    popularTitle: 'Most Popular Products',
    popularDesc: 'Customer favorites — the most popular tools',
    browseCategory: 'Browse Category',
    productsCount: 'products',
    brandPartner: 'Official Partner',
  },
} as const;

const featureSvgIcons = {
  delivery: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  returns: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
  ),
  support: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/>
    </svg>
  ),
  payment: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  gifts: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
};

const featureIcons = [
  { iconKey: 'delivery' as const, labelKey: 'delivery' as const, descKey: 'deliveryDesc' as const },
  { iconKey: 'returns' as const, labelKey: 'returns' as const, descKey: 'returnsDesc' as const },
  { iconKey: 'support' as const, labelKey: 'support' as const, descKey: 'supportDesc' as const },
  { iconKey: 'payment' as const, labelKey: 'payment' as const, descKey: 'paymentDesc' as const },
  { iconKey: 'gifts' as const, labelKey: 'gifts' as const, descKey: 'giftsDesc' as const },
];

export default async function DevicesAndToolsPage() {
  const locale = await getLocale();
  const labels = pageLabels[locale];

  // Get products in "devices-and-tools" category
  const products = await prisma.product.findMany({
    where: { category: { slug: 'devices-and-tools' } },
    include: { category: true },
    orderBy: { name: 'asc' },
  });

  const productCount = products.length;

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'url(/images/devices-hero.png) center/cover no-repeat',
          zIndex: 0,
        }} />
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.85) 100%)',
          zIndex: 1,
        }} />
        {/* Gold ambient light */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 30% 70%, rgba(0, 180, 180, 0.08), transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(212, 175, 55, 0.06), transparent 60%)',
          zIndex: 1,
        }} />

        <div className={`container ${styles.heroGrid}`}>
          {/* Left: Text Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div className="badge animate-fade-in">
              <span className="badge-dot" />
              <span>{labels.badge}</span>
            </div>

            <h1 className="animate-fade-in animate-fade-in-delay-1" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              fontWeight: 900, lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}>
              <span style={{ display: 'block', color: 'var(--champagne-200)' }}>{labels.title}</span>
              <span className="text-gradient-gold" style={{ display: 'block' }}>{labels.titleAccent}</span>
            </h1>

            <p className="animate-fade-in animate-fade-in-delay-2" style={{
              fontSize: '1.05rem',
              color: 'var(--gold-300)',
              lineHeight: 1.6,
              maxWidth: '500px',
            }}>
              {labels.subtitle}
            </p>

            <div className="animate-fade-in animate-fade-in-delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href="/shop?category=devices-and-tools" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
                {labels.cta} →
              </Link>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.25rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
              }}>
                <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--brand)' }}>{productCount}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{labels.productsCount}</span>
              </div>
            </div>

            {/* TOTAL branding */}
            <div className="animate-fade-in animate-fade-in-delay-4" style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(212,175,55,0.12)',
            }}>
              <div style={{
                padding: '0.5rem 1rem',
                background: 'rgba(0, 180, 180, 0.08)',
                border: '1px solid rgba(0, 180, 180, 0.25)',
                borderRadius: '8px',
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: '#00B4B4',
                letterSpacing: '0.1em',
              }}>
                TOTAL
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {labels.brandPartner}
                </span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--champagne-200)' }}>
                  One-Stop Tools Station
                </span>
              </div>
            </div>
          </div>

          {/* Right: YouTube Video Embed */}
          <div className={`animate-fade-in animate-fade-in-delay-2 ${styles.heroVideo}`}>
            {/* Glow ring behind video */}
            <div style={{
              position: 'absolute',
              width: '110%', height: '110%',
              borderRadius: '24px',
              background: 'radial-gradient(ellipse at center, rgba(0, 180, 180, 0.08), transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />
            {/* Video container */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '520px',
              aspectRatio: '16/9',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(0, 180, 180, 0.2)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0, 180, 180, 0.08)',
            }}>
              <iframe
                src="https://www.youtube.com/embed/GDGr3lHeix8?autoplay=0&rel=0&modestbranding=1"
                title="TOTAL Tools"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          zIndex: 3,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>SCROLL</span>
          <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, var(--brand), transparent)', animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ===== FEATURE STRIP ===== */}
      <section style={{
        borderTop: '1px solid var(--glass-border)',
        borderBottom: '1px solid var(--glass-border)',
        background: 'linear-gradient(180deg, rgba(0, 180, 180, 0.03) 0%, rgba(10,10,10,0.5) 100%)',
        backdropFilter: 'blur(20px)',
      }}>
        <div className={`container ${styles.featureGrid}`}>
          {featureIcons.map((feature, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              textAlign: 'center', padding: '2rem 1rem',
              borderRight: i < 4 ? '1px solid var(--glass-border)' : 'none',
              transition: 'all 300ms ease',
            }}>
              <div style={{
                width: '52px', height: '52px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(0, 180, 180, 0.06))',
                border: '1px solid rgba(212, 175, 55, 0.15)',
                color: 'var(--brand)',
                marginBottom: '0.75rem',
              }}>
                {featureSvgIcons[feature.iconKey]}
              </div>
              <span style={{
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.05em',
                color: 'var(--champagne-200)',
                marginBottom: '0.25rem',
              }}>
                {labels[feature.labelKey]}
              </span>
              <span style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
              }}>
                {labels[feature.descKey]}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCTS GRID ===== */}
      <section style={{
        padding: '5rem 0',
        position: 'relative',
        background: 'linear-gradient(180deg, transparent 0%, rgba(212, 175, 55, 0.02) 50%, transparent 100%)',
      }}>
        {/* Ambient glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%', height: '120%',
          background: 'radial-gradient(circle at center, rgba(0, 180, 180, 0.03), transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3.5rem' }}>
            <span className="section-label" style={{
              background: 'rgba(0, 180, 180, 0.06)',
              borderColor: 'rgba(0, 180, 180, 0.3)',
            }}>
              🔧 {labels.badge}
            </span>
            <h2 className="text-gradient-gold" style={{
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              marginTop: '1rem',
            }}>
              {labels.popularTitle}
            </h2>
            <p style={{
              color: 'var(--gold-300)',
              marginTop: '0.75rem',
              fontSize: '0.95rem',
              lineHeight: 1.6,
            }}>
              {labels.popularDesc}
            </p>
          </div>

          {products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}>
              {products.slice(0, 12).map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
            }}>
              <div style={{
                fontSize: '4rem', marginBottom: '1rem',
              }}>🔧</div>
              <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-muted)',
                marginBottom: '1.5rem',
              }}>
                {t(locale, 'shop.not_found')}
              </p>
              <Link href="/shop" className="btn btn-outline">
                {t(locale, 'sections.catalog')} →
              </Link>
            </div>
          )}

          {products.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <Link href="/shop?category=devices-and-tools" className="btn btn-accent" style={{
                padding: '1rem 2.5rem',
                fontSize: '1rem',
              }}>
                {labels.ctaAll} ({productCount}) →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1px solid rgba(0, 180, 180, 0.15)',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'url(/images/devices-hero.png) center/cover no-repeat',
              zIndex: 0, filter: 'blur(2px)',
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.8) 100%)',
              zIndex: 1,
            }} />
            <div style={{
              position: 'relative', zIndex: 2,
              padding: '4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '2rem', flexWrap: 'wrap',
            }}>
              <div style={{ maxWidth: '550px' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(0, 180, 180, 0.08)',
                  border: '1px solid rgba(0, 180, 180, 0.2)',
                  borderRadius: '6px',
                  marginBottom: '1rem',
                }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', color: '#00B4B4', textTransform: 'uppercase' }}>
                    TOTAL · One-Stop Tools Station
                  </span>
                </div>
                <h2 className="text-gradient-gold" style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  marginBottom: '0.75rem',
                }}>
                  {labels.title} {labels.titleAccent}
                </h2>
                <p style={{
                  color: 'var(--champagne-200)',
                  lineHeight: 1.625,
                  fontSize: '0.95rem',
                }}>
                  {labels.subtitle}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Link href="/shop?category=devices-and-tools" className="btn btn-primary" style={{
                  padding: '1rem 2.5rem', fontSize: '1rem', whiteSpace: 'nowrap',
                }}>
                  {labels.cta} →
                </Link>
                <Link href="/booking" className="btn btn-ghost" style={{
                  padding: '0.75rem 2rem', fontSize: '0.9rem', whiteSpace: 'nowrap',
                }}>
                  {locale === 'ka' ? 'კონსულტაციის მიღება' : locale === 'ru' ? 'Получить консультацию' : 'Get Consultation'} →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
