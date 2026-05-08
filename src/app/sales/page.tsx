import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getLocale } from '@/app/actions/locale';
import { t, Locale } from '@/lib/i18n';

const pageLabels = {
  ka: { title: 'აქციები', desc: 'პროდუქცია ფასდაკლებით — არ გამოტოვოთ!', all: 'ყველა', showing: 'აქცია' },
  ru: { title: 'Акции', desc: 'Продукция со скидкой — не пропустите!', all: 'Все', showing: 'акция' },
  en: { title: 'Sales', desc: 'Discounted products — don\'t miss out!', all: 'All', showing: 'on sale' },
} as const;

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const locale = await getLocale();
  const labels = pageLabels[locale];
  const resolvedParams = await searchParams;
  const categorySlug = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;

  // Get all products on sale (where oldPrice exists and is higher than price)
  const saleProducts = await prisma.product.findMany({
    where: {
      oldPrice: { not: null },
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: { price: 'asc' }
  });

  // Group by category for the sidebar
  const categoryCounts = new Map<string, { name: string; slug: string; count: number }>();
  saleProducts.forEach(p => {
    const existing = categoryCounts.get(p.category.slug);
    if (existing) {
      existing.count++;
    } else {
      categoryCounts.set(p.category.slug, { name: p.category.name, slug: p.category.slug, count: 1 });
    }
  });
  const saleCategories = Array.from(categoryCounts.values()).sort((a, b) => b.count - a.count);
  const totalSaleCount = saleProducts.length;

  // Filter by selected category
  const currentCategory = categorySlug ? saleCategories.find(c => c.slug === categorySlug) : null;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-light)', padding: '6rem 0 3rem', background: 'radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.06), transparent 70%)' }}>
        <div className="container">
          <nav style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t(locale, 'shop.home')}</Link>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--brand)', textTransform: 'uppercase' }}>{labels.title}</span>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
              <span className="text-gradient-gold">{labels.title}</span>
            </h1>
            <span style={{ background: 'var(--brand)', color: 'var(--obsidian-950)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {totalSaleCount}
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>{labels.desc}</p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem 6rem' }}>
        <div style={{ display: 'flex', gap: '3rem' }}>
          {/* Sidebar */}
          <aside style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: '5rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--brand)' }}>{t(locale, 'shop.categories')}</span>
                </div>
                <Link href="/sales" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-light)', background: !categorySlug ? 'rgba(212, 175, 55, 0.05)' : 'transparent', color: !categorySlug ? 'var(--brand)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: !categorySlug ? 600 : 400 }}>
                  <span>{labels.all}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: '9999px', color: 'var(--text-muted)' }}>{totalSaleCount}</span>
                </Link>
                {saleCategories.map((cat, i) => (
                  <Link href={`/sales?category=${cat.slug}`} key={cat.slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1.25rem', borderBottom: i < saleCategories.length - 1 ? '1px solid var(--border-light)' : 'none', background: categorySlug === cat.slug ? 'rgba(212, 175, 55, 0.05)' : 'transparent', color: categorySlug === cat.slug ? 'var(--brand)' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: categorySlug === cat.slug ? 600 : 400 }}>
                    <span>{cat.name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', background: categorySlug === cat.slug ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)', color: categorySlug === cat.slug ? 'var(--brand)' : 'var(--text-muted)', padding: '1px 6px', borderRadius: '9999px' }}>{cat.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Products */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
