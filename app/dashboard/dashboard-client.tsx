'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BookOpen, Image as ImageIcon, Mail, MoonStar, Pencil, Plus, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

type Teacher = { id: string; name: string; position: string; bio?: string | null; image?: string | null; order: number };
type Program = { id: string; title: string; description: string; topics?: string[] };
type GalleryItem = { id: string; image: string; caption?: string | null };
type Message = { id: string; name: string; phone: string; message: string; createdAt: Date };
type SiteSettings = {
  heroLocation: string; heroTitle: string; heroSubtitle: string; heroDescription: string;
  aboutTitle: string; aboutText: string; featuresTitle: string; programsTitle: string;
  teachersTitle: string; galleryTitle: string; contactTitle: string; logo: string;
  aboutImage: string; stats: { value: string; label: string }[];
};
type Data = { teachers: Teacher[]; programs: Program[]; gallery: GalleryItem[]; messages: Message[] };
type Tab = 'overview' | 'teachers' | 'programs' | 'gallery' | 'messages' | 'settings';

const defaultSettings: SiteSettings = {
  heroLocation: 'БИШКЕК · КЫРГЫЗСТАН', heroTitle: 'Куран Академия',
  heroSubtitle: 'Куран жаттоо жана ижаза алуу медресеси',
  heroDescription: 'Куранды туура окууну, жаттоону жана ижаза алуу жолун үйрөтүүчү заманбап медресе.',
  aboutTitle: 'Курандын нуру менен тарбияланган муун',
  aboutText: 'Куран Академия — Куран жаттоо жана ижаза берүү багытындагы медресе.',
  featuresTitle: 'Илим, адеп жана ишеним бир жерде', programsTitle: 'Ар бир кадам үчүн так программа',
  teachersTitle: 'Илимди аманат катары жеткирген устаздар', galleryTitle: 'Галерея',
  contactTitle: 'Сизди Академияда күтөбүз', logo: '', aboutImage: '',
  stats: [{ value: '500+', label: 'Окуучу' }, { value: '10+', label: 'Устаз' }, { value: '5', label: 'Программа' }, { value: '100%', label: 'Берилгендик' }],
};

