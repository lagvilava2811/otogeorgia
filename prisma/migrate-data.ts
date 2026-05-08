// Migration script: Export data from SQLite and import into PostgreSQL
// Run: npx tsx prisma/migrate-data.ts

import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // Read from local SQLite
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  let sqliteDb;
  try {
    sqliteDb = new Database(dbPath, { readonly: true });
  } catch (e) {
    console.log('SQLite dev.db not found at prisma/dev.db, trying root dev.db...');
    sqliteDb = new Database(path.join(process.cwd(), 'dev.db'), { readonly: true });
  }

  console.log('📦 Reading data from SQLite...');

  // Read categories
  const categories = sqliteDb.prepare('SELECT * FROM Category').all() as any[];
  console.log(`  Found ${categories.length} categories`);

  // Read products
  const products = sqliteDb.prepare('SELECT * FROM Product').all() as any[];
  console.log(`  Found ${products.length} products`);

  // Read reviews
  const reviews = sqliteDb.prepare('SELECT * FROM Review').all() as any[];
  console.log(`  Found ${reviews.length} reviews`);

  // Read bookings
  let bookings: any[] = [];
  try {
    bookings = sqliteDb.prepare('SELECT * FROM Booking').all() as any[];
    console.log(`  Found ${bookings.length} bookings`);
  } catch { console.log('  No bookings table found'); }

  sqliteDb.close();

  console.log('\n🚀 Uploading to PostgreSQL (Neon)...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.booking.deleteMany();
  console.log('  Cleared existing data');

  // Insert categories
  for (const cat of categories) {
    await prisma.category.create({
      data: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || null,
        createdAt: new Date(cat.createdAt),
        updatedAt: new Date(cat.updatedAt),
      },
    });
  }
  console.log(`  ✅ Inserted ${categories.length} categories`);

  // Insert products
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || null,
        price: p.price,
        oldPrice: p.oldPrice || null,
        imageUrl: p.imageUrl || null,
        brand: p.brand || null,
        amperage: p.amperage || null,
        categoryId: p.categoryId,
        stock: p.stock || 0,
        isFeatured: Boolean(p.isFeatured),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      },
    });
  }
  console.log(`  ✅ Inserted ${products.length} products`);

  // Insert reviews
  for (const r of reviews) {
    await prisma.review.create({
      data: {
        id: r.id,
        rating: r.rating,
        comment: r.comment || null,
        author: r.author || 'ანონიმი',
        productId: r.productId,
        createdAt: new Date(r.createdAt),
      },
    });
  }
  console.log(`  ✅ Inserted ${reviews.length} reviews`);

  // Insert bookings
  for (const b of bookings) {
    await prisma.booking.create({
      data: {
        id: b.id,
        name: b.name,
        phone: b.phone,
        email: b.email || null,
        date: b.date || null,
        time: b.time || null,
        service: b.service || null,
        message: b.message || null,
        status: b.status || 'pending',
        createdAt: new Date(b.createdAt),
      },
    });
  }
  console.log(`  ✅ Inserted ${bookings.length} bookings`);

  console.log('\n🎉 Migration complete!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
