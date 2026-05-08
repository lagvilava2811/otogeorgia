import Link from 'next/link';
import BookingForm from '@/components/BookingForm';
import { getLocale } from '@/app/actions/locale';
import { Locale } from '@/lib/i18n';

const pageLabels = {
  ka: { title: 'ვიზიტის დაჯავშნა', desc: 'დაჯავშნეთ ვიზიტი და მიიღეთ პროფესიონალური კონსულტაცია', info: 'საკონტაქტო ინფორმაცია', hours: 'სამუშაო საათები', address: 'მისამართი', hrsText: 'ორშაბათი - შაბათი: 10:00 - 19:00\nკვირა: დასვენება' },
  ru: { title: 'Забронировать визит', desc: 'Забронируйте визит и получите профессиональную консультацию', info: 'Контактная информация', hours: 'Рабочие часы', address: 'Адрес', hrsText: 'Понедельник - Суббота: 10:00 - 19:00\nВоскресенье: выходной' },
  en: { title: 'Book a Visit', desc: 'Book a visit and get professional consultation', info: 'Contact Information', hours: 'Working Hours', address: 'Address', hrsText: 'Monday - Saturday: 10:00 - 19:00\nSunday: Closed' },
} as const;

export default async function BookingPage() {
  const locale = await getLocale();
  const l = pageLabels[locale];

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--border-light)', padding: '6rem 0 3rem', background: 'radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.06), transparent 70%)' }}>
        <div className="container">
          <nav style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {locale === 'ka' ? 'მთავარი' : locale === 'ru' ? 'Главная' : 'Home'}
            </Link>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--brand)', textTransform: 'uppercase' }}>{l.title}</span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
            <span className="text-gradient-gold">{l.title}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>{l.desc}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem 6rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'start' }}>
          {/* Form */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <BookingForm locale={locale} />
          </div>

          {/* Info Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)' }}>{l.info}</span>
              </div>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>EMAIL</span>
                  <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem' }}>info@otogeorgia.ge</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>TEL</span>
                  <p style={{ color: 'var(--text-primary)', marginTop: '0.25rem' }}>+995 XXX XX XX XX</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)' }}>{l.hours}</span>
              </div>
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{l.hrsText}</p>
              </div>
            </div>

            <div style={{ background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.15)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--brand)' }}>OTO GEORGIA</span>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                {locale === 'ka' ? 'პრემიუმ ხარისხი • პროფესიონალური მომსახურება' : locale === 'ru' ? 'Премиум качество • Профессиональный сервис' : 'Premium Quality • Professional Service'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
