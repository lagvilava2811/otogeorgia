'use client';
import Link from 'next/link';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCartUIStore } from '@/store/useCartUIStore';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Locale, t } from '@/lib/i18n';

export default function Navbar({ cartItemCount = 0, locale = 'ka' as Locale }: { cartItemCount?: number; locale?: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const { openCart } = useCartUIStore();

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
            <span style={{ color: 'var(--text-primary)' }}>OTO</span>
            <span style={{ color: 'var(--brand)', marginLeft: '0.25rem' }}>GEORGIA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden-mobile" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <Link href="/shop?category=accumulators" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', transition: 'color 200ms ease' }}>{t(locale, 'nav.accumulators')}</Link>
          <Link href="/devices-and-tools" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', transition: 'color 200ms ease' }}>{t(locale, 'nav.devices')}</Link>
          <Link href="/shop?category=oil" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', transition: 'color 200ms ease' }}>{t(locale, 'nav.oil')}</Link>
          <Link href="/shop" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', transition: 'color 200ms ease' }}>{t(locale, 'nav.catalog')}</Link>
          <Link href="/sales" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand)', transition: 'color 200ms ease' }}>{locale === 'ka' ? 'აქციები' : locale === 'ru' ? 'Акции' : 'Sales'}</Link>
          <Link href="/booking" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)', transition: 'color 200ms ease' }}>{locale === 'ka' ? 'ჯავშანი' : locale === 'ru' ? 'Запись' : 'Book'}</Link>
        </nav>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LanguageSwitcher currentLocale={locale} />
          
          <button onClick={openCart} style={{ 
            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)',
            borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer',
            position: 'relative', transition: 'all 200ms ease'
          }}>
            <ShoppingCart size={16} />
            {cartItemCount > 0 && (
              <span style={{ 
                position: 'absolute', top: -4, right: -4, 
                background: 'var(--brand)', color: 'var(--obsidian-950)', 
                fontSize: '0.65rem', fontWeight: 700, width: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '9999px'
              }}>{cartItemCount}</span>
            )}
          </button>

          <button 
            className="menu-btn" 
            style={{ 
              width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)',
              borderRadius: '9999px', color: 'var(--text-secondary)', cursor: 'pointer'
            }} 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div style={{ 
          padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)', 
          display: 'flex', flexDirection: 'column', gap: '1rem',
          background: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(20px)'
        }}>
          <Link href="/shop?category=accumulators" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>{t(locale, 'nav.accumulators')}</Link>
          <Link href="/devices-and-tools" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>{t(locale, 'nav.devices')}</Link>
          <Link href="/shop?category=oil" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>{t(locale, 'nav.oil')}</Link>
          <Link href="/shop" onClick={() => setIsOpen(false)} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0' }}>{t(locale, 'nav.catalog')}</Link>
        </div>
      )}
      
      <style jsx>{`
        @media (min-width: 768px) {
          .menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
