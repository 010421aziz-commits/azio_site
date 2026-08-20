import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-errors';
import { z } from 'zod';

const dailyRoutineSchema = z.object({
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  order: z.number().int().nonnegative().optional(),
});

export async function GET() {
  return NextResponse.json(await prisma.dailyRoutine.findMany({ orderBy: [{ order: 'asc' }, { time: 'asc' }] }));
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    const data = dailyRoutineSchema.parse(await request.json());
    return NextResponse.json(await prisma.dailyRoutine.create({ data }), { status: 201 });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to create daily routine item');
  }
}