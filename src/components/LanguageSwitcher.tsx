'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Locale, locales } from '@/lib/i18n';
import { setLocale } from '@/app/actions/locale';

const labels: Record<Locale, string> = {
  ka: 'ქარ',
  ru: 'Рус',
  en: 'Eng',
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLang = (newLocale: Locale) => {
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <div style={{ 
      display: 'flex', alignItems: 'center', gap: '2px', 
      background: 'rgba(255,255,255,0.03)', 
      border: '1px solid var(--border-light)', 
      borderRadius: '8px', padding: '2px',
      opacity: isPending ? 0.6 : 1,
      transition: 'opacity 200ms ease'
    }}>
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLang(loc)}
          disabled={isPending}
          style={{
            padding: '5px 8px',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: currentLocale === loc ? 600 : 400,
            letterSpacing: '0.05em',
            background: currentLocale === loc ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
            color: currentLocale === loc ? 'var(--brand)' : 'var(--text-muted)',
            border: currentLocale === loc ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
          }}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
