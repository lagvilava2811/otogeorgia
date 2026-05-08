import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fetchAllProducts() {
  let allProducts: any[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching page ${page}...`);
    const res = await fetch(`https://otogeorgia.ge/wp-json/wc/store/products?per_page=100&page=${page}`);
    if (!res.ok) {
      if (res.status === 400) {
        // likely out of bounds
        break;
      }
      console.error(`Error fetching page ${page}: ${res.statusText}`);
      break;
    }
    const products = await res.json();
    if (products.length === 0) {
      hasMore = false;
    } else {
      allProducts = allProducts.concat(products);
      page++;
    }
  }

  return allProducts;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

async function main() {
  console.log('Starting migration...');
  
  // Clean DB
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const products = await fetchAllProducts();
  console.log(`Found ${products.length} products. Migrating to database...`);

  // Extract unique categories
  const categoriesMap = new Map();
  for (const p of products) {
    for (const c of p.categories || []) {
      if (!categoriesMap.has(c.slug)) {
        categoriesMap.set(c.slug, { name: c.name, slug: c.slug, description: '' });
      }
    }
  }

  // Create categories
  for (const cat of categoriesMap.values()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
      }
    });
  }

  // Get categories from DB to map IDs
  const dbCategories = await prisma.category.findMany();
  const catSlugToId = new Map(dbCategories.map(c => [c.slug, c.id]));

  let imported = 0;
  for (const p of products) {
    const mainCategory = (p.categories && p.categories.length > 0) ? p.categories[0].slug : null;
    const categoryId = mainCategory ? catSlugToId.get(mainCategory) : dbCategories[0]?.id; // fallback to first

    const price = parseInt(p.prices.price) / (10 ** p.prices.currency_minor_unit);
    const oldPrice = p.prices.regular_price !== p.prices.sale_price ? parseInt(p.prices.regular_price) / (10 ** p.prices.currency_minor_unit) : null;
    const imageUrl = (p.images && p.images.length > 0) ? p.images[0].src : null;
    let attributesText = '';
    if (p.attributes && p.attributes.length > 0) {
      const attrLines: string[] = [];
      for (const attr of p.attributes) {
        if (attr.terms && attr.terms.length > 0) {
          const terms = attr.terms.map((t: any) => t.name).join(', ');
          attrLines.push(`${attr.name}: ${terms}`);
        }
      }
      if (attrLines.length > 0) {
        attributesText = '\n\nმახასიათებლები:\n' + attrLines.join('\n');
      }
    }

    const description = stripHtml(p.short_description || p.description || '') + attributesText;

    // Extract brand and amperage from attributes
    let brand: string | null = null;
    let amperage: string | null = null;
    if (p.attributes && p.attributes.length > 0) {
      for (const attr of p.attributes) {
        const lowerName = attr.name.toLowerCase();
        if (lowerName === 'brands' || lowerName === 'brand' || lowerName === 'ბრენდი') {
          brand = attr.terms?.[0]?.name || null;
        }
        if (lowerName === 'ah' || lowerName.includes('amper')) {
          amperage = attr.terms?.[0]?.name || null;
        }
      }
    }

    await prisma.product.create({
      data: {
        name: stripHtml(p.name),
        slug: p.slug + '-' + p.id,
        price: price || 0,
        oldPrice: oldPrice || null,
        description: description,
        imageUrl: imageUrl,
        brand: brand,
        amperage: amperage,
        isFeatured: p.is_on_sale || false,
        categoryId: categoryId,
      }
    });
    imported++;
  }

  console.log(`Successfully migrated ${imported} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
