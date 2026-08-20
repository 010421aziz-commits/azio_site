'use client';

import { FormEvent, useEffect, useState } from 'react';

type FormField = { id: string; label: string; name: string; type: 'text' | 'phone' | 'email' | 'textarea'; required: boolean; order: number };
type FormConfig = { title: string; subtitle: string; buttonText: string; successMessage: string; fields: FormField[] };

const fallbackConfig: FormConfig = {
  title: 'Бизге жазыңыз', subtitle: 'Суроолоруңузга жооп беребиз', buttonText: 'Кабар жөнөтүү', successMessage: 'Кабарыңыз жөнөтүлдү. Жакында байланышабыз!', fields: [],
};

export function ContactForm() {
  const [config, setConfig] = useState<FormConfig>(fallbackConfig);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/form-config', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((value) => value && setConfig(value))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const field of config.fields) {
      const value = answers[field.name]?.trim() || '';
      if (field.required && !value) nextErrors[field.name] = 'Бул талаа милдеттүү.';
      if (field.type === 'email' && value && !/^\S+@\S+\.\S+$/.test(value)) nextErrors[field.name] = 'Email туура эмес.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true); setStatus('idle');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }) });
      if (!response.ok) throw new Error('Unable to submit contact form');
      setStatus('success'); setAnswers({});
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const input = 'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20';

  return (
    <form onSubmit={submit} className="rounded-3xl border border-gold/15 bg-white p-7 shadow-luxury">
      <h3 className="text-xl font-bold text-navy">{config.title}</h3>
      <p className="mt-1 text-sm text-slate-400">{config.subtitle}</p>
      {status === 'success' && <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{config.successMessage}</div>}
      {status === 'error' && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">Ката кетти. Кайра аракет кылыңыз же WhatsApp аркылуу жазыңыз.</div>}
      <div className="mt-6 grid gap-3">
        {!loading && config.fields.map((field) => <div key={field.id}>
          {field.type === 'textarea' ? <textarea rows={4} className={input} placeholder={field.label} required={field.required} value={answers[field.name] || ''} onChange={(event) => setAnswers((value) => ({ ...value, [field.name]: event.target.value }))} /> : <input type={field.type === 'phone' ? 'tel' : field.type} className={input} placeholder={field.label} required={field.required} value={answers[field.name] || ''} onChange={(event) => setAnswers((value) => ({ ...value, [field.name]: event.target.value }))} />}
          {errors[field.name] && <small className="mt-1 block text-xs text-red-500">{errors[field.name]}</small>}
        </div>)}
      </div>
      <button disabled={submitting || loading || config.fields.length === 0} className="mt-5 w-full rounded-xl bg-navy py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-navy/80 disabled:opacity-50">
        {submitting ? 'Жөнөтүлүүдө...' : config.buttonText}
      </button>
    </form>
  );
}