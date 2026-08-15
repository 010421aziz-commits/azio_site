import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validators';

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Маалымат туура эмес' }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Маалымат туура эмес' }, { status: 400 });
  }
  const data = parsed.data;

  try {
    await prisma.message.create({ data: { name: data.name, email: data.email || null, phone: data.phone, message: data.message } });
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const text = [
      '📩 <b>Жаңы кабар</b>',
      '',
      `👤 <b>Аты-жөнү:</b> ${escapeHtml(data.name)}`,
      `📞 <b>Телефон:</b> ${escapeHtml(data.phone)}`,
      data.email ? `📧 <b>Email:</b> ${escapeHtml(data.email)}` : null,
      '',
      `💬 <b>Кабар:</b>\n${escapeHtml(data.message)}`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }
}