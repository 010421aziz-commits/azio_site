import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { UnauthorizedError } from './auth';

export function apiErrorResponse(error: unknown, fallback = 'Internal server error') {
  if (error instanceof UnauthorizedError) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (error instanceof ZodError) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (error.code === 'P2002') return NextResponse.json({ error: 'Conflict' }, { status: 409 });
  }
  return NextResponse.json({ error: fallback }, { status: 500 });
}