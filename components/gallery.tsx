'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const fallbackImages = Array.from({ length: 5 }, (_, index) => ({
  id: `academy-gallery-${index + 1}`,
  src: '/images/hero-graduation.png',
}));

export function Gallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const [images, setImages] = useState(fallbackImages);
  useEffect(() => {
    fetch('/api/gallery', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((items) => {
        if (!Array.isArray(items) || items.length === 0) return;
        setImages(items.map((item) => ({ id: item.id, src: item.image })));
      })
      .catch(() => undefined);
  }, []);
  return <>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {images.map(({ id, src }, index) => <button key={id} onClick={() => setSelected(src)} className={`media-frame group rounded-2xl ${index === 0 ? 'media-frame-gallery--featured col-span-2 row-span-2' : 'media-frame-gallery'}`}>
        <Image src={src} alt="Куран Академиянын жашоосу" fill className="media-cover transition duration-500 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
        <span className="absolute inset-0 bg-navy/0 transition group-hover:bg-navy/25" />
      </button>)}
    </div>
    {selected && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-5" onClick={() => setSelected(null)}>
      <button aria-label="Жабуу" className="absolute right-6 top-6 text-white"><X size={32} /></button>
      <Image onClick={(event) => event.stopPropagation()} src={selected} alt="Галерея" width={1400} height={900} className="max-h-[85vh] w-auto rounded-xl object-contain" />
    </div>}
  </>;
}
