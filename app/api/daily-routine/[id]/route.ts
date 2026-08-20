import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { apiErrorResponse } from '@/lib/api-errors';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
    await prisma.dailyRoutine.delete({ where: { id: Number((await params).id) } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiErrorResponse(error, 'Unable to delete daily routine item');
  }
}