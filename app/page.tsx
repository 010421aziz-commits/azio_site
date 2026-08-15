'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, ArrowUpRight, BookOpen, Check, ChevronRight, Instagram, Landmark, Languages, MapPin, MessageCircle, MoonStar, Phone, ScrollText, ShieldCheck, Sparkles, Users, type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { SectionHeading } from '@/components/section-heading';
import { Gallery } from '@/components/gallery';
import { ContactForm } from '@/components/contact-form';
import { IslamicStars } from '@/components/islamic-stars';

const reveal      = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } };
const revealLeft  = { initial: { opacity: 0, x: -40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } };
const revealRight = { initial: { opacity: 0, x: 40 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } };

const features: { title: string; icon: LucideIcon }[] = [
  { title: 'Куран жаттоо', icon: BookOpen }, { title: 'Ижаза алуу', icon: ScrollText },
  { title: 'Тажвид', icon: Sparkles }, { title: 'Араб тили', icon: Languages },
  { title: 'Англис тили', icon: MessageCircle }, { title: 'Диний сабактар', icon: Landmark },
  { title: 'Тажрыйбалуу устаздар', icon: Users }, { title: 'Ыйман жана тарбия', icon: ShieldCheck },
];
const programs: { title: string; description: string; topics: string[]; icon: LucideIcon }[] = [
  { title: 'Куран жаттоо', description: 'Толук Куран жаттоо программасы.', topics: ['Толук жаттоо','Кайталоо','Тажвид'], icon: BookOpen },
  { title: 'Ижаза', description: 'Куранды санад менен окуу.', topics: ['Санад','Кыраат','Устаздык көзөмөл'], icon: ScrollText },
  { title: 'Араб тили', description: 'Куран тилин түшүнүүгө багытталган терең курс.', topics: ['Нахв','Сарф','Окуу','Жазуу','Сүйлөө'], icon: Languages },
  { title: 'Англис тили', description: 'Заманбап англис тилинин практикалык программасы.', topics: ['Grammar','Speaking','Reading','Listening'], icon: MessageCircle },
  { title: 'Диний сабактар', description: 'Негизги ислам илимдери.', topics: ['Фикх','Акыда','Хадис','Сира','Тафсир'], icon: Landmark },
];
const teachers = [
  { name: 'Насрулло каары', position: 'Медресенин мудуру', description: 'Окуу менен тарбияны айкалыштырган академиялык багыт.', image: '/images/mudur.jpeg', pos: 'center center' },
  { name: 'Абдулазиз каары', position: 'Устаз', description: 'Ижазасы бар устаз. Куран жаттоо жана тажвид сабактарын окутат.', image: '/images/ustaz2.jpeg', pos: 'center 35%' },
];

