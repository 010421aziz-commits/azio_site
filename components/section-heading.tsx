export function SectionHeading({ eyebrow, title, copy, center = false, light = false }: {
  eyebrow: string; title: string; copy?: string; center?: boolean; light?: boolean;
}) {
  return (
    <div className={`mb-14 ${center ? 'text-center [&_.gold-line]:mx-auto' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl lg:text-5xl ${center ? 'mx-auto' : ''} ${light ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      <div className="gold-line mt-4" />
      {copy && <p className={`mt-5 max-w-2xl text-base leading-7 ${center ? 'mx-auto' : ''} ${light ? 'text-white/60' : 'text-slate-500'}`}>{copy}</p>}
    </div>
  );
}