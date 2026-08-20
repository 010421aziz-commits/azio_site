import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const submissionSchema = z.object({ answers: z.record(z.string(), z.string().max(2000)) });

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Маалымат туура эмес' }, { status: 400 }); }
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Маалымат туура эмес' }, { status: 400 });

  const config = await prisma.formConfig.findUnique({ where: { id: 'main' }, include: { fields: { orderBy: { order: 'asc' } } } });
  if (!config || config.fields.length === 0) return NextResponse.json({ error: 'Форма азырынча жеткиликтүү эмес' }, { status: 503 });

  const answers: Record<string, string> = {};
  for (const field of config.fields) {
    const value = parsed.data.answers[field.name]?.trim() || '';
    if (field.required && !value) return NextResponse.json({ error: 'Милдеттүү талааларды толтуруңуз' }, { status: 400 });
    if (field.type === 'email' && value && !z.string().email().safeParse(value).success) return NextResponse.json({ error: 'Email туура эмес' }, { status: 400 });
    answers[field.name] = value;
  }

  await prisma.message.create({ data: { name: answers.name || '', email: answers.email || null, phone: answers.phone || '', message: answers.message || '', answers } });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const text = ['<b>Жаңы кабар</b>', '', ...config.fields.filter((field) => answers[field.name]).map((field) => `<b>${escapeHtml(field.label)}:</b> ${escapeHtml(answers[field.name])}`)].join('\n');
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }) });
    } catch (error) {
      console.error('[contact] Telegram notification failed', error);
    }
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}