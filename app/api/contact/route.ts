import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validators';

export async function POST(req: Request) {
  const requestId = crypto.randomUUID();
  let body: unknown;
  try { body = await req.json(); } catch (error) {
    console.error('[contact] invalid JSON', { requestId, error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Маалымат туура эмес' }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('[contact] validation failed', { requestId, issues: parsed.error.issues.map(({ path, message, code }) => ({ path, message, code })) });
    return NextResponse.json({ error: 'Маалымат туура эмес', requestId }, { status: 400 });
  }
  const data = parsed.data;

  try {
    await prisma.message.create({ data: { name: data.name, email: data.email || null, phone: data.phone, message: data.message } });
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('[contact] Telegram configuration is missing', { requestId, hasBotToken: Boolean(token), hasChatId: Boolean(chatId) });
      return NextResponse.json({ error: 'Server configuration error', requestId }, { status: 500 });
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
      const telegramBody = await res.text();
      console.error('[contact] Telegram rejected request', { requestId, status: res.status, body: telegramBody.slice(0, 500) });
      return NextResponse.json({ error: 'Failed to send message', requestId }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('[contact] unexpected failure', {
      requestId,
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
      code: typeof error === 'object' && error !== null && 'code' in error ? error.code : undefined,
    });
    return NextResponse.json({ error: 'Failed to send message', requestId }, { status: 502 });
  }
}