'use client';

import { useState, useTransition } from 'react';
import { StarRating } from './StarRating';
import { submitReview } from '@/app/actions/review';
import { Locale, t } from '@/lib/i18n';

const labels: Record<string, Record<Locale, string>> = {
  title: { ka: 'შეფასების დატოვება', ru: 'Оставить отзыв', en: 'Leave a Review' },
  name: { ka: 'სახელი', ru: 'Имя', en: 'Name' },
  comment: { ka: 'კომენტარი (არასავალდებულო)', ru: 'Комментарий (необязательно)', en: 'Comment (optional)' },
  submit: { ka: 'გაგზავნა', ru: 'Отправить', en: 'Submit' },
  thanks: { ka: 'მადლობა შეფასებისთვის!', ru: 'Спасибо за отзыв!', en: 'Thanks for your review!' },
  select: { ka: 'აირჩიეთ შეფასება', ru: 'Выберите оценку', en: 'Select rating' },
};

export default function ReviewForm({ productId, locale = 'ka' }: { productId: string; locale?: Locale }) {
  const [rating, setRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    startTransition(async () => {
      await submitReview(productId, rating, comment, author);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '12px' }}>
        <span style={{ color: 'var(--brand)', fontSize: '1.5rem' }}>✓</span>
        <p style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>{labels.thanks[locale]}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label className="label">{labels.select[locale]}</label>
        <StarRating rating={rating} size={24} interactive onRate={setRating} />
      </div>
      <div>
        <label className="label">{labels.name[locale]}</label>
        <input className="input" value={author} onChange={e => setAuthor(e.target.value)} placeholder="ანონიმი" />
      </div>
      <div>
        <label className="label">{labels.comment[locale]}</label>
        <textarea className="input" value={comment} onChange={e => setComment(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={isPending || rating === 0} style={{ opacity: (isPending || rating === 0) ? 0.5 : 1 }}>
        {isPending ? '...' : labels.submit[locale]}
      </button>
    </form>
  );
}
