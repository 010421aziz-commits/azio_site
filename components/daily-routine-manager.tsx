'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type DailyRoutine = { id: number; time: string; title: string; description?: string | null; order: number };

export function DailyRoutineManager() {
  const [items, setItems] = useState<DailyRoutine[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/daily-routine', { cache: 'no-store' }).then((response) => response.ok ? response.json() : []).then(setItems).catch(() => setError('Расписание жүктөлгөн жок.')); }, []);

  const add = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/daily-routine', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ time: form.get('time'), title: form.get('title'), description: form.get('description') || undefined, order: Number(form.get('order') || items.length) }) });
      if (!response.ok) throw new Error('Unable to create routine item');
      const item = await response.json();
      setItems((value) => [...value, item].sort((left, right) => left.order - right.order || left.time.localeCompare(right.time)));
      event.currentTarget.reset();
    } catch { setError('Пунктту сактоо ишке ашкан жок. Убакытты 08:00 форматында жазыңыз.'); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => {
    if (!confirm('Өчүрүүгө ишенесизби?')) return;
    const response = await fetch(`/api/daily-routine/${id}`, { method: 'DELETE' });
    if (!response.ok) { setError('Өчүрүү ишке ашкан жок.'); return; }
    setItems((value) => value.filter((item) => item.id !== id));
  };

  return <div className="mt-6 grid gap-5">
    <form onSubmit={add} className="grid gap-3 rounded-2xl bg-white p-6 shadow-sm md:grid-cols-[110px_1fr_1fr_100px_auto] md:items-end">
      <label className="grid gap-1 text-sm font-semibold text-navy">Убакыт<input required name="time" type="time" className="rounded-xl border p-3 font-normal" /></label>
      <label className="grid gap-1 text-sm font-semibold text-navy">Аталышы<input required name="title" className="rounded-xl border p-3 font-normal" placeholder="Чай" /></label>
      <label className="grid gap-1 text-sm font-semibold text-navy">Сүрөттөмө<input name="description" className="rounded-xl border p-3 font-normal" placeholder="Кошумча маалымат" /></label>
      <label className="grid gap-1 text-sm font-semibold text-navy">Тартиби<input name="order" type="number" min="0" defaultValue={items.length} className="rounded-xl border p-3 font-normal" /></label>
      <button disabled={saving} className="flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 font-bold text-navy disabled:opacity-50"><Plus size={17} />Кошуу</button>
    </form>
    <div className="grid gap-3">{items.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"><time className="w-16 font-bold text-gold">{item.time}</time><div className="min-w-0 flex-1"><b className="block text-navy">{item.title}</b>{item.description && <p className="mt-1 text-sm text-slate-500">{item.description}</p>}</div><button onClick={() => remove(item.id)} className="text-red-500" aria-label="Өчүрүү"><Trash2 size={18} /></button></article>)}</div>
    {items.length === 0 && <p className="text-sm text-slate-500">Расписание пока пустое.</p>}
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>;
}