export function DashboardClient({ data }: { data: Data }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [teachers, setTeachers] = useState(data.teachers);
  const [programs, setPrograms] = useState(data.programs);
  const [gallery, setGallery] = useState(data.gallery);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [editing, setEditing] = useState<Teacher | Program | GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const labels: Record<Tab, string> = { overview: 'Жалпы', teachers: 'Устаздар', programs: 'Программалар', gallery: 'Галерея', messages: 'Кабарлар', settings: 'Настройки сайта' };

  useEffect(() => {
    fetch('/api/site-settings', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((value) => value && setSettings(value)).catch(() => undefined);
  }, []);

  const remove = async (type: 'teachers' | 'programs' | 'gallery', id: string) => {
    if (!confirm('Өчүрүүгө ишенесизби?')) return;
    const response = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
    if (!response.ok) { setError('Өчүрүү ишке ашкан жок.'); return; }
    if (type === 'teachers') setTeachers((items) => items.filter((item) => item.id !== id));
    if (type === 'programs') setPrograms((items) => items.filter((item) => item.id !== id));
    if (type === 'gallery') setGallery((items) => items.filter((item) => item.id !== id));
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      if (tab === 'settings') {
        const stats = [0, 1, 2, 3].map((index) => ({ value: String(form.get(`statValue${index}`) || ''), label: String(form.get(`statLabel${index}`) || '') }));
        const response = await fetch('/api/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          heroLocation: form.get('heroLocation'), heroTitle: form.get('heroTitle'), heroSubtitle: form.get('heroSubtitle'), heroDescription: form.get('heroDescription'),
          aboutTitle: form.get('aboutTitle'), aboutText: form.get('aboutText'), featuresTitle: form.get('featuresTitle'), programsTitle: form.get('programsTitle'),
          teachersTitle: form.get('teachersTitle'), galleryTitle: form.get('galleryTitle'), contactTitle: form.get('contactTitle'), logo: form.get('logo'), aboutImage: form.get('aboutImage'), stats,
        }) });
        if (!response.ok) throw new Error('Тексттерди сактоо ишке ашкан жок.');
        setSettings(await response.json()); return;
      }
      let body: Record<string, unknown>;
      if (tab === 'teachers') body = { name: form.get('name'), position: form.get('position'), bio: form.get('description'), image: String(form.get('image') || '') || undefined, order: Number(form.get('order') || 0) };
      else if (tab === 'programs') body = { title: form.get('name'), description: form.get('description'), icon: 'BookOpen', topics: String(form.get('topics') || '').split(',').map((item) => item.trim()).filter(Boolean) };
      else {
        const image = String(form.get('image') || '');
        if (!image) throw new Error('Укажите URL изображения.');
        body = { image, caption: form.get('caption') };
      }
      const url = editing ? `/api/${tab}/${editing.id}` : `/api/${tab}`;
      const response = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error('Сактоо ишке ашкан жок.');
      const saved = await response.json();
      if (tab === 'teachers') setTeachers((items) => editing ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
      if (tab === 'programs') setPrograms((items) => editing ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
      if (tab === 'gallery') setGallery((items) => editing ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
      setEditing(null); setShowForm(false);
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : 'Сактоо ишке ашкан жок.'); }
    finally { setLoading(false); }
  };

  const list = (tab === 'teachers' ? teachers : tab === 'programs' ? programs : gallery) as Array<Teacher & Program & GalleryItem>;
  const stats = [['Устаздар', teachers.length, Users], ['Программалар', programs.length, BookOpen], ['Галерея', gallery.length, ImageIcon], ['Жаңы кабарлар', data.messages.length, Mail]] as const;
  const field = (name: keyof SiteSettings, label: string, multiline = false) => <label className="grid gap-1 text-sm font-semibold text-navy">{label}{multiline ? <textarea name={name} defaultValue={String(settings[name])} className="rounded-xl border p-3 font-normal" /> : <input type="text" name={name} defaultValue={String(settings[name])} placeholder="https://..." className="rounded-xl border p-3 font-normal" />}</label>;

  return <main className="min-h-screen bg-cream">
    <header className="bg-navy text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-gold"><MoonStar />QURAN ACADEMY</Link><button onClick={() => fetch('/api/logout', { method: 'POST' }).then(() => location.href = '/dashboard/login')} className="text-sm text-white/80">Чыгуу</button></div></header>
    <div className="mx-auto flex max-w-7xl gap-6 px-5 py-8"><aside className="w-48 shrink-0"><nav className="grid gap-2">{(Object.keys(labels) as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === item ? 'bg-navy text-white' : 'text-slate-600 hover:bg-white'}`}>{labels[item]}</button>)}</nav></aside>
      <section className="min-w-0 flex-1"><div className="flex items-center justify-between"><div><p className="eyebrow">Башкаруу панели</p><h1 className="mt-2 text-3xl font-semibold text-navy">{labels[tab]}</h1></div>{['teachers', 'programs', 'gallery'].includes(tab) && <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-navy"><Plus size={17} />Кошуу</button>}</div>
        {tab === 'settings' ? <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm">{field('heroLocation', 'Hero location')}{field('heroTitle', 'Hero title')}{field('heroSubtitle', 'Hero subtitle')}{field('heroDescription', 'Hero description', true)}{field('aboutTitle', 'About title')}{field('aboutText', 'About text', true)}{field('featuresTitle', 'Features title')}{field('programsTitle', 'Programs title')}{field('teachersTitle', 'Teachers title')}{field('galleryTitle', 'Gallery title')}{field('contactTitle', 'Contact title')}{field('logo', 'Логотип — URL изображения')}{field('aboutImage', 'Большое фото блока «О нас» — URL изображения')}{settings.stats.map((stat, index) => <div key={index} className="grid grid-cols-2 gap-3"><input name={`statValue${index}`} defaultValue={stat.value} className="rounded-xl border p-3" placeholder="Статистика" /><input name={`statLabel${index}`} defaultValue={stat.label} className="rounded-xl border p-3" placeholder="Аталышы" /></div>)}<button disabled={loading} className="rounded-xl bg-navy py-3 font-bold text-white">{loading ? 'Сакталууда...' : 'Сохранить настройки'}</button></form> : tab === 'overview' ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, count, Icon]) => <article key={label} className="rounded-2xl bg-white p-5 shadow-sm"><Icon className="text-gold" /><b className="mt-4 block text-2xl text-navy">{count}</b><span className="text-sm text-slate-500">{label}</span></article>)}</div> : tab === 'messages' ? <div className="mt-6 grid gap-4">{data.messages.map((message) => <article key={message.id} className="rounded-2xl bg-white p-5 shadow-sm"><b className="text-navy">{message.name}</b><span className="ml-3 text-sm text-slate-500">{message.phone}</span><p className="mt-2 text-sm text-slate-600">{message.message}</p></article>)}</div> : <div className="mt-6 grid gap-4 md:grid-cols-2">{list.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">{tab !== 'programs' && item.image ? <img src={item.image} alt={tab === 'teachers' ? item.name : item.caption || 'Галерея'} className="h-14 w-14 rounded-xl object-cover" /> : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-cream text-gold">{tab === 'gallery' ? <ImageIcon /> : tab === 'teachers' ? <Users /> : <BookOpen />}</div>}<div className="min-w-0 flex-1"><b className="block truncate text-navy">{tab === 'teachers' ? item.name : tab === 'programs' ? item.title : item.caption || item.image}</b><p className="truncate text-sm text-slate-500">{tab === 'teachers' ? item.position : tab === 'programs' ? item.description : item.image}</p>{tab === 'teachers' && item.bio && <p className="mt-1 truncate text-xs text-slate-400">{item.bio}</p>}</div><button onClick={() => { setEditing(item); setShowForm(true); }} className="text-navy" aria-label="Редактировать"><Pencil size={18} /></button><button onClick={() => remove(tab, item.id)} className="text-red-500" aria-label="Удалить"><Trash2 size={18} /></button></article>)}</div>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </section>
    </div>
    {showForm && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-5"><form onSubmit={save} className="w-full max-w-md rounded-3xl bg-white p-7"><h2 className="text-xl font-semibold text-navy">{editing ? 'Редактировать' : 'Новый элемент'}</h2>{tab === 'gallery' && <input name="caption" defaultValue={(editing as GalleryItem)?.caption || ''} placeholder="Название изображения" className="mt-5 w-full rounded-xl border p-3" />}{tab !== 'gallery' && <><input required name="name" defaultValue={tab === 'teachers' ? (editing as Teacher)?.name || '' : (editing as Program)?.title || ''} placeholder={tab === 'programs' ? 'Название программы' : 'Имя учителя'} className="mt-5 w-full rounded-xl border p-3" />{tab === 'teachers' && <><input required name="position" defaultValue={(editing as Teacher)?.position || ''} placeholder="Должность" className="mt-3 w-full rounded-xl border p-3" /><input required type="number" name="order" min="1" step="1" defaultValue={(editing as Teacher)?.order || 1} placeholder="Порядковый номер" className="mt-3 w-full rounded-xl border p-3" /></>}<textarea required={tab === 'programs'} name="description" defaultValue={tab === 'teachers' ? (editing as Teacher)?.bio || '' : (editing as Program)?.description || ''} placeholder="Описание" className="mt-3 w-full rounded-xl border p-3" /></>}{tab === 'programs' && <input name="topics" defaultValue={(editing as Program)?.topics?.join(', ') || ''} placeholder="Темы через запятую" className="mt-3 w-full rounded-xl border p-3" />}{tab !== 'programs' && <input type="text" name="image" defaultValue={tab === 'teachers' ? (editing as Teacher)?.image || '' : (editing as GalleryItem)?.image || ''} placeholder="https://..." required={tab === 'gallery'} className="mt-3 w-full rounded-xl border p-3" />}<div className="mt-5 flex gap-3"><button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="flex-1 rounded-xl border py-3">Отмена</button><button disabled={loading} className="flex-1 rounded-xl bg-navy py-3 font-bold text-white">{loading ? 'Сохранение...' : 'Сохранить'}</button></div></form></div>}
  </main>;
}
