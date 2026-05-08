'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateProductDiscount(productId: string, newOldPrice: number | null) {
  await prisma.product.update({
    where: { id: productId },
    data: { 
      oldPrice: newOldPrice,
      isFeatured: newOldPrice !== null // Automatically feature products on sale
    }
  });
  revalidatePath('/admin');
  revalidatePath('/');
  revalidatePath('/shop');
}

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const categoryId = formData.get('categoryId') as string;
  const description = formData.get('description') as string;
  const imageUrl = formData.get('imageUrl') as string;

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

  await prisma.product.create({
    data: {
      name,
      slug,
      price,
      categoryId: categoryId,
      description,
      imageUrl: imageUrl || null,
    }
  });

  revalidatePath('/admin');
  revalidatePath('/shop');
}

export async function deleteProduct(productId: string) {
  await prisma.product.delete({
    where: { id: productId }
  });
  revalidatePath('/admin');
  revalidatePath('/shop');
}
