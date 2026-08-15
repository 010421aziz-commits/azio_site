import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-errors';

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0 || file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'Сүрөт 8MB ашпоосу керек' }, { status: 400 });
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
    if (!allowed.has(file.type)) return NextResponse.json({ error: 'JPEG, PNG, WebP же AVIF гана колдоого алынат' }, { status: 400 });
    const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
    const folder = path.join(process.cwd(), process.env.UPLOAD_PATH || 'public/uploads');
    await mkdir(folder, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(folder, filename), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) { return apiErrorResponse(error, 'Upload failed'); }
}
