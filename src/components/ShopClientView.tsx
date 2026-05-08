'use client';

import { useState } from 'react';
import Link from 'next/link';
import FilterCheckbox from './FilterCheckbox';
import ProductCard from './ProductCard';
import { StarRatingDisplay } from './StarRating';
import { Locale, t } from '@/lib/i18n';

type Product = {
  id: string; name: string; slug: string; price: number; oldPrice: number | null;
  imageUrl: string | null; brand: string | null; amperage: string | null;
  avgRating: number; reviewCount: number;
};

type Category = { id: string; name: string; slug: string; count: number };

const filterLabels = {
  ka: { brands: 'ბრენდი', amperage: 'ამპერაჟი', showing: 'ნაჩვენებია' },
  ru: { brands: 'Бренд', amperage: 'Ампераж', showing: 'Показано' },
  en: { brands: 'Brand', amperage: 'Amperage', showing: 'Showing' },
} as const;

export default function ShopClientView({
  products, categories, brands, amperages, currentCategorySlug, locale
}: {
  products: Product[];
  categories: Category[];
  brands: { value: string; count: number }[];
  amperages: { value: string; count: number }[];
  currentCategorySlug: string | null;
  locale: Locale;
}) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAmperages, setSelectedAmperages] = useState<string[]>([]);

  const toggleBrand = (v: string) => setSelectedBrands(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  const toggleAmperage = (v: string) => setSelectedAmperages(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const filtered = products.filter(p => {
    if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;
    if (selectedAmperages.length > 0 && (!p.amperage || !selectedAmperages.includes(p.amperage))) return false;
    return true;
  });

  const labels = filterLabels[locale];

  return (
    <div style={{ display: 'flex', gap: '3rem' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: '5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Categories */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)' }}>{t(locale, 'shop.categories')}</span>
            </div>
            <Link href="/shop" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-light)', background: !currentCategorySlug ? 'rgba(212, 175, 55, 0.05)' : 'transparent', color: !currentCategorySlug ? 'var(--brand)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: !currentCategorySlug ? 600 : 400 }}>
              <span>{t(locale, 'shop.allCategory')}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '9999px', color: 'var(--text-muted)' }}>{categories.reduce((a, c) => a + c.count, 0)}</span>
            </Link>
            {categories.map((cat, i) => (
              <Link href={`/shop?category=${cat.slug}`} key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: i < categories.length - 1 ? '1px solid var(--border-light)' : 'none', background: currentCategorySlug === cat.slug ? 'rgba(212, 175, 55, 0.05)' : 'transparent', color: currentCategorySlug === cat.slug ? 'var(--brand)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: currentCategorySlug === cat.slug ? 600 : 400 }}>
                <span>{cat.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: currentCategorySlug === cat.slug ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)', color: currentCategorySlug === cat.slug ? 'var(--brand)' : 'var(--text-muted)', padding: '1px 6px', borderRadius: '9999px' }}>{cat.count}</span>
              </Link>
            ))}
          </div>

          {/* Brand Filter */}
          {brands.length > 0 && (
            <FilterCheckbox title={labels.brands} items={brands} paramName="brand" currentValues={selectedBrands} onToggle={toggleBrand} />
          )}

          {/* Amperage Filter */}
          {amperages.length > 0 && (
            <FilterCheckbox title={labels.amperage} items={amperages} paramName="amperage" currentValues={selectedAmperages} onToggle={toggleAmperage} />
          )}
        </div>
      </aside>

      {/* Product Grid */}
      <div style={{ flex: 1 }}>
        {/* Filter status */}
        {(selectedBrands.length > 0 || selectedAmperages.length > 0) && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{labels.showing}: {filtered.length}</span>
            {selectedBrands.map(b => (
              <button key={b} onClick={() => toggleBrand(b)} style={{ padding: '3px 10px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '9999px', color: 'var(--brand)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {b} <span style={{ fontSize: '0.65rem' }}>✕</span>
              </button>
            ))}
            {selectedAmperages.map(a => (
              <button key={a} onClick={() => toggleAmperage(a)} style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-default)', borderRadius: '9999px', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {a} <span style={{ fontSize: '0.65rem' }}>✕</span>
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{t(locale, 'shop.not_found')}</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
