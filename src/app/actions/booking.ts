'use server';

import { prisma } from '@/lib/prisma';

export async function submitBooking(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const service = formData.get('service') as string;
  const message = formData.get('message') as string;

  if (!name || !phone) {
    return { error: 'Name and phone are required' };
  }

  // For now store in a simple way - can be expanded later
  // We'll use a JSON file or database table
  const booking = await prisma.booking.create({
    data: { name, phone, email, date, time, service, message }
  });

  return { success: true, bookingId: booking.id };
}
