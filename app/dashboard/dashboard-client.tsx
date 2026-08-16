'use client';

import { FormEvent, useEffect, useState } from 'react';
import { BookOpen, Image as ImageIcon, LogOut, Mail, MoonStar, Plus, Pencil, Trash2, Users } from 'lucide-react';
import Link from 'next/link';

type Teacher = { id: string; name: string; position: string; bio?: string | null; image?: string | null; active?: boolean };
type Program = { id: string; title: string; description: string; topics?: string[] };
type GalleryItem = { id: string; image: string; caption?: string | null };
type Message = { id: string; name: string; phone: string; message: string; createdAt: Date };
type SiteSettings = { heroLocation: string; heroTitle: string; heroSubtitle: string; heroDescription: string; aboutTitle: string; aboutText: string; featuresTitle: string; programsTitle: string; teachersTitle: string; galleryTitle: string; contactTitle: string; logo: string; aboutImage: string; stats: { value: string; label: string }[] };
const defaultSiteSettings: SiteSettings = { heroLocation: 'БИШКЕК · КЫРГЫЗСТАН', heroTitle: 'Куран Академия', heroSubtitle: 'Куран жаттоо жана ижаза алуу медресеси', heroDescription: 'Куранды туура окууну, жаттоону жана ижаза алуу жолун үйрөтүүчү заманбап медресе.', aboutTitle: 'Курандын нуру менен тарбияланган муун', aboutText: 'Куран Академия — Куран жаттоо жана ижаза берүү багытындагы медресе.', featuresTitle: 'Илим, адеп жана ишеним бир жерде', programsTitle: 'Ар бир кадам үчүн так программа', teachersTitle: 'Илимди аманат катары жеткирген устаздар', galleryTitle: 'Галерея', contactTitle: 'Сизди Академияда күтөбүз', logo: '/images/logo.png', aboutImage: '/images/hero-graduation.png', stats: [{ value: '500+', label: 'Окуучу' }, { value: '10+', label: 'Устаз' }, { value: '5', label: 'Программа' }, { value: '100%', label: 'Берилгендик' }] };
type Data = { teachers: Teacher[]; programs: Program[]; gallery: GalleryItem[]; messages: Message[] };
type Tab = 'overview' | 'teachers' | 'programs' | 'gallery' | 'messages' | 'settings';

