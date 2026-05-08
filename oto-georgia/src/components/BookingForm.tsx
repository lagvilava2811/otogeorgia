'use client';

import { useState, useTransition } from 'react';
import { submitBooking } from '@/app/actions/booking';
import { Locale } from '@/lib/i18n';

const labels = {
  ka: {
    title: 'ვიზიტის დაჯავშნა',
    subtitle: 'დაჯავშნეთ ვიზიტი და ჩვენი სპეციალისტი დაგეხმარებათ სწორი პროდუქტის შერჩევაში',
    name: 'სახელი და გვარი',
    phone: 'ტელეფონის ნომერი',
    email: 'ელ. ფოსტა (არასავალდებულო)',
    date: 'სასურველი თარიღი',
    time: 'სასურველი დრო',
    service: 'მომსახურების ტიპი',
    message: 'დამატებითი ინფორმაცია',
    submit: 'დაჯავშნა',
    success: 'ჯავშანი წარმატებით დაფიქსირდა! ჩვენ დაგიკავშირდებით მალე.',
    services: ['აკუმულატორის შეცვლა', 'ძრავის ზეთის შეცვლა', 'კონსულტაცია', 'სხვა'],
    times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  ru: {
    title: 'Забронировать визит',
    subtitle: 'Забронируйте визит и наш специалист поможет вам выбрать правильный продукт',
    name: 'Имя и фамилия',
    phone: 'Номер телефона',
    email: 'Email (необязательно)',
    date: 'Желаемая дата',
    time: 'Желаемое время',
    service: 'Тип услуги',
    message: 'Дополнительная информация',
    submit: 'Забронировать',
    success: 'Бронирование успешно! Мы свяжемся с вами в ближайшее время.',
    services: ['Замена аккумулятора', 'Замена масла', 'Консультация', 'Другое'],
    times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
  en: {
    title: 'Book a Visit',
    subtitle: 'Book a visit and our specialist will help you choose the right product',
    name: 'Full Name',
    phone: 'Phone Number',
    email: 'Email (optional)',
    date: 'Preferred Date',
    time: 'Preferred Time',
    service: 'Service Type',
    message: 'Additional Information',
    submit: 'Book Now',
    success: 'Booking confirmed! We\'ll contact you soon.',
    services: ['Battery Replacement', 'Oil Change', 'Consultation', 'Other'],
    times: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  },
} as const;

export default function BookingForm({ locale = 'ka' as Locale }: { locale?: Locale }) {
  const l = labels[locale];
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await submitBooking(formData);
      if (result.success) setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '16px' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--brand)', marginBottom: '0.75rem' }}>{l.success}</h3>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div>
          <label className="label">{l.name} *</label>
          <input className="input" name="name" required />
        </div>
        <div>
          <label className="label">{l.phone} *</label>
          <input className="input" name="phone" type="tel" required />
        </div>
      </div>
      
      <div>
        <label className="label">{l.email}</label>
        <input className="input" name="email" type="email" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div>
          <label className="label">{l.date}</label>
          <input className="input" name="date" type="date" style={{ colorScheme: 'dark' }} />
        </div>
        <div>
          <label className="label">{l.time}</label>
          <select className="input" name="time" style={{ cursor: 'pointer' }}>
            <option value="">--</option>
            {l.times.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">{l.service}</label>
        <select className="input" name="service" style={{ cursor: 'pointer' }}>
          <option value="">--</option>
          {l.services.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="label">{l.message}</label>
        <textarea className="input" name="message" rows={3} style={{ resize: 'vertical' }} />
      </div>

      <button type="submit" className="btn btn-primary" disabled={isPending} style={{ padding: '1rem', fontSize: '0.9rem', opacity: isPending ? 0.6 : 1 }}>
        {isPending ? '...' : l.submit}
      </button>
    </form>
  );
}
