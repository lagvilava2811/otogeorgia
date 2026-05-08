'use server';

import { cookies } from 'next/headers';
import { Locale, locales, defaultLocale } from '@/lib/i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('locale');
  const val = localeCookie?.value as Locale;
  if (val && locales.includes(val)) return val;
  return defaultLocale;
}

export async function setLocale(locale: Locale) {
  const cookieStore = await cookies();
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });
}
