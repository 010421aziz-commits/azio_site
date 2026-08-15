import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';
import { z } from 'zod';

export async function GET() { return NextResponse.json(await prisma.setting.findMany()); }
export async function PUT(req: NextRequest) { try { await requireAdmin(req); const { key, value } = z.object({ key: z.string(), value: z.string() }).parse(await req.json()); return NextResponse.json(await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })); } catch (error) { if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); } }
