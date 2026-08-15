import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ title: z.string().min(3), slug: z.string().min(3).regex(/^[a-z0-9-]+$/), excerpt: z.string().min(10), content: z.string().min(20), image: z.string().optional(), published: z.boolean().optional() });
export async function GET() { return NextResponse.json(await prisma.news.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } })); }
export async function POST(request: NextRequest) { try { await requireAdmin(request); const data = schema.parse(await request.json()); return NextResponse.json(await prisma.news.create({ data: { ...data, publishedAt: data.published ? new Date() : null } }), { status: 201 }); } catch (error) { if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ error: 'Invalid news item' }, { status: 400 }); } }
