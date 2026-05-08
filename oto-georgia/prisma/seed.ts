import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create Categories
  const catAcc = await prisma.category.upsert({
    where: { slug: 'accumulators' },
    update: {},
    create: {
      name: 'აკუმლატორები',
      slug: 'accumulators',
      description: 'მანქანის აკუმლატორები',
    },
  });

  const catOil = await prisma.category.upsert({
    where: { slug: 'oil' },
    update: {},
    create: {
      name: 'ძრავის ზეთი',
      slug: 'oil',
      description: 'მაღალი ხარისხის ძრავის ზეთები',
    },
  });

  const catTools = await prisma.category.upsert({
    where: { slug: 'tools' },
    update: {},
    create: {
      name: 'მოწყობილობები და ხელსაწყოები',
      slug: 'tools',
      description: 'პროფესიონალური ხელსაწყოები',
    },
  });

  // Create Products
  const products = [
    {
      name: 'Polo Expert 75 A/H 680a R+',
      slug: 'polo-expert-75-ah-680a-r',
      price: 338,
      oldPrice: 370,
      categoryId: catAcc.id,
      imageUrl: '/images/polo-75.jpg',
      isFeatured: true,
    },
    {
      name: 'AKBAT 75 12V 75Ah 640A (EN)',
      slug: 'akbat-75-12v-75ah-640a-en',
      price: 195,
      oldPrice: 215,
      categoryId: catAcc.id,
      imageUrl: '/images/akbat-75.jpg',
      isFeatured: true,
    },
    {
      name: 'AKUSTONE 190 Ah',
      slug: 'akustone-190-ah',
      price: 500,
      oldPrice: 690,
      categoryId: catAcc.id,
      imageUrl: '/images/akustone-190.jpg',
      isFeatured: false,
    },
    {
      name: 'ძრავის ზეთი Polo 5W - 40',
      slug: 'motor-oil-polo-5w-40',
      price: 35,
      oldPrice: 140,
      categoryId: catOil.id,
      imageUrl: '/images/polo-5w40.jpg',
      isFeatured: true,
    },
    {
      name: 'ძრავის ზეთი Rolf 5W - 40',
      slug: 'motor-oil-rolf-5w-40',
      price: 20,
      oldPrice: 70,
      categoryId: catOil.id,
      imageUrl: '/images/rolf-5w40.jpg',
      isFeatured: false,
    },
    {
      name: 'TOTAL TIRLI1201 ლითიუმ-იონის დარტყმის დრაივერი',
      slug: 'total-tirli1201',
      price: 225,
      categoryId: catTools.id,
      imageUrl: '/images/total-drill.jpg',
      isFeatured: true,
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
