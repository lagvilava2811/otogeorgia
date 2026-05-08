'use client';

import { useTransition } from 'react';
import { addToCart } from '@/app/actions/cart';
import { useCartUIStore } from '@/store/useCartUIStore';
import { Locale, t } from '@/lib/i18n';

export default function AddToCartButton({ productId, fullWidth = false, locale = 'ka' as Locale }: { productId: string; fullWidth?: boolean; locale?: Locale }) {
  const [isPending, startTransition] = useTransition();
  const { openCart } = useCartUIStore();

  const handleAdd = () => {
    startTransition(async () => {
      await addToCart(productId);
      openCart();
    });
  };

  return (
    <button className="btn btn-primary" style={{ width: fullWidth ? '100%' : 'auto', opacity: isPending ? 0.7 : 1, fontSize: '0.8rem', padding: '0.6rem 1rem' }} onClick={handleAdd} disabled={isPending}>
      {isPending ? '...' : t(locale, 'product.add_to_cart')}
    </button>
  );
}
