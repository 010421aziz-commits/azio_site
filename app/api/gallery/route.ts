import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ image: z.string().min(1), caption: z.string().optional(), alt: z.string().optional(), order: z.number().int().optional() });
export async function GET() { return NextResponse.json(await prisma.gallery.findMany({ orderBy: { order: 'asc' } })); }
export async function POST(req: NextRequest) { try { await requireAdmin(req); return NextResponse.json(await prisma.gallery.create({ data: schema.parse(await req.json()) }), { status: 201 }); } catch (error) { if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ error: 'Invalid gallery data' }, { status: 400 }); } }