export default function Home() {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => { const s = () => setShowTop(window.scrollY > 500); window.addEventListener('scroll', s); return () => window.removeEventListener('scroll', s); }, []);

  return (
    <main id="top" style={{ position: 'relative' }}>
      <IslamicStars />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen overflow-hidden">
        <motion.div initial={{ scale: 1.08, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.8 }} className="absolute inset-0">
          <Image src="/images/home.jpeg" alt="Куран Академия" fill priority className="object-cover" sizes="100vw" />
        </motion.div>
        {/* тень */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,27,53,0.72) 0%, rgba(15,27,53,0.45) 55%, rgba(15,27,53,0.08) 100%)' }} />
        {/* исламский узор */}
        <div className="absolute inset-0 islamic-pattern opacity-40" />
        {/* декоративные кольца */}
        <div className="absolute right-[8%] top-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full border border-gold/15 hidden lg:block" />
        <div className="absolute right-[11%] top-1/2 -translate-y-1/2 h-[340px] w-[340px] rounded-full border border-gold/20 hidden lg:block" />
        <div className="absolute right-[14%] top-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full" style={{ background: 'rgba(212,175,55,0.07)' }} />

        <div className="container-x relative z-10 flex min-h-screen items-center pt-14 pb-16">
          <motion.div {...reveal} className="max-w-2xl w-full">
            <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-gold/40 px-4 py-1.5 text-[11px] font-bold tracking-[.22em] text-gold uppercase"
              style={{ background: 'rgba(212,175,55,0.1)' }}>
              <span className="h-1 w-1 rounded-full bg-gold" />БИШКЕК · КЫРГЫЗСТАН
            </motion.p>
            <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
              className="text-3xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl">
              Куран<br />
              <span style={{ background:'linear-gradient(135deg,#D4AF37 0%,#f5d875 50%,#D4AF37 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Академия</span>
            </motion.h1>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }} className="mt-6 text-lg font-medium text-white/80 sm:text-xl">
              Куран жаттоо жана ижаза алуу медресеси
            </motion.p>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }} className="mt-4 max-w-xl text-base leading-8 text-white/60">
              Куранды туура окууну, жаттоону жана ижаза алуу жолун үйрөтүүчү заманбап медресе.
            </motion.p>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.65 }} className="mt-10 flex flex-wrap gap-3">
              <a href="#about" className="rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-dark hover:bg-yellow-400 transition-colors duration-300">Биз жөнүндө</a>
              <a href="#programs" className="rounded-xl border border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors duration-300" style={{ background:'rgba(255,255,255,0.08)' }}>Программалар</a>
              <a href="#contact" className="flex items-center gap-1.5 rounded-xl px-5 py-3.5 text-sm font-bold text-gold/90 hover:text-gold transition-colors">Байланыш <ChevronRight size={15}/></a>
            </motion.div>
          </motion.div>
        </div>
        <a href="#features" aria-label="Төмөн" className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-gold transition-colors">
          <ArrowDown size={16} className="animate-bounce" />
        </a>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="section bg-cream-2">
        <div className="container-x">
          <SectionHeading center eyebrow="Ар тараптуу билим" title="Илим, адеп жана ишеним бир жерде" copy="Ар бир сабак окуучунун Куранга болгон байланышын бекемдеп, келечегине жол ачат." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, icon: Icon }, i) => (
              <motion.div key={title} {...reveal} transition={{ ...reveal.transition, delay: i*0.07 }}
                className="card-light group rounded-2xl p-6 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy/8 text-navy group-hover:bg-gold/15 group-hover:text-gold transition-colors" style={{ background:'rgba(15,59,120,0.07)' }}>
                  <Icon size={20}/>
                </div>
                <h3 className="mt-5 font-semibold text-navy">{title}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                  <Check size={12} className="text-gold shrink-0"/>Терең жана сапаттуу окутуу
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section bg-cream">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <motion.div key="about-image" {...revealLeft} className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-50" style={{ background:'radial-gradient(ellipse, rgba(212,175,55,0.15), transparent 70%)' }} />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-luxury border border-gold/10">
              <Image src="/images/hero-graduation.png" alt="Куран Академия" fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
              <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(15,27,53,0.5) 0%, transparent 50%)' }} />
            </div>
            <div className="absolute -bottom-5 -right-5 rounded-2xl border border-gold/30 bg-white px-5 py-4 shadow-gold">
              <p className="text-2xl font-extrabold text-gold">10+</p>
              <p className="text-xs text-slate-500 mt-0.5">Жыл тажрыйба</p>
            </div>
          </motion.div>
          <motion.div key="about-text" {...revealRight}>
            <SectionHeading eyebrow="Биз жөнүндө" title="Курандын нуру менен тарбияланган муун" />
            <div className="prose-academy space-y-5">
              <p>Куран Академия — Куран жаттоо жана ижаза берүү багытындагы медресе.</p>
              <p>Максатыбыз — Куранды туура окуган, жаттаган, адеп-ахлакка тарбияланган жана пайдалуу илимге ээ болгон муунду тарбиялоо.</p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[['500+','Окуучу'],['10+','Устаз'],['5','Программа'],['100%','Берилгендик']].map(([num,label]) => (
                <div key={label} className="rounded-2xl border border-gold/20 bg-white px-5 py-4 shadow-card">
                  <p className="text-2xl font-extrabold text-gold">{num}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROGRAMS ── */}
      <section id="programs" className="section bg-cream">
        <div className="container-x">
          <SectionHeading center eyebrow="Окуу багыттары" title="Ар бир кадам үчүн так программа" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map(({ title, description, topics, icon: Icon }, index) => (
              <motion.article key={title} {...reveal} transition={{ ...reveal.transition, delay: index*0.08 }}
                className="card-light group relative overflow-hidden rounded-3xl p-7 transition-all duration-300">
                <div className="absolute top-0 right-0 h-28 w-28 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background:'rgba(212,175,55,0.07)' }} />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-navy" style={{ background:'rgba(15,59,120,0.08)' }}>
                      <Icon size={22}/>
                    </div>
                    <span className="text-3xl font-extrabold text-slate-100">{String(index+1).padStart(2,'0')}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-navy">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {topics.map(t => (
                      <li key={`${title}-${t}`} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-slate-600" style={{ background:'rgba(212,175,55,0.07)' }}>{t}</li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEACHERS ── */}
      <section id="teachers" className="section bg-cream-2">
        
        <div className="container-x relative z-10">
          <SectionHeading center eyebrow="Устаздар" title="Илимди аманат катары жеткирген устаздар" />
          <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
            {teachers.map(teacher => (
              <motion.article key={teacher.name} {...reveal} className="overflow-hidden rounded-3xl border border-gold/20 bg-white shadow-card hover:border-gold/50 hover:shadow-gold transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <Image src={teacher.image} alt={teacher.name} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit:'cover', objectPosition:teacher.pos }} />
                  <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(15,27,53,0.65) 0%, rgba(15,27,53,0.15) 55%, transparent 100%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-gold drop-shadow-sm">{teacher.position}</p>
                    <h3 className="mt-1 text-xl font-bold text-white">{teacher.name}</h3>
                  </div>
                </div>
                <div className="p-6 border-t border-gold/10">
                  <p className="text-sm leading-7 text-slate-700">{teacher.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" className="section bg-cream">
        <div className="container-x">
          <SectionHeading center eyebrow="Академиянын жашоосу" title="Галерея" copy="Илим жолундагы күндөрдөн ирмемдер." />
          <Gallery />
        </div>
      </section>

            {/* ── CONTACT ── */}
      <section id="contact" className="section bg-cream-light">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <motion.div {...revealLeft}>
            <ContactForm />
          </motion.div>
          <motion.div {...revealRight}>
            <SectionHeading eyebrow="Байланыш" title="Сизди Академияда күтөбүз" />
            <div className="space-y-3">
              <a href="https://go.2gis.com/WW0vm" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-white border border-gold/15 p-4 shadow-card hover:border-gold/40 hover:shadow-gold transition-all group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-navy" style={{ background:'rgba(15,59,120,0.08)' }}>
                  <MapPin size={18}/>
                </div>
                <span className="flex-1 min-w-0">
                  <b className="block text-sm font-semibold text-navy">Дарек</b>
                  <span className="mt-0.5 block text-sm text-slate-500">Бишкек шаары, Кызыл-Адыр 156</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-slate-300 group-hover:text-gold transition-colors"/>
              </a>
              <a href="https://wa.me/996501041617" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-white border border-gold/15 p-4 shadow-card hover:border-gold/40 hover:shadow-gold transition-all group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background:'#25D366' }}>
                  <Phone size={18}/>
                </div>
                <span className="flex-1 min-w-0">
                  <b className="block text-sm font-semibold text-navy">WhatsApp</b>
                  <span className="mt-0.5 block text-sm text-slate-500">+996 501 041 617</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-slate-300 group-hover:text-gold transition-colors"/>
              </a>
              <a href="https://www.instagram.com/quranacademy.kg" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-white border border-gold/15 p-4 shadow-card hover:border-gold/40 hover:shadow-gold transition-all group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ background:'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' }}>
                  <Instagram size={18}/>
                </div>
                <span className="flex-1 min-w-0">
                  <b className="block text-sm font-semibold text-navy">Instagram</b>
                  <span className="mt-0.5 block text-sm text-slate-500">@quranacademy.kg</span>
                </span>
                <ArrowUpRight size={16} className="shrink-0 text-slate-300 group-hover:text-gold transition-colors"/>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 bg-cream-2 border-t border-gold/20">
        <div className="container-x flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <MoonStar className="text-gold" size={20}/>
            <b className="text-sm tracking-[.18em] text-navy">QURAN ACADEMY</b>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} Quran Academy. Бардык укуктар корголгон.</p>
        </div>
      </footer>

      {showTop && (
        <button onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
          className="fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-gold/40 bg-white text-navy hover:bg-gold hover:text-white transition-all duration-300 shadow-gold"
          aria-label="Жогору">
          <ArrowUp size={18}/>
        </button>
      )}
    </main>
  );
}