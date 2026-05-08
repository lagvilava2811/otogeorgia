'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE_NAME = 'cart_session_id';

export async function getSessionId() {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionIdCookie?.value;
}

export async function getCart() {
  const sessionId = await getSessionId();
  
  if (!sessionId) {
    return { items: [] }; // Empty cart if no session
  }
  
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
  
  return cart || { items: [] };
}

export async function addToCart(productId: string) {
  const cookieStore = await cookies();
  let sessionId = await getSessionId();
  
  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
  }
  
  let cart = await prisma.cart.findUnique({
    where: { sessionId },
  });
  
  if (!cart) {
    cart = await prisma.cart.create({
      data: { sessionId },
    });
  }
  
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId: productId
      }
    }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: productId,
        quantity: 1
      }
    });
  }

  revalidatePath('/');
  revalidatePath('/shop');
  revalidatePath('/product/[slug]', 'page');
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  }
  revalidatePath('/');
  revalidatePath('/shop');
}

export async function removeFromCart(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath('/');
  revalidatePath('/shop');
}
