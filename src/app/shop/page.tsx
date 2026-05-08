import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getLocale } from '@/app/actions/locale';
import { t } from '@/lib/i18n';
import ShopClientView from '@/components/ShopClientView';

export default async function Shop({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const locale = await getLocale();
  const resolvedParams = await searchParams;
  const categorySlug = typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined;

  const allCategories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' }
  });

  const mainSlugs = ['accumulators', 'oil', 'devices-and-tools'];
  const categories = allCategories
    .filter(c => c._count.products > 0)
    .sort((a, b) => {
      const aMain = mainSlugs.indexOf(a.slug);
      const bMain = mainSlugs.indexOf(b.slug);
      if (aMain !== -1 && bMain !== -1) return aMain - bMain;
      if (aMain !== -1) return -1;
      if (bMain !== -1) return 1;
      return b._count.products - a._count.products;
    });
  
  const products = await prisma.product.findMany({
    where: categorySlug ? { category: { slug: categorySlug } } : undefined,
    include: { category: true, reviews: { select: { rating: true } } },
    orderBy: { name: 'asc' }
  });

  const currentCategory = categorySlug ? categories.find(c => c.slug === categorySlug) : null;

  // Extract unique brands & amperages for filters
  const brandCounts = new Map<string, number>();
  const amperageCounts = new Map<string, number>();
  products.forEach(p => {
    if (p.brand) brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
    if (p.amperage) amperageCounts.set(p.amperage, (amperageCounts.get(p.amperage) || 0) + 1);
  });

  const brands = Array.from(brandCounts.entries()).map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count);
  const amperages = Array.from(amperageCounts.entries()).map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value, undefined, { numeric: true }));

  // Serialize products for client
  const serializedProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    oldPrice: p.oldPrice,
    imageUrl: p.imageUrl,
    brand: p.brand,
    amperage: p.amperage,
    avgRating: p.reviews.length > 0 ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length,
  }));

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--border-light)', padding: '6rem 0 3rem', background: 'radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.04), transparent 70%)' }}>
        <div className="container">
          <nav style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t(locale, 'shop.home')}</Link>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>/</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.1em', color: 'var(--brand)', textTransform: 'uppercase' }}>
              {currentCategory ? currentCategory.name : t(locale, 'shop.catalog')}
            </span>
          </nav>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700 }}>
            <span className="text-gradient-gold">{currentCategory ? currentCategory.name : t(locale, 'shop.all')}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', fontSize: '0.95rem' }}>
            {products.length} {currentCategory ? t(locale, 'shop.products_in_cat') : t(locale, 'shop.products_in')}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 2rem 6rem' }}>
        <ShopClientView 
          products={serializedProducts}
          categories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug, count: c._count.products }))}
          brands={brands}
          amperages={amperages}
          currentCategorySlug={categorySlug || null}
          locale={locale}
        />
      </div>
    </div>
  );
}
