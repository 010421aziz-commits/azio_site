import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';
import { apiErrorResponse } from '@/lib/api-errors';

export async function GET() { return NextResponse.json(await prisma.setting.findMany()); }
export async function PUT(req: NextRequest) { try { await requireAdmin(req); const { key, value } = z.object({ key: z.string(), value: z.string() }).parse(await req.json()); return NextResponse.json(await prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })); } catch (error) { return apiErrorResponse(error, 'Unable to update setting'); } }
