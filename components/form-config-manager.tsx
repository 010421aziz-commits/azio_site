'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

type FormField = { id: string; label: string; name: string; type: 'text' | 'phone' | 'email' | 'textarea'; required: boolean; order: number };
type FormConfig = { title: string; subtitle: string; buttonText: string; successMessage: string; fields: FormField[] };

const emptyConfig: FormConfig = { title: 'Бизге жазыңыз', subtitle: 'Суроолоруңузга жооп беребиз', buttonText: 'Кабар жөнөтүү', successMessage: 'Кабарыңыз жөнөтүлдү. Жакында байланышабыз!', fields: [] };

export function FormConfigManager() {
  const [config, setConfig] = useState<FormConfig>(emptyConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/form-config', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((value) => value && setConfig(value))
      .catch(() => setError('Форманын жөндөөлөрү жүктөлгөн жок.'))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (index: number, patch: Partial<FormField>) => setConfig((value) => ({ ...value, fields: value.fields.map((field, fieldIndex) => fieldIndex === index ? { ...field, ...patch } : field) }));
  const addField = () => setConfig((value) => ({ ...value, fields: [...value.fields, { id: crypto.randomUUID(), label: 'Жаңы талаа', name: `field_${value.fields.length + 1}`, type: 'text', required: false, order: value.fields.length }] }));
  const removeField = (index: number) => setConfig((value) => ({ ...value, fields: value.fields.filter((_, fieldIndex) => fieldIndex !== index).map((field, fieldIndex) => ({ ...field, order: fieldIndex })) }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const response = await fetch('/api/form-config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...config, fields: config.fields.map(({ label, name, type, required }, order) => ({ label, name, type, required, order })) }) });
      if (!response.ok) throw new Error('Unable to save form configuration');
      setConfig(await response.json());
    } catch {
      setError('Форманын жөндөөлөрүн сактоо ишке ашкан жок. Ар бир талаанын ачкычы уникалдуу болушу керек.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="mt-6 text-sm text-slate-500">Жүктөлүүдө...</p>;

  return <form onSubmit={save} className="mt-6 grid gap-5 rounded-2xl bg-white p-6 shadow-sm">
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-semibold text-navy">Заголовок<input value={config.title} onChange={(event) => setConfig((value) => ({ ...value, title: event.target.value }))} className="rounded-xl border p-3 font-normal" /></label>
      <label className="grid gap-1 text-sm font-semibold text-navy">Подзаголовок<input value={config.subtitle} onChange={(event) => setConfig((value) => ({ ...value, subtitle: event.target.value }))} className="rounded-xl border p-3 font-normal" /></label>
      <label className="grid gap-1 text-sm font-semibold text-navy">Текст кнопки<input value={config.buttonText} onChange={(event) => setConfig((value) => ({ ...value, buttonText: event.target.value }))} className="rounded-xl border p-3 font-normal" /></label>
      <label className="grid gap-1 text-sm font-semibold text-navy">Сообщение об успехе<input value={config.successMessage} onChange={(event) => setConfig((value) => ({ ...value, successMessage: event.target.value }))} className="rounded-xl border p-3 font-normal" /></label>
    </div>
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-navy">Поля формы</h2><button type="button" onClick={addField} className="flex items-center gap-2 rounded-xl bg-gold px-3 py-2 text-sm font-bold text-navy"><Plus size={16} />Добавить поле</button></div>
    <div className="grid gap-3">
      {config.fields.map((field, index) => <div key={field.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_1fr_130px_auto_auto] md:items-center">
        <input value={field.label} onChange={(event) => updateField(index, { label: event.target.value })} placeholder="Название поля" className="rounded-xl border p-3 text-sm" />
        <input value={field.name} onChange={(event) => updateField(index, { name: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })} placeholder="field_name" className="rounded-xl border p-3 text-sm" />
        <select value={field.type} onChange={(event) => updateField(index, { type: event.target.value as FormField['type'] })} className="rounded-xl border p-3 text-sm"><option value="text">Текст</option><option value="phone">Телефон</option><option value="email">Email</option><option value="textarea">Большой текст</option></select>
        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" checked={field.required} onChange={(event) => updateField(index, { required: event.target.checked })} />Обязательное</label>
        <button type="button" disabled={config.fields.length === 1} onClick={() => removeField(index)} className="justify-self-start text-red-500 disabled:opacity-40" aria-label="Удалить поле"><Trash2 size={18} /></button>
      </div>)}
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
    <button disabled={saving} className="rounded-xl bg-navy py-3 font-bold text-white disabled:opacity-50">{saving ? 'Сакталууда...' : 'Сохранить форму'}</button>
  </form>;
}