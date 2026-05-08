'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitReview(productId: string, rating: number, comment: string, author: string) {
  if (rating < 1 || rating > 5) return { error: 'Rating must be 1-5' };
  
  await prisma.review.create({
    data: {
      productId,
      rating,
      comment: comment || null,
      author: author || 'ანონიმი',
    }
  });

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (product) {
    revalidatePath(`/product/${product.slug}`);
  }
  revalidatePath('/shop');
  revalidatePath('/');

  return { success: true };
}
