import Link from 'next/link';
import { Locale, t } from '@/lib/i18n';

export default function Footer({ locale = 'ka' as Locale }: { locale?: Locale }) {
  return (
    <footer style={{ 
      borderTop: '1px solid var(--glass-border)',
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="container" style={{ padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              <span style={{ color: 'var(--text-primary)' }}>OTO</span>
              <span style={{ color: 'var(--brand)', marginLeft: '0.25rem' }}>GEORGIA</span>
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem', lineHeight: 1.6 }}>
              {t(locale, 'footer.desc')}
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '1.25rem' }}>{t(locale, 'footer.nav')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t(locale, 'footer.home')}</Link>
              <Link href="/shop" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t(locale, 'footer.catalog')}</Link>
              <Link href="/devices-and-tools" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t(locale, 'nav.devices')}</Link>
              <Link href="/sales" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{locale === 'ka' ? 'აქციები' : locale === 'ru' ? 'Акции' : 'Sales'}</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '1.25rem' }}>{t(locale, 'footer.categories')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/shop?category=accumulators" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t(locale, 'nav.accumulators')}</Link>
              <Link href="/shop?category=oil" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t(locale, 'nav.oil')}</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: '1.25rem' }}>{t(locale, 'footer.contact')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>info@otogeorgia.ge</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>+995 XXX XX XX XX</span>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>{t(locale, 'footer.rights')}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>PREMIUM QUALITY</span>
        </div>
      </div>
    </footer>
  );
}