export function DashboardClient({ data }: { data: Data }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [teachers, setTeachers] = useState(data.teachers);
  const [programs, setPrograms] = useState(data.programs);
  const [gallery, setGallery] = useState(data.gallery);
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Teacher | Program | GalleryItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const labels: Record<Tab, string> = { overview: 'Жалпы', teachers: 'Устаздар', programs: 'Программалар', gallery: 'Галерея', messages: 'Кабарлар', settings: 'Настройки сайта' };

  useEffect(() => { fetch('/api/site-settings', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((value) => value && setSettings(value)).catch(() => undefined); }, []);

  const remove = async (type: 'teachers' | 'programs' | 'gallery', id: string) => {
    if (!confirm('Өчүрүүгө ишенесизби?')) return;
    const response = await fetch(`/api/${type}/${id}`, { method: 'DELETE' });
    if (!response.ok) { setError('Өчүрүү ишке ашкан жок.'); return; }
    if (type === 'teachers') setTeachers((items) => items.filter((item) => item.id !== id));
    if (type === 'programs') setPrograms((items) => items.filter((item) => item.id !== id));
    if (type === 'gallery') setGallery((items) => items.filter((item) => item.id !== id));
  };

  const openCreate = () => { setError(''); setEditingItem(null); setShowForm(true); };
  const openEdit = (item: Teacher | Program | GalleryItem) => { setError(''); setEditingItem(item); setShowForm(true); };

  const uploadSelectedFile = async (form: FormData, fileField: string, urlField: string, formElement: HTMLFormElement) => {
    const file = form.get(fileField);
    if (!(file instanceof File) || file.size === 0) return String(form.get(urlField) || '');
    const upload = new FormData();
    upload.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: upload });
    if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || 'Не удалось загрузить изображение');
    const result = await response.json() as { url?: string };
    if (!result.url) throw new Error('Сервер не вернул URL изображения');
    const urlInput = formElement.elements.namedItem(urlField);
    if (urlInput instanceof HTMLInputElement) urlInput.value = result.url;
    return result.url;
  };

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const form = new FormData(event.currentTarget);
    const type = tab;
    try {
    if (type === 'settings') {
      const logo = await uploadSelectedFile(form, 'logoFile', 'logo', event.currentTarget);
      const aboutImage = await uploadSelectedFile(form, 'aboutImageFile', 'aboutImage', event.currentTarget);
      const stats = [0, 1, 2, 3].map((index) => ({ value: String(form.get(`statValue${index}`) || ''), label: String(form.get(`statLabel${index}`) || '') }));
      const response = await fetch('/api/site-settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ heroLocation: form.get('heroLocation'), heroTitle: form.get('heroTitle'), heroSubtitle: form.get('heroSubtitle'), heroDescription: form.get('heroDescription'), aboutTitle: form.get('aboutTitle'), aboutText: form.get('aboutText'), featuresTitle: form.get('featuresTitle'), programsTitle: form.get('programsTitle'), teachersTitle: form.get('teachersTitle'), galleryTitle: form.get('galleryTitle'), contactTitle: form.get('contactTitle'), logo, aboutImage, stats }) });
      if (!response.ok) throw new Error('Тексттерди сактоо ишке ашкан жок.');
      setSettings(await response.json()); return;
    }
    let body: Record<string, unknown>;
    if (type === 'teachers') body = { name: form.get('name'), position: form.get('position'), bio: form.get('description'), image: await uploadSelectedFile(form, 'imageFile', 'image', event.currentTarget) || undefined };
    else if (type === 'programs') body = { title: form.get('name'), description: form.get('description'), icon: 'BookOpen', topics: String(form.get('topics') || '').split(',').map((item) => item.trim()).filter(Boolean) };
    else {
      const image = await uploadSelectedFile(form, 'imageFile', 'image', event.currentTarget);
      if (!image) throw new Error('Выберите файл или укажите URL изображения.');
      body = { image, caption: form.get('caption') };
    }
    const url = editingItem ? `/api/${type}/${editingItem.id}` : `/api/${type}`;
    const response = await fetch(url, { method: editingItem ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error('Сактоо ишке ашкан жок.');
    const saved = await response.json();
    if (type === 'teachers') setTeachers((items) => editingItem ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
    if (type === 'programs') setPrograms((items) => editingItem ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
    if (type === 'gallery') setGallery((items) => editingItem ? items.map((item) => item.id === saved.id ? saved : item) : [...items, saved]);
    setEditingItem(null);
    setShowForm(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Сактоо ишке ашкан жок.');
    }
    setLoading(false);
  };

  const list = (tab === 'teachers' ? teachers : tab === 'programs' ? programs : gallery) as Array<Teacher & Program & GalleryItem>;
  const stats = [['Устаздар', teachers.length, Users], ['Программалар', programs.length, BookOpen], ['Галерея', gallery.length, ImageIcon], ['Жаңы кабарлар', data.messages.length, Mail]] as const;

  return <main className="min-h-screen bg-cream">
    <header className="bg-navy text-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"><Link href="/" className="flex items-center gap-2 font-bold tracking-widest text-gold"><MoonStar />QURAN ACADEMY</Link><button onClick={() => fetch('/api/logout', { method: 'POST' }).then(() => location.href = '/dashboard/login')} className="text-sm text-white/80">Чыгуу</button></div></header>
    <div className="mx-auto flex max-w-7xl gap-6 px-5 py-8"><aside className="w-48 shrink-0"><nav className="grid gap-2">{(Object.keys(labels) as Tab[]).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === item ? 'bg-navy text-white' : 'text-slate-600 hover:bg-white'}`}>{labels[item]}</button>)}</nav></aside>
      <section className="min-w-0 flex-1"><div className="flex items-center justify-between"><div><p className="eyebrow">Башкаруу панели</p><h1 className="mt-2 text-3xl font-semibold text-navy">{labels[tab]}</h1></div>{['teachers', 'programs', 'gallery'].includes(tab) && <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-navy"><Plus size={17} />Кошуу</button>}</div>
        {tab === 'settings' ? <form onSubmit={save} className="mt-6 grid gap-4 rounded-2xl bg-white p-6 shadow-sm">{Object.entries({ heroLocation: 'Hero location', heroTitle: 'Hero title', heroSubtitle: 'Hero subtitle', heroDescription: 'Hero description', aboutTitle: 'About title', aboutText: 'About text', featuresTitle: 'Features title', programsTitle: 'Programs title', teachersTitle: 'Teachers title', galleryTitle: 'Gallery title', contactTitle: 'Contact title', logo: 'Логотип URL', aboutImage: 'Большое фото блока «О нас»' }).map(([name, label]) => <label key={name} className="grid gap-1 text-sm font-semibold text-navy">{label}{name === 'aboutText' || name === 'heroDescription' ? <textarea name={name} defaultValue={settings[name as keyof SiteSettings] as string} className="rounded-xl border p-3 font-normal" /> : <input name={name} defaultValue={settings[name as keyof SiteSettings] as string} className="rounded-xl border p-3 font-normal" />}{(name === 'logo' || name === 'aboutImage') && <input type="file" name={`${name}File`} accept="image/jpeg,image/png,image/webp,image/avif" className="rounded-xl border p-2 text-sm font-normal" />}</label>)}{settings.stats.map((stat, index) => <div key={index} className="grid grid-cols-2 gap-3"><input name={`statValue${index}`} defaultValue={stat.value} className="rounded-xl border p-3" placeholder="Статистика" /><input name={`statLabel${index}`} defaultValue={stat.label} className="rounded-xl border p-3" placeholder="Аталышы" /></div>)}<button disabled={loading} className="rounded-xl bg-navy py-3 font-bold text-white">{loading ? 'Сакталууда...' : 'Сохранить настройки'}</button></form> : tab === 'overview' ?
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, count, Icon]) => <article key={label} className="rounded-2xl bg-white p-5 shadow-sm"><Icon className="text-gold" /><b className="mt-4 block text-2xl text-navy">{count}</b><span className="text-sm text-slate-500">{label}</span></article>)}</div> : tab === 'messages' ? <div className="mt-6 grid gap-4">{data.messages.map((message) => <article key={message.id} className="rounded-2xl bg-white p-5 shadow-sm"><b className="text-navy">{message.name}</b><span className="ml-3 text-sm text-slate-500">{message.phone}</span><p className="mt-2 text-sm text-slate-600">{message.message}</p></article>)}</div> : <div className="mt-6 grid gap-4 md:grid-cols-2">{list.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">{tab !== 'programs' && item.image ? <img src={item.image} alt={tab === 'teachers' ? item.name : item.caption || 'Галерея'} className="h-14 w-14 rounded-xl object-cover" /> : <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-cream text-gold">{tab === 'gallery' ? <ImageIcon /> : tab === 'teachers' ? <Users /> : <BookOpen />}</div>}<div className="min-w-0 flex-1"><b className="block truncate text-navy">{tab === 'teachers' ? item.name : tab === 'programs' ? item.title : item.caption || item.image}</b><p className="truncate text-sm text-slate-500">{tab === 'teachers' ? item.position : tab === 'programs' ? item.description : item.image}</p>{tab === 'teachers' && item.bio && <p className="mt-1 truncate text-xs text-slate-400">{item.bio}</p>}</div><button onClick={() => openEdit(item)} className="text-navy" aria-label="Редактировать"><Pencil size={18} /></button><button onClick={() => remove(tab, item.id)} className="text-red-500" aria-label="Удалить"><Trash2 size={18} /></button></article>)}</div>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </section>
    </div>
    {showForm && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-5"><form onSubmit={save} className="w-full max-w-md rounded-3xl bg-white p-7"><h2 className="text-xl font-semibold text-navy">{editingItem ? 'Редактировать' : 'Жаңы элемент'}</h2>{tab === 'gallery' && <input name="caption" defaultValue={(editingItem as GalleryItem)?.caption || ''} placeholder="Название изображения" className="mt-5 w-full rounded-xl border p-3" />}{tab !== 'gallery' && <><input required name="name" defaultValue={tab === 'teachers' ? (editingItem as Teacher)?.name || '' : (editingItem as Program)?.title || ''} placeholder={tab === 'programs' ? 'Программанын аты' : 'Аты-жөнү'} className="mt-5 w-full rounded-xl border p-3" />{tab === 'teachers' && <input required name="position" defaultValue={(editingItem as Teacher)?.position || ''} placeholder="Кызматы" className="mt-3 w-full rounded-xl border p-3" />}<textarea required={tab === 'programs'} name="description" defaultValue={tab === 'teachers' ? (editingItem as Teacher)?.bio || '' : (editingItem as Program)?.description || ''} placeholder="Сүрөттөмө" className="mt-3 w-full rounded-xl border p-3" /></>}{tab === 'programs' && <input name="topics" defaultValue={(editingItem as Program)?.topics?.join(', ') || ''} placeholder="Темалар: үтүр менен" className="mt-3 w-full rounded-xl border p-3" />}{tab !== 'programs' && <input name="image" defaultValue={tab === 'teachers' ? (editingItem as Teacher)?.image || '' : (editingItem as GalleryItem)?.image || ''} placeholder="Сүрөт URL /uploads/image.jpg" />}{tab !== 'programs' && <input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-3 w-full rounded-xl border p-2 text-sm" />}<div className="mt-5 flex gap-3"><button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="flex-1 rounded-xl border py-3">Жокко чыгаруу</button><button disabled={loading} className="flex-1 rounded-xl bg-navy py-3 font-bold text-white">{loading ? 'Сакталууда...' : 'Сактоо'}</button></div></form></div>}
  </main>;
}
