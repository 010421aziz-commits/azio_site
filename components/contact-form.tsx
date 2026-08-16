'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/validators';
import { z } from 'zod';

type Form = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<'idle'|'success'|'error'>('idle');
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<Form>({ resolver: zodResolver(contactSchema) });

  const submit = async (data: Form) => {
    setStatus('idle');
    try {
      const r = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
      if (!r.ok) console.error('[contact form] API request failed', { status: r.status, response: await r.clone().json().catch(() => null) });
      if (r.ok) { setStatus('success'); reset(); } else { setStatus('error'); }
    } catch (error) { console.error('[contact form] network error', error); setStatus('error'); }
  };

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20';

  return (
    <form onSubmit={handleSubmit(submit)} className="rounded-3xl bg-white border border-gold/15 p-7 shadow-luxury">
      <h3 className="text-xl font-bold text-navy">Бизге жазыңыз</h3>
      <p className="mt-1 text-sm text-slate-400">Суроолоруңузга жооп беребиз</p>

      {status === 'success' && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          ✅ Кабарыңыз жөнөтүлдү. Жакында байланышабыз!
        </div>
      )}
      {status === 'error' && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          ❌ Ката кетти. Кайра аракет кылыңыз же WhatsApp аркылуу жазыңыз.
        </div>
      )}

      <div className="mt-6 grid gap-3">
        <div>
          <input className={input} placeholder="Аты-жөнүңүз" {...register('name')} />
          {errors.name && <small className="mt-1 block text-xs text-red-500">{errors.name.message}</small>}
        </div>
        <div>
          <input className={input} placeholder="Телефон номериңиз" {...register('phone')} />
          {errors.phone && <small className="mt-1 block text-xs text-red-500">{errors.phone.message}</small>}
        </div>
        <input className={input} placeholder="Email (милдеттүү эмес)" {...register('email')} />
        <div>
          <textarea className={input} rows={4} placeholder="Сурооңуз" {...register('message')} />
          {errors.message && <small className="mt-1 block text-xs text-red-500">{errors.message.message}</small>}
        </div>
      </div>

      <button disabled={isSubmitting} className="mt-5 w-full rounded-xl bg-navy py-3.5 text-sm font-bold text-white hover:bg-navy/80 disabled:opacity-50 transition-colors duration-300">
        {isSubmitting ? 'Жөнөтүлүүдө...' : 'Кабар жөнөтүү'}
      </button>
    </form>
  );
}