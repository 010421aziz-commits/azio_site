import { NextResponse } from 'next/server';
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
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const text = [
      '📩 <b>Жаңы кабар</b>',
      '',
      `👤 <b>Аты-жөнү:</b> ${data.name}`,
      `📞 <b>Телефон:</b> ${data.phone}`,
      data.email ? `📧 <b>Email:</b> ${data.email}` : null,
      '',
      `💬 <b>Кабар:</b>\n${data.message}`,
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