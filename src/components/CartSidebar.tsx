'use client';

import { useCartUIStore } from '@/store/useCartUIStore';
import { updateCartItemQuantity, removeFromCart } from '@/app/actions/cart';
import { useTransition } from 'react';
import { Locale, t } from '@/lib/i18n';

type CartItem = { id: string; quantity: number; product: { id: string; name: string; price: number; oldPrice: number | null; imageUrl: string | null; }; };

export default function CartSidebar({ items, locale = 'ka' as Locale }: { items: CartItem[]; locale?: Locale }) {
  const { isOpen, closeCart } = useCartUIStore();
  const [isPending, startTransition] = useTransition();
  if (!isOpen) return null;
  const total = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 999 }} onClick={closeCart} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: '420px', maxWidth: '100%', background: 'var(--obsidian-900)', zIndex: 1000, borderLeft: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 40px rgba(0,0,0,0.6)', animation: 'slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>{t(locale, 'cart.title')}</h2>
          <button onClick={closeCart} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '9999px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>{t(locale, 'cart.empty')}</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', opacity: isPending ? 0.6 : 1, transition: 'opacity 200ms' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '8px', flexShrink: 0, background: item.product.imageUrl ? `url(${item.product.imageUrl}) center/contain no-repeat` : 'rgba(255,255,255,0.05)', backgroundColor: '#fafafa' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</h4>
                <div style={{ color: 'var(--brand)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem' }}>{item.product.price} ₾</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => startTransition(() => updateCartItemQuantity(item.id, item.quantity - 1))}>−</button>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.9rem' }} onClick={() => startTransition(() => updateCartItemQuantity(item.id, item.quantity + 1))}>+</button>
                  <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }} onClick={() => startTransition(() => removeFromCart(item.id))}>{t(locale, 'cart.remove')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t(locale, 'cart.total')}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand)' }}>{total.toFixed(2)} ₾</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '0.9rem' }}>{t(locale, 'cart.checkout')}</button>
          </div>
        )}
      </div>
    </>
  );
}
